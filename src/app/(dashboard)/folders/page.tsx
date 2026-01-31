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
} from "@remixicon/react"
import { useState, useEffect } from "react"

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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RiLoader4Line className="size-12 animate-spin text-blue-500" />
          <p className="text-gray-500 dark:text-gray-400">Loading folders...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Folders</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Organize your subscriptions into folders
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding} className="shadow-lg shadow-blue-500/25">
          <RiAddLine className="mr-2 size-4" />
          Add Folder
        </Button>
      </div>

      {/* Add Folder Form */}
      {isAdding && (
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Create New Folder</h3>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
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
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <RiFolderLine className="size-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">No folders yet</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Create folders to organize your subscriptions
          </p>
          <Button className="mt-4" onClick={() => setIsAdding(true)}>
            <RiAddLine className="mr-2 size-4" />
            Create your first folder
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {folders.map((folder) => (
            <div
              key={folder._id}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              {editingId === folder._id ? (
                <div className="space-y-4">
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
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="flex size-14 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${folder.color}20` }}
                      >
                        <RiFolderLine className="size-7" style={{ color: folder.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-50">{folder.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {folder.subscriptionCount || 0} subscriptions
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-4 top-4 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button variant="ghost" className="!p-2" onClick={() => startEdit(folder)}>
                      <RiEditLine className="size-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="!p-2"
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
    </div>
  )
}
