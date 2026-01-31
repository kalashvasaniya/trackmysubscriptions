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
  RiPriceTag3Line,
} from "@remixicon/react"
import { useState, useEffect } from "react"

interface Tag {
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

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState(colorOptions[0].color)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editColor, setEditColor] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchTags()
  }, [])

  async function fetchTags() {
    try {
      setLoading(true)
      const response = await fetch("/api/tags")
      if (!response.ok) throw new Error("Failed to fetch tags")
      const data = await response.json()

      const tagsWithCounts = await Promise.all(
        data.map(async (tag: Tag) => {
          try {
            const countResponse = await fetch(`/api/tags/${tag._id}`)
            if (countResponse.ok) {
              const tagData = await countResponse.json()
              return { ...tag, subscriptionCount: tagData.subscriptionCount || 0 }
            }
            return { ...tag, subscriptionCount: 0 }
          } catch {
            return { ...tag, subscriptionCount: 0 }
          }
        })
      )

      setTags(tagsWithCounts)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  async function handleAddTag() {
    if (!newTagName.trim()) return

    try {
      setSaving(true)
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTagName, color: newTagColor }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create tag")
      }

      const newTag = await response.json()
      setTags([...tags, { ...newTag, subscriptionCount: 0 }])
      setNewTagName("")
      setNewTagColor(colorOptions[0].color)
      setIsAdding(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create tag")
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdateTag(id: string) {
    if (!editName.trim()) return

    try {
      setSaving(true)
      const response = await fetch(`/api/tags/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, color: editColor }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update tag")
      }

      const updatedTag = await response.json()
      setTags(tags.map((t) => (t._id === id ? { ...t, ...updatedTag } : t)))
      setEditingId(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update tag")
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteTag(id: string) {
    if (!confirm("Are you sure you want to delete this tag?")) return

    try {
      setDeleting(id)
      const response = await fetch(`/api/tags/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete tag")
      setTags(tags.filter((t) => t._id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete tag")
    } finally {
      setDeleting(null)
    }
  }

  function startEdit(tag: Tag) {
    setEditingId(tag._id)
    setEditName(tag.name)
    setEditColor(tag.color)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RiLoader4Line className="size-12 animate-spin text-blue-500" />
          <p className="text-gray-500 dark:text-gray-400">Loading tags...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Tags</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Add tags to categorize and filter your subscriptions
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding} className="shadow-lg shadow-blue-500/25">
          <RiAddLine className="mr-2 size-4" />
          Add Tag
        </Button>
      </div>

      {/* Add Tag Form */}
      {isAdding && (
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Create New Tag</h3>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tag Name
              </label>
              <Input
                placeholder="Enter tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
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
                    onClick={() => setNewTagColor(opt.color)}
                    className={`size-8 rounded-full transition-all ${
                      newTagColor === opt.color
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
              <Button onClick={handleAddTag} disabled={saving || !newTagName.trim()}>
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

      {/* Tags Display */}
      {tags.length === 0 && !isAdding ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <RiPriceTag3Line className="size-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">No tags yet</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Create tags to categorize your subscriptions
          </p>
          <Button className="mt-4" onClick={() => setIsAdding(true)}>
            <RiAddLine className="mr-2 size-4" />
            Create your first tag
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-50">
            All Tags ({tags.length})
          </h3>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <div
                key={tag._id}
                className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-3 pr-2 transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
              >
                {editingId === tag._id ? (
                  <>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-8 w-32 !py-1 text-sm"
                    />
                    <div className="flex gap-1">
                      {colorOptions.map((opt) => (
                        <button
                          key={opt.color}
                          onClick={() => setEditColor(opt.color)}
                          className={`size-5 rounded-full transition-all ${
                            editColor === opt.color
                              ? "ring-2 ring-offset-1 ring-gray-900 dark:ring-white"
                              : "hover:scale-110"
                          }`}
                          style={{ backgroundColor: opt.color }}
                        />
                      ))}
                    </div>
                    <Button variant="ghost" className="!p-1.5" onClick={() => handleUpdateTag(tag._id)} disabled={saving}>
                      {saving ? (
                        <RiLoader4Line className="size-4 animate-spin text-gray-500" />
                      ) : (
                        <RiCheckLine className="size-4 text-emerald-500" />
                      )}
                    </Button>
                    <Button variant="ghost" className="!p-1.5" onClick={() => setEditingId(null)}>
                      <RiCloseLine className="size-4 text-gray-500" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div
                      className="size-4 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="font-medium text-gray-900 dark:text-gray-50">
                      {tag.name}
                    </span>
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-gray-600 shadow-sm dark:bg-gray-700 dark:text-gray-300">
                      {tag.subscriptionCount || 0}
                    </span>
                    <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button variant="ghost" className="!p-1.5" onClick={() => startEdit(tag)}>
                        <RiEditLine className="size-4 text-gray-500 hover:text-gray-700" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="!p-1.5"
                        onClick={() => handleDeleteTag(tag._id)}
                        disabled={deleting === tag._id}
                      >
                        {deleting === tag._id ? (
                          <RiLoader4Line className="size-4 animate-spin text-gray-500" />
                        ) : (
                          <RiDeleteBinLine className="size-4 text-red-500 hover:text-red-600" />
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
