"use client"

import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { RiAddLine, RiDeleteBinLine, RiEditLine } from "@remixicon/react"
import { useState } from "react"

// Mock data - will be replaced with API call
const mockTags = [
  { id: "1", name: "Essential", color: "#10B981", subscriptionCount: 8 },
  { id: "2", name: "Trial", color: "#F59E0B", subscriptionCount: 2 },
  { id: "3", name: "Annual", color: "#3B82F6", subscriptionCount: 5 },
  { id: "4", name: "Can Cancel", color: "#EF4444", subscriptionCount: 3 },
  { id: "5", name: "Business", color: "#8B5CF6", subscriptionCount: 6 },
]

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
  const [tags, setTags] = useState(mockTags)
  const [isAdding, setIsAdding] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState(colorOptions[0])

  const handleAddTag = () => {
    if (!newTagName.trim()) return

    const newTag = {
      id: Date.now().toString(),
      name: newTagName,
      color: newTagColor,
      subscriptionCount: 0,
    }

    setTags([...tags, newTag])
    setNewTagName("")
    setNewTagColor(colorOptions[0])
    setIsAdding(false)
  }

  const handleDeleteTag = (id: string) => {
    setTags(tags.filter((t) => t.id !== id))
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
        <Button onClick={() => setIsAdding(true)}>
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
              <Button onClick={handleAddTag}>Create</Button>
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
            key={tag.id}
            className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white py-2 pl-3 pr-2 transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <div
              className="size-3 rounded-full"
              style={{ backgroundColor: tag.color }}
            />
            <span className="font-medium text-gray-900 dark:text-gray-50">
              {tag.name}
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {tag.subscriptionCount}
            </span>
            <div className="flex gap-0.5 opacity-0 transition group-hover:opacity-100">
              <Button variant="ghost" className="!p-1">
                <RiEditLine className="size-3.5 text-gray-500" />
              </Button>
              <Button
                variant="ghost"
                className="!p-1"
                onClick={() => handleDeleteTag(tag.id)}
              >
                <RiDeleteBinLine className="size-3.5 text-red-500" />
              </Button>
            </div>
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
