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
import {
  RiSaveLine,
  RiDeleteBinLine,
  RiDownloadLine,
  RiLoader4Line,
} from "@remixicon/react"
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"

const currencies = getCurrencyList()

const alertOptions = [
  { value: "1", label: "1 day before" },
  { value: "3", label: "3 days before" },
  { value: "5", label: "5 days before" },
  { value: "7", label: "7 days before" },
  { value: "14", label: "14 days before" },
]

export default function SettingsPage() {
  const { data: session, update } = useSession()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [defaultAlertDays, setDefaultAlertDays] = useState("3")
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [isSaving, setIsSaving] = useState(false)
  const [isSavingPreferences, setIsSavingPreferences] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [message, setMessage] = useState("")
  const [preferencesMessage, setPreferencesMessage] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "")
      setEmail(session.user.email || "")
    }
    fetchUserProfile()
  }, [session])

  async function fetchUserProfile() {
    try {
      const response = await fetch("/api/users/profile")
      if (response.ok) {
        const user = await response.json()
        setName(user.name || "")
        setEmail(user.email || "")
        setCurrency(user.currency || "USD")
        setDefaultAlertDays(
          user.defaultAlertDays != null
            ? String(user.defaultAlertDays)
            : "3",
        )
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err)
    }
  }

  const handleSavePreferences = async () => {
    setIsSavingPreferences(true)
    setPreferencesMessage("")

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency,
          defaultAlertDays: Number(defaultAlertDays) || 3,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save preferences")
      }

      setPreferencesMessage("Preferences saved successfully!")
    } catch (err) {
      setPreferencesMessage(
        err instanceof Error ? err.message : "Failed to save preferences",
      )
    } finally {
      setIsSavingPreferences(false)
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    setMessage("")

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, currency }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update profile")
      }

      setMessage("Profile updated successfully!")
      // Update session
      await update({ name })
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordMessage("Passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      setPasswordMessage("Password must be at least 8 characters")
      return
    }

    setIsSavingPassword(true)
    setPasswordMessage("")

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to change password")
      }

      setPasswordMessage("Password changed successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setPasswordMessage(
        err instanceof Error ? err.message : "Failed to change password",
      )
    } finally {
      setIsSavingPassword(false)
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

  const handleDeleteAccount = async () => {
    const password = prompt(
      "Please enter your password to confirm account deletion:",
    )
    if (!password) return

    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    )
      return

    setIsDeleting(true)

    try {
      const response = await fetch("/api/users/profile", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete account")
      }

      // Sign out and redirect
      await signOut({ callbackUrl: "/" })
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete account")
    } finally {
      setIsDeleting(false)
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
                disabled
                placeholder="you@example.com"
                className="bg-gray-50 dark:bg-gray-800"
              />
              <p className="mt-1 text-xs text-gray-500">
                Email cannot be changed
              </p>
            </div>

            {message && (
              <p
                className={`text-sm ${message.includes("success") ? "text-emerald-600" : "text-red-600"}`}
              >
                {message}
              </p>
            )}

            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? (
                <RiLoader4Line className="mr-2 size-4 animate-spin" />
              ) : (
                <RiSaveLine className="mr-2 size-4" />
              )}
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

            {preferencesMessage && (
              <p
                className={`text-sm ${preferencesMessage.includes("success") ? "text-emerald-600" : "text-red-600"}`}
              >
                {preferencesMessage}
              </p>
            )}

            <Button
              onClick={handleSavePreferences}
              disabled={isSavingPreferences}
            >
              {isSavingPreferences ? (
                <RiLoader4Line className="mr-2 size-4 animate-spin" />
              ) : (
                <RiSaveLine className="mr-2 size-4" />
              )}
              Save Preferences
            </Button>
          </div>
        </div>

        {/* Password Change */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Change Password
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update your account password
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Password
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            {passwordMessage && (
              <p
                className={`text-sm ${passwordMessage.includes("success") ? "text-emerald-600" : "text-red-600"}`}
              >
                {passwordMessage}
              </p>
            )}

            <Button
              onClick={handleChangePassword}
              disabled={isSavingPassword || !currentPassword || !newPassword}
            >
              {isSavingPassword ? (
                <RiLoader4Line className="mr-2 size-4 animate-spin" />
              ) : (
                <RiSaveLine className="mr-2 size-4" />
              )}
              Change Password
            </Button>
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
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <RiLoader4Line className="mr-2 size-4 animate-spin" />
              ) : (
                <RiDeleteBinLine className="mr-2 size-4" />
              )}
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
