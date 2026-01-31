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
import { RiLoader4Line } from "@remixicon/react"
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
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-50">
          Basic Information
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Subscription Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Netflix, Spotify"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Optional description"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="9.99"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Currency
            </label>
            <Select
              value={formData.currency}
              onValueChange={(value) =>
                setFormData({ ...formData, currency: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="INR">INR (₹)</SelectItem>
                <SelectItem value="CAD">CAD ($)</SelectItem>
                <SelectItem value="AUD">AUD ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Billing Cycle *
            </label>
            <Select
              value={formData.billingCycle}
              onValueChange={(value) =>
                setFormData({ ...formData, billingCycle: value })
              }
            >
              <SelectTrigger>
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
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Next Billing Date *
            </label>
            <Input
              type="date"
              value={formData.nextBillingDate}
              onChange={(e) =>
                setFormData({ ...formData, nextBillingDate: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Date
            </label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Website URL
            </label>
            <Input
              type="url"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>

      {/* Organization Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-50">
          Organization
        </h2>

        {loadingOptions ? (
          <div className="flex items-center justify-center py-4">
            <RiLoader4Line className="size-5 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                <SelectTrigger>
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
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Payment Method
              </label>
              <Select
                value={formData.paymentMethodId || SELECT_NONE_VALUE}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    paymentMethodId:
                      value === SELECT_NONE_VALUE ? "" : value,
                  })
                }
              >
                <SelectTrigger>
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
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags
              </label>
              {tags.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No tags available. Create tags in the Tags page.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag._id}
                      type="button"
                      onClick={() => handleTagToggle(tag._id)}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
                        formData.tagIds.includes(tag._id)
                          ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
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

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-50">
          Alerts & Notifications
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Alert Days Before
            </label>
            <Input
              type="number"
              min="0"
              max="30"
              value={formData.alertDays}
              onChange={(e) =>
                setFormData({ ...formData, alertDays: e.target.value })
              }
            />
            <p className="mt-1 text-xs text-gray-500">
              Days before billing to receive alert
            </p>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.alertEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, alertEnabled: e.target.checked })
                }
                className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable email alerts
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-50">
          Notes
        </h2>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
          placeholder="Add any notes about this subscription..."
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEditing ? "Update Subscription" : "Add Subscription"}
        </Button>
      </div>
    </form>
  )
}
