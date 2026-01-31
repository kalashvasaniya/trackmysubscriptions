"use client"

import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import {
  RiAddLine,
  RiDeleteBinLine,
  RiEditLine,
  RiLoader4Line,
  RiCheckLine,
  RiCloseLine,
  RiFolderLine,
  RiAlertLine,
  RiFolderOpenLine,
  RiFileListLine,
  RiArrowRightLine,
} from "@remixicon/react"
import Link from "next/link"
import { useState, useEffect, useMemo } from "react"

interface Folder {
  _id: string
  name: string
  color: string
  subscriptionCount?: number
}

const colorOptions = [
  { color: "#3B82F6", name: "Blue" },
  { color: "#10B981", name: "Emerald" },
  { color: "#F59E0B", name: "Amber" },
  { color: "#EF4444", name: "Red" },
  { color: "#8B5CF6", name: "Purple" },
  { color: "#EC4899", name: "Pink" },
  { color: "#06B6D4", name: "Cyan" },
  { color: "#6B7280", name: "Gray" },
]

export default function FoldersPage() {
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderColor, setNewFolderColor] = useState(colorOptions[0].color)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editColor, setEditColor] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchFolders()
  }, [])

  async function fetchFolders() {
    try {
      setLoading(true)
      const response = await fetch("/api/folders")
      if (!response.ok) throw new Error("Failed to fetch folders")
      const data = await response.json()

      const foldersWithCounts = await Promise.all(
        data.map(async (folder: Folder) => {
          try {
            const countResponse = await fetch(`/api/folders/${folder._id}`)
            if (countResponse.ok) {
              const folderData = await countResponse.json()
              return { ...folder, subscriptionCount: folderData.subscriptionCount || 0 }
            }
            return { ...folder, subscriptionCount: 0 }
          } catch {
            return { ...folder, subscriptionCount: 0 }
          }
        })
      )

      setFolders(foldersWithCounts)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  async function handleAddFolder() {
    if (!newFolderName.trim()) return

    try {
      setSaving(true)
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFolderName, color: newFolderColor }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create folder")
      }

      const newFolder = await response.json()
      setFolders([...folders, { ...newFolder, subscriptionCount: 0 }])
      setNewFolderName("")
      setNewFolderColor(colorOptions[0].color)
      setIsAdding(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create folder")
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdateFolder(id: string) {
    if (!editName.trim()) return

    try {
      setSaving(true)
      const response = await fetch(`/api/folders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, color: editColor }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update folder")
      }

      const updatedFolder = await response.json()
      setFolders(folders.map((f) => (f._id === id ? { ...f, ...updatedFolder } : f)))
      setEditingId(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update folder")
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteFolder(id: string) {
    if (!confirm("Are you sure you want to delete this folder?")) return

    try {
      setDeleting(id)
      const response = await fetch(`/api/folders/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete folder")
      setFolders(folders.filter((f) => f._id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete folder")
    } finally {
      setDeleting(null)
    }
  }

  function startEdit(folder: Folder) {
    setEditingId(folder._id)
    setEditName(folder.name)
    setEditColor(folder.color)
  }

  // Stats
  const stats = useMemo(() => {
    const totalSubscriptions = folders.reduce((sum, f) => sum + (f.subscriptionCount || 0), 0)
    const activeFolders = folders.filter(f => (f.subscriptionCount || 0) > 0).length
    const emptyFolders = folders.filter(f => (f.subscriptionCount || 0) === 0).length
    const largestFolder = folders.length > 0 
      ? folders.reduce((a, b) => ((a.subscriptionCount || 0) > (b.subscriptionCount || 0) ? a : b)) 
      : null
    
    return { totalSubscriptions, activeFolders, emptyFolders, largestFolder }
  }, [folders])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="size-16 rounded-full border-4 border-amber-100 dark:border-amber-900" />
            <div className="absolute inset-0 size-16 animate-spin rounded-full border-4 border-transparent border-t-amber-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">Loading folders...</p>
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
      <div className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 dark:border-gray-800">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-white/10 blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-white">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                  <RiFolderLine className="size-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold sm:text-3xl">Folders</h1>
                  <p className="mt-1 text-amber-100">Organize your subscriptions into folders</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => setIsAdding(true)} 
              disabled={isAdding}
              className="bg-white text-amber-600 hover:bg-amber-50 shadow-lg"
            >
              <RiAddLine className="mr-2 size-4" />
              Add Folder
            </Button>
          </div>

          {/* Quick Stats Pills */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <RiFolderLine className="size-4" />
              <span className="font-medium">{folders.length} Folders</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <RiFileListLine className="size-4" />
              <span className="font-medium">{stats.totalSubscriptions} Subscriptions</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <RiFolderOpenLine className="size-4" />
              <span className="font-medium">{stats.activeFolders} Active</span>
            </div>
            {stats.emptyFolders > 0 && (
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
                <span className="font-medium">{stats.emptyFolders} Empty</span>
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
              <RiFolderLine className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Total Folders</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">{folders.length}</p>
            <p className="mt-1 text-xs text-gray-500">folders created</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <RiFileListLine className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Subscriptions</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">{stats.totalSubscriptions}</p>
            <p className="mt-1 text-xs text-gray-500">organized in folders</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <RiFolderOpenLine className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Active</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">{stats.activeFolders}</p>
            <p className="mt-1 text-xs text-gray-500">folders with items</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <RiFolderLine className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Largest</span>
            </div>
            <p className="mt-2 truncate text-2xl font-bold text-gray-900 dark:text-gray-50">
              {stats.largestFolder?.name || "—"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {stats.largestFolder ? `${stats.largestFolder.subscriptionCount} items` : "no folders"}
            </p>
          </div>
        </div>

        {/* Add Folder Form */}
        {isAdding && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                <RiAddLine className="size-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">Create New Folder</h3>
                <p className="text-sm text-gray-500">Add a new folder to organize your subscriptions</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Folder Name
                </label>
                <Input
                  placeholder="Enter folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Color
                </label>
                <div className="flex gap-2">
                  {colorOptions.map((opt) => (
                    <button
                      key={opt.color}
                      onClick={() => setNewFolderColor(opt.color)}
                      className={`size-8 rounded-full transition-all ${
                        newFolderColor === opt.color
                          ? "ring-2 ring-offset-2 ring-gray-900 dark:ring-white"
                          : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: opt.color }}
                      title={opt.name}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddFolder} disabled={saving || !newFolderName.trim()}>
                  {saving ? <RiLoader4Line className="mr-2 size-4 animate-spin" /> : <RiCheckLine className="mr-2 size-4" />}
                  Create
                </Button>
                <Button variant="secondary" onClick={() => setIsAdding(false)}>
                  <RiCloseLine className="mr-2 size-4" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Folders Grid */}
        {folders.length === 0 && !isAdding ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
              <RiFolderLine className="size-10 text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">No folders yet</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Create folders to organize your subscriptions
            </p>
            <Button className="mt-6" onClick={() => setIsAdding(true)}>
              <RiAddLine className="mr-2 size-4" />
              Create your first folder
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {folders.map((folder) => (
              <div
                key={folder._id}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                {editingId === folder._id ? (
                  <div className="p-5 space-y-4">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Folder name"
                    />
                    <div>
                      <label className="mb-2 block text-xs font-medium text-gray-500">Color</label>
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map((opt) => (
                          <button
                            key={opt.color}
                            onClick={() => setEditColor(opt.color)}
                            className={`size-6 rounded-full transition-all ${
                              editColor === opt.color
                                ? "ring-2 ring-offset-2 ring-gray-900 dark:ring-white"
                                : "hover:scale-110"
                            }`}
                            style={{ backgroundColor: opt.color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUpdateFolder(folder._id)} disabled={saving}>
                        {saving ? <RiLoader4Line className="mr-1 size-4 animate-spin" /> : <RiCheckLine className="mr-1 size-4" />}
                        Save
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Color accent bar */}
                    <div className="h-1" style={{ backgroundColor: folder.color }} />
                    
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className="flex size-14 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                            style={{ backgroundColor: `${folder.color}15` }}
                          >
                            <RiFolderLine className="size-7" style={{ color: folder.color }} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-50">{folder.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {folder.subscriptionCount || 0} subscription{(folder.subscriptionCount || 0) !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress indicator */}
                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min((folder.subscriptionCount || 0) * 10, 100)}%`,
                            backgroundColor: folder.color,
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Hover actions */}
                    <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button variant="ghost" className="!p-2 bg-white/80 dark:bg-gray-900/80" onClick={() => startEdit(folder)}>
                        <RiEditLine className="size-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="!p-2 bg-white/80 dark:bg-gray-900/80"
                        onClick={() => handleDeleteFolder(folder._id)}
                        disabled={deleting === folder._id}
                      >
                        {deleting === folder._id ? (
                          <RiLoader4Line className="size-4 animate-spin text-gray-500" />
                        ) : (
                          <RiDeleteBinLine className="size-4 text-red-500" />
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pro Tip Footer */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-white">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <RiFolderOpenLine className="size-6" />
              </div>
              <div>
                <p className="text-lg font-semibold">Pro Tip: Organize Better</p>
                <p className="mt-1 text-amber-100">
                  Assign subscriptions to folders when creating or editing them for better organization and tracking.
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
