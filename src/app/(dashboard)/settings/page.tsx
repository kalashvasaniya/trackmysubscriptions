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
import { Switch } from "@/components/ui/Switch"
import {
  RiSaveLine,
  RiDeleteBinLine,
  RiDownloadLine,
  RiLoader4Line,
  RiUserLine,
  RiSettings4Line,
  RiNotification3Line,
  RiDatabase2Line,
  RiAlertLine,
  RiShieldCheckLine,
  RiMailLine,
  RiGlobalLine,
  RiTimeLine,
  RiCheckboxCircleLine,
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

  const [isSaving, setIsSaving] = useState(false)
  const [isSavingPreferences, setIsSavingPreferences] = useState(false)
  const [isSavingNotifications, setIsSavingNotifications] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [message, setMessage] = useState("")
  const [preferencesMessage, setPreferencesMessage] = useState("")
  const [notificationsMessage, setNotificationsMessage] = useState("")

  useEffect(() => {
    fetchUserProfile()
  }, [])

  async function fetchUserProfile() {
    try {
      const response = await fetch("/api/users/profile")
      if (response.ok) {
        const user = await response.json()
        setName(user.name || "")
        setEmail(user.email || "")
        setCurrency(user.currency || "USD")
        setDefaultAlertDays(user.defaultAlertDays != null ? String(user.defaultAlertDays) : "3")
        setEmailAlerts(user.emailAlerts ?? true)
        setWeeklyDigest(user.weeklyDigest ?? false)
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
      setPreferencesMessage(err instanceof Error ? err.message : "Failed to save preferences")
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
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update profile")
      }

      setMessage("Profile updated successfully!")
      await update({ name })
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsSavingNotifications(true)
    setNotificationsMessage("")

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailAlerts, weeklyDigest }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save notification settings")
      }

      const data = await response.json()
      setEmailAlerts(data.emailAlerts ?? true)
      setWeeklyDigest(data.weeklyDigest ?? false)
      setNotificationsMessage("Notification settings saved successfully!")
    } catch (err) {
      setNotificationsMessage(err instanceof Error ? err.message : "Failed to save notification settings")
    } finally {
      setIsSavingNotifications(false)
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
    const confirmText = prompt('Type "DELETE" to confirm account deletion:')
    if (confirmText !== "DELETE") {
      if (confirmText !== null) {
        alert("Account deletion cancelled. You must type DELETE exactly.")
      }
      return
    }

    if (!confirm("Are you absolutely sure? This will permanently delete your account and all your data.")) return

    setIsDeleting(true)

    try {
      const response = await fetch("/api/users/profile", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmed: true }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete account")
      }

      await signOut({ callbackUrl: "/" })
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete account")
    } finally {
      setIsDeleting(false)
    }
  }

  const userName = session?.user?.name?.split(" ")[0] || name.split(" ")[0] || "there"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 dark:border-gray-800">
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-white/5 blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-white">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                  <RiSettings4Line className="size-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
                  <p className="mt-1 text-gray-300">Manage your account preferences and settings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Settings Summary Pills */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <RiGlobalLine className="size-4" />
              <span className="font-medium">{currencies.find(c => c.code === currency)?.code || "USD"}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <RiTimeLine className="size-4" />
              <span className="font-medium">{defaultAlertDays} day alert</span>
            </div>
            {emailAlerts && (
              <div className="flex items-center gap-2 rounded-full bg-emerald-500/30 px-4 py-2 text-sm text-white backdrop-blur-sm">
                <RiMailLine className="size-4" />
                <span className="font-medium">Email alerts on</span>
              </div>
            )}
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <RiShieldCheckLine className="size-4" />
              <span className="font-medium">Account secured</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-8">
            {/* Profile Settings */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-3 border-b border-gray-200 p-5 dark:border-gray-800">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <RiUserLine className="size-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-gray-50">Profile</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Update your account information</p>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <Input
                      type="email"
                      value={email}
                      disabled
                      placeholder="you@example.com"
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                    <p className="mt-1.5 text-xs text-gray-500">Managed by Google account</p>
                  </div>
                </div>

                {message && (
                  <div className={`flex items-center gap-2 rounded-xl p-4 text-sm ${message.includes("success") ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"}`}>
                    {message.includes("success") ? <RiCheckboxCircleLine className="size-5" /> : <RiAlertLine className="size-5" />}
                    {message}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? <RiLoader4Line className="mr-2 size-4 animate-spin" /> : <RiSaveLine className="mr-2 size-4" />}
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-3 border-b border-gray-200 p-5 dark:border-gray-800">
                <div className="flex size-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                  <RiGlobalLine className="size-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-gray-50">Preferences</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Customize your experience</p>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Display Currency</label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="w-full">
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
                    <p className="mt-1.5 text-xs text-gray-500">All amounts will be converted to this currency</p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Default Alert Time</label>
                    <Select value={defaultAlertDays} onValueChange={setDefaultAlertDays}>
                      <SelectTrigger className="w-full">
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
                    <p className="mt-1.5 text-xs text-gray-500">Default reminder time for new subscriptions</p>
                  </div>
                </div>

                {preferencesMessage && (
                  <div className={`flex items-center gap-2 rounded-xl p-4 text-sm ${preferencesMessage.includes("success") ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"}`}>
                    {preferencesMessage.includes("success") ? <RiCheckboxCircleLine className="size-5" /> : <RiAlertLine className="size-5" />}
                    {preferencesMessage}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button onClick={handleSavePreferences} disabled={isSavingPreferences}>
                    {isSavingPreferences ? <RiLoader4Line className="mr-2 size-4 animate-spin" /> : <RiSaveLine className="mr-2 size-4" />}
                    Save Preferences
                  </Button>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-3 border-b border-gray-200 p-5 dark:border-gray-800">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                  <RiNotification3Line className="size-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-gray-50">Notifications</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Choose how you want to be notified</p>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:hover:bg-gray-750">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <RiMailLine className="size-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-50">Email Alerts</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get notified before subscription renewals
                      </p>
                    </div>
                  </div>
                  <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:hover:bg-gray-750">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <RiTimeLine className="size-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-50">Weekly Digest</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Weekly summary of upcoming payments
                      </p>
                    </div>
                  </div>
                  <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
                </div>

                {notificationsMessage && (
                  <div className={`flex items-center gap-2 rounded-xl p-4 text-sm ${notificationsMessage.includes("success") ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"}`}>
                    {notificationsMessage.includes("success") ? <RiCheckboxCircleLine className="size-5" /> : <RiAlertLine className="size-5" />}
                    {notificationsMessage}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button onClick={handleSaveNotifications} disabled={isSavingNotifications}>
                    {isSavingNotifications ? <RiLoader4Line className="mr-2 size-4 animate-spin" /> : <RiSaveLine className="mr-2 size-4" />}
                    Save Notifications
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6 lg:col-span-4">
            {/* Data Management */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center gap-2">
                <RiDatabase2Line className="size-5 text-emerald-500" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">Data Management</h3>
              </div>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Export or manage your subscription data</p>

              <div className="space-y-2">
                <Button variant="secondary" className="w-full justify-start" onClick={handleExportData}>
                  <RiDownloadLine className="mr-2 size-4" />
                  Export All Data
                </Button>
                <Button variant="secondary" className="w-full justify-start" asChild>
                  <a href="/api/subscriptions/template" download>
                    <RiDownloadLine className="mr-2 size-4" />
                    Download CSV Template
                  </a>
                </Button>
              </div>
            </div>

            {/* Account Security */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/20">
                  <RiShieldCheckLine className="size-5" />
                </div>
                <div>
                  <p className="font-semibold">Account Secured</p>
                  <p className="mt-1 text-sm text-emerald-100">
                    Your account is protected with Google authentication
                  </p>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-900/20">
              <div className="mb-4 flex items-center gap-2">
                <RiAlertLine className="size-5 text-red-600 dark:text-red-400" />
                <h3 className="font-semibold text-red-900 dark:text-red-400">Danger Zone</h3>
              </div>

              <p className="mb-4 text-sm text-red-700 dark:text-red-300">
                Permanently delete your account and all data. This action cannot be undone.
              </p>

              <Button variant="destructive" className="w-full" onClick={handleDeleteAccount} disabled={isDeleting}>
                {isDeleting ? <RiLoader4Line className="mr-2 size-4 animate-spin" /> : <RiDeleteBinLine className="mr-2 size-4" />}
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
