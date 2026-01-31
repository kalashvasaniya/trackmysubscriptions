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
  { value: "credit_card", label: "Credit Card", icon: RiBankCardLine, color: "#3B82F6" },
  { value: "debit_card", label: "Debit Card", icon: RiBankCardLine, color: "#10B981" },
  { value: "paypal", label: "PayPal", icon: RiPaypalLine, color: "#0070BA" },
  { value: "bank_account", label: "Bank Account", icon: RiBankLine, color: "#8B5CF6" },
  { value: "other", label: "Other", icon: RiBankCardLine, color: "#6B7280" },
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
      if (!response.ok) throw new Error("Failed to fetch payment methods")
      const data = await response.json()

      const methodsWithCounts = await Promise.all(
        data.map(async (method: PaymentMethod) => {
          try {
            const countResponse = await fetch(`/api/payment-methods/${method._id}`)
            if (countResponse.ok) {
              const methodData = await countResponse.json()
              return { ...method, subscriptionCount: methodData.subscriptionCount || 0 }
            }
            return { ...method, subscriptionCount: 0 }
          } catch {
            return { ...method, subscriptionCount: 0 }
          }
        })
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
      setPaymentMethods(paymentMethods.map((m) => (m._id === id ? { ...m, ...updatedMethod } : m)))
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
      const response = await fetch(`/api/payment-methods/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete payment method")
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

  const getTypeConfig = (type: string) => {
    return paymentTypes.find((t) => t.value === type) || paymentTypes[4]
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RiLoader4Line className="size-12 animate-spin text-blue-500" />
          <p className="text-gray-500 dark:text-gray-400">Loading payment methods...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center p-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Payment Methods</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your payment methods for subscriptions
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding} className="shadow-lg shadow-blue-500/25">
          <RiAddLine className="mr-2 size-4" />
          Add Payment Method
        </Button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Add New Payment Method</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <Input
                placeholder="e.g., Main Credit Card"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
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
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Last 4 Digits</label>
              <Input
                placeholder="Optional"
                value={newLastFour}
                onChange={(e) => setNewLastFour(e.target.value.replace(/\D/g, "").slice(0, 4))}
                maxLength={4}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleAddPaymentMethod} disabled={saving || !newName.trim()}>
                {saving ? <RiLoader4Line className="mr-2 size-4 animate-spin" /> : <RiCheckLine className="mr-2 size-4" />}
                Add
              </Button>
              <Button variant="secondary" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods */}
      {paymentMethods.length === 0 && !isAdding ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <RiBankCardLine className="size-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">No payment methods</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Add payment methods to track which cards/accounts are used
          </p>
          <Button className="mt-4" onClick={() => setIsAdding(true)}>
            <RiAddLine className="mr-2 size-4" />
            Add your first payment method
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paymentMethods.map((method) => {
            const typeConfig = getTypeConfig(method.type)
            const Icon = typeConfig.icon

            if (editingId === method._id) {
              return (
                <div
                  key={method._id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="space-y-4">
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" />
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
                      onChange={(e) => setEditLastFour(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength={4}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUpdatePaymentMethod(method._id)} disabled={saving}>
                        {saving ? <RiLoader4Line className="mr-1 size-4 animate-spin" /> : <RiCheckLine className="mr-1 size-4" />}
                        Save
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>
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
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex size-14 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${typeConfig.color}15` }}
                    >
                      <Icon className="size-7" style={{ color: typeConfig.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-50">{method.name}</h3>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="neutral" className="rounded-full">
                          {typeConfig.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                  <div>
                    {method.lastFour && (
                      <p className="text-lg font-mono text-gray-900 dark:text-gray-50">
                        •••• {method.lastFour}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {method.subscriptionCount || 0} subscriptions
                    </p>
                  </div>
                </div>

                <div className="absolute right-4 top-4 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="ghost" className="!p-2" onClick={() => startEdit(method)}>
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
            )
          })}
        </div>
      )}
    </div>
  )
}
