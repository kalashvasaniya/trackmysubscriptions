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
import { getCurrencyList } from "@/lib/currency"
import { RiSaveLine, RiDeleteBinLine, RiDownloadLine } from "@remixicon/react"
import { useSession } from "next-auth/react"
import { useState } from "react"

const currencies = getCurrencyList()

const alertOptions = [
  { value: "1", label: "1 day before" },
  { value: "3", label: "3 days before" },
  { value: "5", label: "5 days before" },
  { value: "7", label: "7 days before" },
  { value: "14", label: "14 days before" },
]

export default function SettingsPage() {
  const { data: session } = useSession()

  const [name, setName] = useState(session?.user?.name || "")
  const [email, setEmail] = useState(session?.user?.email || "")
  const [currency, setCurrency] = useState("USD")
  const [defaultAlertDays, setDefaultAlertDays] = useState("3")
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)

  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  const handleSaveProfile = async () => {
    setIsSaving(true)
    setMessage("")

    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage("Profile updated successfully!")
    } catch {
      setMessage("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportData = async () => {
    try {
      const response = await fetch("/api/subscriptions/export")
      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `subscriptions-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
    } catch (error) {
      console.error("Export error:", error)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage your account preferences
        </p>
      </div>

      <div className="mt-8 max-w-2xl space-y-8">
        {/* Profile Settings */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Profile
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update your account information
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            {message && (
              <p
                className={`text-sm ${message.includes("success") ? "text-emerald-600" : "text-red-600"}`}
              >
                {message}
              </p>
            )}

            <Button onClick={handleSaveProfile} isLoading={isSaving}>
              <RiSaveLine className="mr-2 size-4" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Preferences
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Customize your experience
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Display Currency
              </label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.code} - {curr.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-gray-500">
                All amounts will be converted and displayed in this currency
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Default Alert Time
              </label>
              <Select
                value={defaultAlertDays}
                onValueChange={setDefaultAlertDays}
              >
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {alertOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-gray-500">
                Default reminder time for new subscriptions
              </p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Notifications
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Choose how you want to be notified
          </p>

          <div className="mt-6 space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-50">
                  Email Alerts
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive email notifications before subscription renewals
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-50">
                  Weekly Digest
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get a weekly summary of your upcoming payments
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Data Management */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Data Management
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Export or delete your data
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={handleExportData}>
              <RiDownloadLine className="mr-2 size-4" />
              Export All Data
            </Button>
            <Button variant="secondary" asChild>
              <a href="/api/subscriptions/template" download>
                <RiDownloadLine className="mr-2 size-4" />
                Download CSV Template
              </a>
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-900/20">
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-400">
            Danger Zone
          </h2>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">
            Irreversible actions for your account
          </p>

          <div className="mt-6">
            <Button variant="destructive">
              <RiDeleteBinLine className="mr-2 size-4" />
              Delete Account
            </Button>
            <p className="mt-2 text-xs text-red-600 dark:text-red-400">
              This will permanently delete your account and all associated data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
