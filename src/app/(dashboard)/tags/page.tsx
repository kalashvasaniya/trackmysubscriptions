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
  RiAlertLine,
  RiFileListLine,
  RiHashtag,
  RiArrowRightLine,
  RiSparklingLine,
} from "@remixicon/react"
import Link from "next/link"
import { useState, useEffect, useMemo } from "react"

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

  // Stats
  const stats = useMemo(() => {
    const totalSubscriptions = tags.reduce((sum, t) => sum + (t.subscriptionCount || 0), 0)
    const activeTags = tags.filter(t => (t.subscriptionCount || 0) > 0).length
    const unusedTags = tags.filter(t => (t.subscriptionCount || 0) === 0).length
    const mostUsedTag = tags.length > 0 
      ? tags.reduce((a, b) => ((a.subscriptionCount || 0) > (b.subscriptionCount || 0) ? a : b)) 
      : null
    const uniqueColors = new Set(tags.map(t => t.color)).size

    return { totalSubscriptions, activeTags, unusedTags, mostUsedTag, uniqueColors }
  }, [tags])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="size-16 rounded-full border-4 border-emerald-100 dark:border-emerald-900" />
            <div className="absolute inset-0 size-16 animate-spin rounded-full border-4 border-transparent border-t-emerald-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">Loading tags...</p>
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
      <div className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 dark:border-gray-800">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-white/10 blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-white">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                  <RiPriceTag3Line className="size-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold sm:text-3xl">Tags</h1>
                  <p className="mt-1 text-emerald-100">Categorize and filter your subscriptions with tags</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => setIsAdding(true)} 
              disabled={isAdding}
              className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-lg"
            >
              <RiAddLine className="mr-2 size-4" />
              Add Tag
            </Button>
          </div>

          {/* Quick Stats Pills */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <RiPriceTag3Line className="size-4" />
              <span className="font-medium">{tags.length} Tags</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <RiFileListLine className="size-4" />
              <span className="font-medium">{stats.totalSubscriptions} Tagged Items</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <RiHashtag className="size-4" />
              <span className="font-medium">{stats.activeTags} In Use</span>
            </div>
            {stats.uniqueColors > 0 && (
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
                <span className="font-medium">{stats.uniqueColors} Colors</span>
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
              <RiPriceTag3Line className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Total Tags</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">{tags.length}</p>
            <p className="mt-1 text-xs text-gray-500">tags created</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <RiFileListLine className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Tagged</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">{stats.totalSubscriptions}</p>
            <p className="mt-1 text-xs text-gray-500">subscriptions tagged</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <RiHashtag className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Active</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">{stats.activeTags}</p>
            <p className="mt-1 text-xs text-gray-500">tags in use</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <RiSparklingLine className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Most Used</span>
            </div>
            <p className="mt-2 truncate text-2xl font-bold text-gray-900 dark:text-gray-50">
              {stats.mostUsedTag?.name || "—"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {stats.mostUsedTag ? `${stats.mostUsedTag.subscriptionCount} items` : "no tags"}
            </p>
          </div>
        </div>

        {/* Add Tag Form */}
        {isAdding && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <RiAddLine className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">Create New Tag</h3>
                <p className="text-sm text-gray-500">Add a new tag to categorize your subscriptions</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
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

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Tags Display */}
          <div className="lg:col-span-8">
            {tags.length === 0 && !isAdding ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30">
                  <RiPriceTag3Line className="size-10 text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">No tags yet</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Create tags to categorize your subscriptions
                </p>
                <Button className="mt-6" onClick={() => setIsAdding(true)}>
                  <RiAddLine className="mr-2 size-4" />
                  Create your first tag
                </Button>
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                      <RiPriceTag3Line className="size-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-50">All Tags</h3>
                      <p className="text-sm text-gray-500">{tags.length} tag{tags.length !== 1 ? "s" : ""} total</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex flex-wrap gap-3">
                    {tags.map((tag) => (
                      <div
                        key={tag._id}
                        className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 py-3 pl-4 pr-3 transition-all hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
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
                              className="size-5 rounded-full shadow-sm"
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
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-4">
            {/* Color Overview */}
            {tags.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-50">Color Distribution</h3>
                <div className="space-y-3">
                  {colorOptions.map((opt) => {
                    const count = tags.filter(t => t.color === opt.color).length
                    if (count === 0) return null
                    const percentage = (count / tags.length) * 100
                    
                    return (
                      <div key={opt.color}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="size-3 rounded-full" style={{ backgroundColor: opt.color }} />
                            <span className="text-gray-600 dark:text-gray-400">{opt.name}</span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-50">{count}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${percentage}%`, backgroundColor: opt.color }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Unused Tags Warning */}
            {stats.unusedTags > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-900/20">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                    <RiAlertLine className="size-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900 dark:text-amber-400">Unused Tags</p>
                    <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                      You have {stats.unusedTags} tag{stats.unusedTags !== 1 ? "s" : ""} not assigned to any subscription.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pro Tip Footer */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-6 text-white">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <RiSparklingLine className="size-6" />
              </div>
              <div>
                <p className="text-lg font-semibold">Pro Tip: Filter & Organize</p>
                <p className="mt-1 text-emerald-100">
                  Use tags to quickly filter subscriptions by type, priority, or any custom category you prefer.
                </p>
              </div>
            </div>
            <Link
              href="/subscriptions"
              className="inline-flex items-center rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30"
            >
              Browse Subscriptions
              <RiArrowRightLine className="ml-2 size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
