"use client"

import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { RiAddLine, RiDeleteBinLine, RiEditLine } from "@remixicon/react"
import { useState } from "react"

// Mock data - will be replaced with API call
const mockFolders = [
  { id: "1", name: "Personal", color: "#3B82F6", subscriptionCount: 5 },
  { id: "2", name: "Work", color: "#10B981", subscriptionCount: 8 },
  { id: "3", name: "Entertainment", color: "#F59E0B", subscriptionCount: 3 },
  { id: "4", name: "Utilities", color: "#EF4444", subscriptionCount: 4 },
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

export default function FoldersPage() {
  const [folders, setFolders] = useState(mockFolders)
  const [isAdding, setIsAdding] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderColor, setNewFolderColor] = useState(colorOptions[0])

  const handleAddFolder = () => {
    if (!newFolderName.trim()) return

    const newFolder = {
      id: Date.now().toString(),
      name: newFolderName,
      color: newFolderColor,
      subscriptionCount: 0,
    }

    setFolders([...folders, newFolder])
    setNewFolderName("")
    setNewFolderColor(colorOptions[0])
    setIsAdding(false)
  }

  const handleDeleteFolder = (id: string) => {
    setFolders(folders.filter((f) => f.id !== id))
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
        <Button onClick={() => setIsAdding(true)}>
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
              <Button onClick={handleAddFolder}>Create</Button>
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
            key={folder.id}
            className="group rounded-lg border border-gray-200 bg-white p-4 transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
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
                    {folder.subscriptionCount} subscriptions
                  </p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                <Button variant="ghost" className="!p-1.5">
                  <RiEditLine className="size-4 text-gray-500" />
                </Button>
                <Button
                  variant="ghost"
                  className="!p-1.5"
                  onClick={() => handleDeleteFolder(folder.id)}
                >
                  <RiDeleteBinLine className="size-4 text-red-500" />
                </Button>
              </div>
            </div>
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
