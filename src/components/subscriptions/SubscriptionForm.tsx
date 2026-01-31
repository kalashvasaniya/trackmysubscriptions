"use client"

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
  RiLoader4Line,
  RiFileTextLine,
  RiFolderLine,
  RiPriceTag3Line,
  RiBankCardLine,
  RiNotification3Line,
  RiStickyNoteLine,
} from "@remixicon/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

/** Subscription from API may have folderId/paymentMethodId as populated objects. */
interface SubscriptionFormProps {
  subscription?: {
    _id: string
    name: string
    description?: string
    amount: number
    currency: string
    billingCycle: string
    nextBillingDate: string
    startDate: string
    status: string
    category?: string
    url?: string
    notes?: string
    alertDays: number
    alertEnabled: boolean
    folderId?: string | { _id: string; name?: string; color?: string }
    tagIds?: string[] | Array<{ _id: string } | string>
    paymentMethodId?: string | { _id: string; name?: string; type?: string; lastFour?: string }
  }
}

function normalizeId(value: string | { _id: string } | undefined): string {
  if (value == null) return ""
  if (typeof value === "string") return value
  return value._id ?? ""
}

function normalizeTagIds(value: string[] | Array<{ _id: string } | string> | undefined): string[] {
  if (!value || !Array.isArray(value)) return []
  return value.map((t) => (t && typeof t === "object" && "_id" in t ? t._id : String(t)))
}

interface Folder {
  _id: string
  name: string
  color: string
}

interface Tag {
  _id: string
  name: string
  color: string
}

interface PaymentMethod {
  _id: string
  name: string
  type: string
  lastFour?: string
}

const billingCycles = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
]

const statuses = [
  { value: "active", label: "Active" },
  { value: "trial", label: "Trial" },
  { value: "paused", label: "Paused" },
  { value: "cancelled", label: "Cancelled" },
]

const categories = [
  "Entertainment",
  "Music",
  "Development",
  "Design",
  "Productivity",
  "Cloud",
  "Marketing",
  "Finance",
  "Education",
  "Health",
  "Other",
]

const currencies = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "GBP", label: "GBP (£)", symbol: "£" },
  { value: "INR", label: "INR (₹)", symbol: "₹" },
  { value: "CAD", label: "CAD ($)", symbol: "$" },
  { value: "AUD", label: "AUD ($)", symbol: "$" },
  { value: "JPY", label: "JPY (¥)", symbol: "¥" },
]

/** Sentinel value for "None" in Select; empty string is reserved by Radix for clearing. */
const SELECT_NONE_VALUE = "__none__"

