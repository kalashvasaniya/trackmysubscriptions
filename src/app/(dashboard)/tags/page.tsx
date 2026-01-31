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

interface Tag {
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

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState(colorOptions[0])
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
      if (!response.ok) {
        throw new Error("Failed to fetch tags")
      }
      const data = await response.json()
      
      // Fetch subscription counts for each tag
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
      setNewTagColor(colorOptions[0])
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
      const response = await fetch(`/api/tags/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete tag")
      }

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
            Tags
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Add tags to categorize and filter your subscriptions
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <RiAddLine className="mr-2 size-4" />
          Add Tag
        </Button>
      </div>

      {/* Add Tag Form */}
      {isAdding && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
            Create New Tag
          </h3>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <Input
              placeholder="Tag name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
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
                    onClick={() => setNewTagColor(color)}
                    className={`size-6 rounded-full border-2 transition ${
                      newTagColor === color
                        ? "border-gray-900 dark:border-white"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddTag} disabled={saving || !newTagName.trim()}>
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

      {/* Tags List */}
      <div className="mt-6 flex flex-wrap gap-3">
        {tags.map((tag) => (
          <div
            key={tag._id}
            className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white py-2 pl-3 pr-2 transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            {editingId === tag._id ? (
              <>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-7 w-32 !py-0 text-sm"
                />
                <div className="flex gap-0.5">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setEditColor(color)}
                      className={`size-4 rounded-full border ${
                        editColor === color
                          ? "border-gray-900 dark:border-white"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <Button
                  variant="ghost"
                  className="!p-1"
                  onClick={() => handleUpdateTag(tag._id)}
                  disabled={saving}
                >
                  {saving ? (
                    <RiLoader4Line className="size-3.5 animate-spin text-gray-500" />
                  ) : (
                    <RiCheckLine className="size-3.5 text-emerald-500" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  className="!p-1"
                  onClick={() => setEditingId(null)}
                >
                  <RiCloseLine className="size-3.5 text-gray-500" />
                </Button>
              </>
            ) : (
              <>
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="font-medium text-gray-900 dark:text-gray-50">
                  {tag.name}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  {tag.subscriptionCount || 0}
                </span>
                <div className="flex gap-0.5 opacity-0 transition group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    className="!p-1"
                    onClick={() => startEdit(tag)}
                  >
                    <RiEditLine className="size-3.5 text-gray-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="!p-1"
                    onClick={() => handleDeleteTag(tag._id)}
                    disabled={deleting === tag._id}
                  >
                    {deleting === tag._id ? (
                      <RiLoader4Line className="size-3.5 animate-spin text-gray-500" />
                    ) : (
                      <RiDeleteBinLine className="size-3.5 text-red-500" />
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {tags.length === 0 && !isAdding && (
        <div className="mt-12 text-center">
          <div className="mx-auto size-12 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
            <svg
              className="size-full text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-50">
            No tags yet
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create tags to categorize your subscriptions
          </p>
          <Button className="mt-4" onClick={() => setIsAdding(true)}>
            <RiAddLine className="mr-2 size-4" />
            Create your first tag
          </Button>
        </div>
      )}
    </div>
  )
}
