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
} from "@remixicon/react"
import { useState, useEffect } from "react"

interface Folder {
  _id: string
  name: string
  color: string
  subscriptionCount?: number
}

const colorOptions = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#6B7280",
]

export default function FoldersPage() {
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderColor, setNewFolderColor] = useState(colorOptions[0])
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
      if (!response.ok) {
        throw new Error("Failed to fetch folders")
      }
      const data = await response.json()

      // Fetch subscription counts for each folder
      const foldersWithCounts = await Promise.all(
        data.map(async (folder: Folder) => {
          try {
            const countResponse = await fetch(`/api/folders/${folder._id}`)
            if (countResponse.ok) {
              const folderData = await countResponse.json()
              return {
                ...folder,
                subscriptionCount: folderData.subscriptionCount || 0,
              }
            }
            return { ...folder, subscriptionCount: 0 }
          } catch {
            return { ...folder, subscriptionCount: 0 }
          }
        }),
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
      setNewFolderColor(colorOptions[0])
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
      setFolders(
        folders.map((f) => (f._id === id ? { ...f, ...updatedFolder } : f)),
      )
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
      const response = await fetch(`/api/folders/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete folder")
      }

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
            Folders
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Organize your subscriptions into folders
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <RiAddLine className="mr-2 size-4" />
          Add Folder
        </Button>
      </div>

      {/* Add Folder Form */}
      {isAdding && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
            Create New Folder
          </h3>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="sm:w-64"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Color:
              </span>
              <div className="flex gap-1">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewFolderColor(color)}
                    className={`size-6 rounded-full border-2 transition ${
                      newFolderColor === color
                        ? "border-gray-900 dark:border-white"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddFolder}
                disabled={saving || !newFolderName.trim()}
              >
                {saving ? (
                  <RiLoader4Line className="mr-2 size-4 animate-spin" />
                ) : null}
                Create
              </Button>
              <Button variant="secondary" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Folders Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {folders.map((folder) => (
          <div
            key={folder._id}
            className="group rounded-lg border border-gray-200 bg-white p-4 transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            {editingId === folder._id ? (
              <div className="flex flex-col gap-3">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full"
                  placeholder="Folder name"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Color:
                  </span>
                  <div className="flex gap-1">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setEditColor(color)}
                        className={`size-5 rounded-full border-2 transition ${
                          editColor === color
                            ? "border-gray-900 dark:border-white"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleUpdateFolder(folder._id)}
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
                    size="sm"
                    variant="secondary"
                    onClick={() => setEditingId(null)}
                  >
                    <RiCloseLine className="mr-2 size-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="size-10 rounded-lg"
                    style={{ backgroundColor: `${folder.color}20` }}
                  >
                    <div
                      className="flex size-full items-center justify-center rounded-lg"
                      style={{ color: folder.color }}
                    >
                      <svg
                        className="size-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-50">
                      {folder.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {folder.subscriptionCount || 0} subscriptions
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    className="!p-1.5"
                    onClick={() => startEdit(folder)}
                  >
                    <RiEditLine className="size-4 text-gray-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="!p-1.5"
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
              </div>
            )}
          </div>
        ))}
      </div>

      {folders.length === 0 && !isAdding && (
        <div className="mt-12 text-center">
          <div className="mx-auto size-12 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
            <svg
              className="size-full text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          </div>
          <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-50">
            No folders yet
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create folders to organize your subscriptions
          </p>
          <Button className="mt-4" onClick={() => setIsAdding(true)}>
            <RiAddLine className="mr-2 size-4" />
            Create your first folder
          </Button>
        </div>
      )}
    </div>
  )
}