export function SubscriptionForm({ subscription }: SubscriptionFormProps) {
  const router = useRouter()
  const isEditing = !!subscription

  const [formData, setFormData] = useState(() => ({
    name: subscription?.name || "",
    description: subscription?.description || "",
    amount: subscription?.amount?.toString() || "",
    currency: subscription?.currency || "USD",
    billingCycle: subscription?.billingCycle || "monthly",
    nextBillingDate: subscription?.nextBillingDate
      ? new Date(subscription.nextBillingDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    startDate: subscription?.startDate
      ? new Date(subscription.startDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    status: subscription?.status || "active",
    category: subscription?.category || "",
    url: subscription?.url || "",
    notes: subscription?.notes || "",
    alertDays: subscription?.alertDays?.toString() || "3",
    alertEnabled: subscription?.alertEnabled ?? true,
    folderId: normalizeId(subscription?.folderId),
    tagIds: normalizeTagIds(subscription?.tagIds),
    paymentMethodId: normalizeId(subscription?.paymentMethodId),
  }))

  const [folders, setFolders] = useState<Folder[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loadingOptions, setLoadingOptions] = useState(true)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // When editing, sync form state when subscription prop is set/updated (normalize populated refs)
  useEffect(() => {
    if (!subscription) return
    setFormData({
      name: subscription.name || "",
      description: subscription.description || "",
      amount: subscription.amount?.toString() || "",
      currency: subscription.currency || "USD",
      billingCycle: subscription.billingCycle || "monthly",
      nextBillingDate: subscription.nextBillingDate
        ? new Date(subscription.nextBillingDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      startDate: subscription.startDate
        ? new Date(subscription.startDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      status: subscription.status || "active",
      category: subscription.category || "",
      url: subscription.url || "",
      notes: subscription.notes || "",
      alertDays: subscription.alertDays?.toString() || "3",
      alertEnabled: subscription.alertEnabled ?? true,
      folderId: normalizeId(subscription.folderId),
      paymentMethodId: normalizeId(subscription.paymentMethodId),
      tagIds: normalizeTagIds(subscription.tagIds),
    })
  }, [subscription?._id])

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [profileRes, foldersRes, tagsRes, paymentMethodsRes] =
          await Promise.all([
            fetch("/api/users/profile"),
            fetch("/api/folders"),
            fetch("/api/tags"),
            fetch("/api/payment-methods"),
          ])

        if (profileRes.ok && !isEditing) {
          const profile = await profileRes.json()
          const defaultDays =
            profile.defaultAlertDays != null
              ? String(profile.defaultAlertDays)
              : "3"
          setFormData((prev) => ({ ...prev, alertDays: defaultDays }))
        }

        if (foldersRes.ok) {
          const foldersData = await foldersRes.json()
          setFolders(foldersData)
        }

        if (tagsRes.ok) {
          const tagsData = await tagsRes.json()
          setTags(tagsData)
        }

        if (paymentMethodsRes.ok) {
          const paymentMethodsData = await paymentMethodsRes.json()
          setPaymentMethods(paymentMethodsData)
        }
      } catch (err) {
        console.error("Failed to fetch options:", err)
      } finally {
        setLoadingOptions(false)
      }
    }

    fetchOptions()
  }, [isEditing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const url = isEditing
        ? `/api/subscriptions/${subscription._id}`
        : "/api/subscriptions"

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          alertDays: parseInt(formData.alertDays),
          folderId: formData.folderId || undefined,
          paymentMethodId: formData.paymentMethodId || undefined,
          tagIds: formData.tagIds.length > 0 ? formData.tagIds : undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save subscription")
      }

      router.push("/subscriptions")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTagToggle = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/50">
            <RiFileTextLine className="size-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Basic Information
            </h2>
            <p className="text-sm text-gray-500">Enter subscription details</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Subscription Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Netflix, Spotify, GitHub Pro"
              required
              className="h-11"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description (optional)"
              className="h-11"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                {currencies.find((c) => c.value === formData.currency)?.symbol || "$"}
              </span>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="9.99"
                required
                className="h-11 pl-8"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Currency
            </label>
            <Select
              value={formData.currency}
              onValueChange={(value) => setFormData({ ...formData, currency: value })}
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((cur) => (
                  <SelectItem key={cur.value} value={cur.value}>
                    {cur.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Billing Cycle <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.billingCycle}
              onValueChange={(value) => setFormData({ ...formData, billingCycle: value })}
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {billingCycles.map((cycle) => (
                  <SelectItem key={cycle.value} value={cycle.value}>
                    {cycle.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`size-2 rounded-full ${
                          status.value === "active"
                            ? "bg-emerald-500"
                            : status.value === "trial"
                              ? "bg-amber-500"
                              : status.value === "paused"
                                ? "bg-blue-500"
                                : "bg-gray-400"
                        }`}
                      />
                      {status.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Next Billing Date <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formData.nextBillingDate}
              onChange={(e) => setFormData({ ...formData, nextBillingDate: e.target.value })}
              required
              className="h-11"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Date
            </label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="h-11"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <Select
              value={formData.category || SELECT_NONE_VALUE}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value === SELECT_NONE_VALUE ? "" : value })
              }
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SELECT_NONE_VALUE}>None</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Website URL
            </label>
            <Input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com"
              className="h-11"
            />
          </div>
        </div>
      </div>

      {/* Organization Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/50">
            <RiFolderLine className="size-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Organization
            </h2>
            <p className="text-sm text-gray-500">Organize with folders, tags & payment methods</p>
          </div>
        </div>

        {loadingOptions ? (
          <div className="flex items-center justify-center py-8">
            <RiLoader4Line className="size-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <RiFolderLine className="size-4 text-gray-400" />
                  Folder
                </label>
                <Select
                  value={formData.folderId || SELECT_NONE_VALUE}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      folderId: value === SELECT_NONE_VALUE ? "" : value,
                    })
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select folder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SELECT_NONE_VALUE}>None</SelectItem>
                    {folders.map((folder) => (
                      <SelectItem key={folder._id} value={folder._id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="size-3 rounded-full"
                            style={{ backgroundColor: folder.color }}
                          />
                          {folder.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {folders.length === 0 && (
                  <p className="mt-1.5 text-xs text-gray-500">
                    No folders yet. Create one in the Folders page.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <RiBankCardLine className="size-4 text-gray-400" />
                  Payment Method
                </label>
                <Select
                  value={formData.paymentMethodId || SELECT_NONE_VALUE}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      paymentMethodId: value === SELECT_NONE_VALUE ? "" : value,
                    })
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SELECT_NONE_VALUE}>None</SelectItem>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method._id} value={method._id}>
                        {method.name}
                        {method.lastFour && ` •••• ${method.lastFour}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {paymentMethods.length === 0 && (
                  <p className="mt-1.5 text-xs text-gray-500">
                    No payment methods yet. Add one in Payment Methods.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <RiPriceTag3Line className="size-4 text-gray-400" />
                Tags
              </label>
              {tags.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800/50">
                  <RiPriceTag3Line className="mx-auto mb-2 size-6 text-gray-400" />
                  <p className="text-sm text-gray-500">No tags available</p>
                  <p className="text-xs text-gray-400">Create tags in the Tags page</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag._id}
                      type="button"
                      onClick={() => handleTagToggle(tag._id)}
                      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                        formData.tagIds.includes(tag._id)
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-900/30 dark:text-blue-400"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Alerts & Notifications */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/50">
            <RiNotification3Line className="size-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Alerts & Notifications
            </h2>
            <p className="text-sm text-gray-500">Get reminded before payments are due</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Remind me
            </label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min="0"
                max="30"
                value={formData.alertDays}
                onChange={(e) => setFormData({ ...formData, alertDays: e.target.value })}
                className="h-11 w-24"
              />
              <span className="text-sm text-gray-500">days before billing</span>
            </div>
          </div>

          <div className="flex items-center">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
              <input
                type="checkbox"
                checked={formData.alertEnabled}
                onChange={(e) => setFormData({ ...formData, alertEnabled: e.target.checked })}
                className="size-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email alerts
                </span>
                <p className="text-xs text-gray-500">Receive email reminders</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
            <RiStickyNoteLine className="size-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Notes
            </h2>
            <p className="text-sm text-gray-500">Add any additional information</p>
          </div>
        </div>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:bg-gray-900"
          placeholder="Add any notes about this subscription..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEditing ? "Update Subscription" : "Add Subscription"}
        </Button>
      </div>
    </form>
  )
}
