"use client"

import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import {
  RiAddLine,
  RiBankCardLine,
  RiDeleteBinLine,
  RiEditLine,
  RiPaypalLine,
  RiBankLine,
  RiLoader4Line,
  RiCheckLine,
  RiCloseLine,
} from "@remixicon/react"
import { useState, useEffect } from "react"

interface PaymentMethod {
  _id: string
  name: string
  type: string
  lastFour?: string | null
  subscriptionCount?: number
}

const paymentTypes = [
  { value: "credit_card", label: "Credit Card", icon: RiBankCardLine },
  { value: "debit_card", label: "Debit Card", icon: RiBankCardLine },
  { value: "paypal", label: "PayPal", icon: RiPaypalLine },
  { value: "bank_account", label: "Bank Account", icon: RiBankLine },
  { value: "other", label: "Other", icon: RiBankCardLine },
]

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newName, setNewName] = useState("")
  const [newType, setNewType] = useState("credit_card")
  const [newLastFour, setNewLastFour] = useState("")
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editType, setEditType] = useState("")
  const [editLastFour, setEditLastFour] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  async function fetchPaymentMethods() {
    try {
      setLoading(true)
      const response = await fetch("/api/payment-methods")
      if (!response.ok) {
        throw new Error("Failed to fetch payment methods")
      }
      const data = await response.json()

      // Fetch subscription counts for each payment method
      const methodsWithCounts = await Promise.all(
        data.map(async (method: PaymentMethod) => {
          try {
            const countResponse = await fetch(`/api/payment-methods/${method._id}`)
            if (countResponse.ok) {
              const methodData = await countResponse.json()
              return {
                ...method,
                subscriptionCount: methodData.subscriptionCount || 0,
              }
            }
            return { ...method, subscriptionCount: 0 }
          } catch {
            return { ...method, subscriptionCount: 0 }
          }
        }),
      )

      setPaymentMethods(methodsWithCounts)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  async function handleAddPaymentMethod() {
    if (!newName.trim()) return

    try {
      setSaving(true)
      const response = await fetch("/api/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          type: newType,
          lastFour: newLastFour || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create payment method")
      }

      const newMethod = await response.json()
      setPaymentMethods([...paymentMethods, { ...newMethod, subscriptionCount: 0 }])
      setNewName("")
      setNewType("credit_card")
      setNewLastFour("")
      setIsAdding(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create payment method")
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdatePaymentMethod(id: string) {
    if (!editName.trim()) return

    try {
      setSaving(true)
      const response = await fetch(`/api/payment-methods/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          type: editType,
          lastFour: editLastFour || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update payment method")
      }

      const updatedMethod = await response.json()
      setPaymentMethods(
        paymentMethods.map((m) =>
          m._id === id ? { ...m, ...updatedMethod } : m,
        ),
      )
      setEditingId(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update payment method")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this payment method?")) return

    try {
      setDeleting(id)
      const response = await fetch(`/api/payment-methods/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete payment method")
      }

      setPaymentMethods(paymentMethods.filter((m) => m._id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete payment method")
    } finally {
      setDeleting(null)
    }
  }

  function startEdit(method: PaymentMethod) {
    setEditingId(method._id)
    setEditName(method.name)
    setEditType(method.type)
    setEditLastFour(method.lastFour || "")
  }

  const getTypeIcon = (type: string) => {
    const paymentType = paymentTypes.find((t) => t.value === type)
    return paymentType?.icon || RiBankCardLine
  }

  const getTypeLabel = (type: string) => {
    const paymentType = paymentTypes.find((t) => t.value === type)
    return paymentType?.label || type
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center p-4 sm:p-6 lg:p-8">
        <RiLoader4Line className="size-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Payment Methods
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your payment methods for subscriptions
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <RiAddLine className="mr-2 size-4" />
          Add Payment Method
        </Button>
      </div>

      {/* Add Payment Method Form */}
      {isAdding && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
            Add New Payment Method
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-4">
            <Input
              placeholder="Name (e.g., Main Credit Card)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Select value={newType} onValueChange={setNewType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Last 4 digits (optional)"
              value={newLastFour}
              onChange={(e) =>
                setNewLastFour(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              maxLength={4}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAddPaymentMethod}
                disabled={saving || !newName.trim()}
              >
                {saving ? (
                  <RiLoader4Line className="mr-2 size-4 animate-spin" />
                ) : null}
                Add
              </Button>
              <Button variant="secondary" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods List */}
      <div className="mt-6 space-y-4">
        {paymentMethods.map((method) => {
          const Icon = getTypeIcon(method.type)

          if (editingId === method._id) {
            return (
              <div
                key={method._id}
                className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="grid gap-4 sm:grid-cols-4">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Name"
                  />
                  <Select value={editType} onValueChange={setEditType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Last 4 digits"
                    value={editLastFour}
                    onChange={(e) =>
                      setEditLastFour(
                        e.target.value.replace(/\D/g, "").slice(0, 4),
                      )
                    }
                    maxLength={4}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleUpdatePaymentMethod(method._id)}
                      disabled={saving}
                    >
                      {saving ? (
                        <RiLoader4Line className="mr-2 size-4 animate-spin" />
                      ) : (
                        <RiCheckLine className="mr-2 size-4" />
                      )}
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setEditingId(null)}
                    >
                      <RiCloseLine className="mr-2 size-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )
          }

          return (
            <div
              key={method._id}
              className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <Icon className="size-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-50">
                    {method.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="neutral" className="rounded-full">
                      {getTypeLabel(method.type)}
                    </Badge>
                    {method.lastFour && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        •••• {method.lastFour}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {method.subscriptionCount || 0} subscriptions
                </span>
                <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    className="!p-2"
                    onClick={() => startEdit(method)}
                  >
                    <RiEditLine className="size-4 text-gray-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="!p-2"
                    onClick={() => handleDelete(method._id)}
                    disabled={deleting === method._id}
                  >
                    {deleting === method._id ? (
                      <RiLoader4Line className="size-4 animate-spin text-gray-500" />
                    ) : (
                      <RiDeleteBinLine className="size-4 text-red-500" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {paymentMethods.length === 0 && !isAdding && (
        <div className="mt-12 text-center">
          <div className="mx-auto size-12 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
            <RiBankCardLine className="size-full text-gray-400" />
          </div>
          <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-50">
            No payment methods
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add payment methods to track which cards/accounts are used
          </p>
          <Button className="mt-4" onClick={() => setIsAdding(true)}>
            <RiAddLine className="mr-2 size-4" />
            Add your first payment method
          </Button>
        </div>
      )}
    </div>
  )
}
