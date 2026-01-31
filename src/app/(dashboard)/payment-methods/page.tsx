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
  RiAlertLine,
  RiFileListLine,
  RiShieldCheckLine,
  RiArrowRightLine,
  RiWalletLine,
} from "@remixicon/react"
import Link from "next/link"
import { useState, useEffect, useMemo } from "react"

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

  // Stats
  const stats = useMemo(() => {
    const totalSubscriptions = paymentMethods.reduce((sum, m) => sum + (m.subscriptionCount || 0), 0)
    const activePaymentMethods = paymentMethods.filter(m => (m.subscriptionCount || 0) > 0).length
    const unusedMethods = paymentMethods.filter(m => (m.subscriptionCount || 0) === 0).length
    const mostUsedMethod = paymentMethods.length > 0 
      ? paymentMethods.reduce((a, b) => ((a.subscriptionCount || 0) > (b.subscriptionCount || 0) ? a : b)) 
      : null
    
    // Type breakdown
    const typeBreakdown: Record<string, number> = {}
    paymentMethods.forEach(m => {
      typeBreakdown[m.type] = (typeBreakdown[m.type] || 0) + 1
    })

    return { totalSubscriptions, activePaymentMethods, unusedMethods, mostUsedMethod, typeBreakdown }
  }, [paymentMethods])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="size-16 rounded-full border-4 border-pink-100 dark:border-pink-900" />
            <div className="absolute inset-0 size-16 animate-spin rounded-full border-4 border-transparent border-t-pink-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">Loading payment methods...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center p-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
          <RiAlertLine className="mx-auto mb-4 size-12 text-red-400" />
          <p className="text-lg font-medium text-red-600 dark:text-red-400">{error}</p>
          <Button variant="secondary" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 dark:border-gray-800">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-white/10 blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-white">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                  <RiBankCardLine className="size-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold sm:text-3xl">Payment Methods</h1>
                  <p className="mt-1 text-pink-100">Manage your cards and payment accounts</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => setIsAdding(true)} 
              disabled={isAdding}
              className="bg-white text-pink-600 hover:bg-pink-50 shadow-lg"
            >
              <RiAddLine className="mr-2 size-4" />
              Add Payment Method
            </Button>
          </div>

          {/* Quick Stats Pills */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <RiBankCardLine className="size-4" />
              <span className="font-medium">{paymentMethods.length} Methods</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <RiFileListLine className="size-4" />
              <span className="font-medium">{stats.totalSubscriptions} Subscriptions</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <RiWalletLine className="size-4" />
              <span className="font-medium">{stats.activePaymentMethods} In Use</span>
            </div>
            {stats.unusedMethods > 0 && (
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
                <span className="font-medium">{stats.unusedMethods} Unused</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* Quick Stats Cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <RiBankCardLine className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Total</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">{paymentMethods.length}</p>
            <p className="mt-1 text-xs text-gray-500">payment methods</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <RiFileListLine className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Linked</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">{stats.totalSubscriptions}</p>
            <p className="mt-1 text-xs text-gray-500">subscriptions linked</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <RiWalletLine className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Active</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">{stats.activePaymentMethods}</p>
            <p className="mt-1 text-xs text-gray-500">methods in use</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <RiShieldCheckLine className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Primary</span>
            </div>
            <p className="mt-2 truncate text-2xl font-bold text-gray-900 dark:text-gray-50">
              {stats.mostUsedMethod?.name || "—"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {stats.mostUsedMethod ? `${stats.mostUsedMethod.subscriptionCount} subscriptions` : "none set"}
            </p>
          </div>
        </div>

        {/* Add Form */}
        {isAdding && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-pink-100 dark:bg-pink-900/30">
                <RiAddLine className="size-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">Add New Payment Method</h3>
                <p className="text-sm text-gray-500">Add a card or payment account to track</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Payment Methods */}
          <div className="lg:col-span-8">
            {paymentMethods.length === 0 && !isAdding ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30">
                  <RiBankCardLine className="size-10 text-pink-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">No payment methods</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Add payment methods to track which cards/accounts are used
                </p>
                <Button className="mt-6" onClick={() => setIsAdding(true)}>
                  <RiAddLine className="mr-2 size-4" />
                  Add your first payment method
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                    >
                      {/* Color accent bar */}
                      <div className="h-1" style={{ backgroundColor: typeConfig.color }} />
                      
                      <div className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className="flex size-14 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
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

                        <div className="mt-5 flex items-center justify-between rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                          <div>
                            {method.lastFour && (
                              <p className="text-lg font-mono text-gray-900 dark:text-gray-50">
                                •••• {method.lastFour}
                              </p>
                            )}
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {method.subscriptionCount || 0} subscription{(method.subscriptionCount || 0) !== 1 ? "s" : ""}
                            </p>
                          </div>
                          {(method.subscriptionCount || 0) > 0 && (
                            <div className="flex size-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                              <RiCheckLine className="size-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button variant="ghost" className="!p-2 bg-white/80 dark:bg-gray-900/80" onClick={() => startEdit(method)}>
                          <RiEditLine className="size-4 text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          className="!p-2 bg-white/80 dark:bg-gray-900/80"
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

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-4">
            {/* Type Distribution */}
            {paymentMethods.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-50">Payment Types</h3>
                <div className="space-y-3">
                  {paymentTypes.map((type) => {
                    const count = stats.typeBreakdown[type.value] || 0
                    if (count === 0) return null
                    const percentage = (count / paymentMethods.length) * 100
                    const Icon = type.icon
                    
                    return (
                      <div key={type.value}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Icon className="size-4" style={{ color: type.color }} />
                            <span className="text-gray-600 dark:text-gray-400">{type.label}</span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-50">{count}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${percentage}%`, backgroundColor: type.color }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Unused Methods Warning */}
            {stats.unusedMethods > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-900/20">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                    <RiAlertLine className="size-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900 dark:text-amber-400">Unused Methods</p>
                    <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                      You have {stats.unusedMethods} payment method{stats.unusedMethods !== 1 ? "s" : ""} not linked to any subscription.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pro Tip Footer */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 p-6 text-white">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <RiShieldCheckLine className="size-6" />
              </div>
              <div>
                <p className="text-lg font-semibold">Pro Tip: Secure Storage</p>
                <p className="mt-1 text-pink-100">
                  Only the last 4 digits are stored for your reference. Full card details are never saved in our system.
                </p>
              </div>
            </div>
            <Link
              href="/subscriptions/new"
              className="inline-flex items-center rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30"
            >
              Add Subscription
              <RiArrowRightLine className="ml-2 size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
