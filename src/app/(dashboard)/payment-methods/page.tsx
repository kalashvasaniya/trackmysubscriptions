"use client"

import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import {
  RiAddLine,
  RiBankCardLine,
  RiDeleteBinLine,
  RiEditLine,
  RiPaypalLine,
  RiBankLine,
} from "@remixicon/react"
import { useState } from "react"

// Mock data
const mockPaymentMethods = [
  {
    id: "1",
    name: "Main Credit Card",
    type: "credit_card",
    lastFour: "4242",
    subscriptionCount: 8,
  },
  {
    id: "2",
    name: "PayPal",
    type: "paypal",
    lastFour: null,
    subscriptionCount: 3,
  },
  {
    id: "3",
    name: "Bank Account",
    type: "bank_account",
    lastFour: "9876",
    subscriptionCount: 4,
  },
  {
    id: "4",
    name: "Debit Card",
    type: "debit_card",
    lastFour: "1234",
    subscriptionCount: 2,
  },
]

const paymentTypes = [
  { value: "credit_card", label: "Credit Card", icon: RiBankCardLine },
  { value: "debit_card", label: "Debit Card", icon: RiBankCardLine },
  { value: "paypal", label: "PayPal", icon: RiPaypalLine },
  { value: "bank_account", label: "Bank Account", icon: RiBankLine },
]

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods)
  const [isAdding, setIsAdding] = useState(false)
  const [newName, setNewName] = useState("")
  const [newType, setNewType] = useState("credit_card")
  const [newLastFour, setNewLastFour] = useState("")

  const handleAddPaymentMethod = () => {
    if (!newName.trim()) return

    const newMethod = {
      id: Date.now().toString(),
      name: newName,
      type: newType,
      lastFour: newLastFour || null,
      subscriptionCount: 0,
    }

    setPaymentMethods([...paymentMethods, newMethod])
    setNewName("")
    setNewType("credit_card")
    setNewLastFour("")
    setIsAdding(false)
  }

  const handleDelete = (id: string) => {
    setPaymentMethods(paymentMethods.filter((m) => m.id !== id))
  }

  const getTypeIcon = (type: string) => {
    const paymentType = paymentTypes.find((t) => t.value === type)
    return paymentType?.icon || RiBankCardLine
  }

  const getTypeLabel = (type: string) => {
    const paymentType = paymentTypes.find((t) => t.value === type)
    return paymentType?.label || type
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Payment Methods
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your payment methods for subscriptions
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <RiAddLine className="mr-2 size-4" />
          Add Payment Method
        </Button>
      </div>

      {/* Add Payment Method Form */}
      {isAdding && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
            Add New Payment Method
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-4">
            <Input
              placeholder="Name (e.g., Main Credit Card)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Select value={newType} onValueChange={setNewType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Last 4 digits (optional)"
              value={newLastFour}
              onChange={(e) =>
                setNewLastFour(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              maxLength={4}
            />
            <div className="flex gap-2">
              <Button onClick={handleAddPaymentMethod}>Add</Button>
              <Button variant="secondary" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods List */}
      <div className="mt-6 space-y-4">
        {paymentMethods.map((method) => {
          const Icon = getTypeIcon(method.type)
          return (
            <div
              key={method.id}
              className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <Icon className="size-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-50">
                    {method.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="neutral" className="rounded-full">
                      {getTypeLabel(method.type)}
                    </Badge>
                    {method.lastFour && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        •••• {method.lastFour}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {method.subscriptionCount} subscriptions
                </span>
                <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                  <Button variant="ghost" className="!p-2">
                    <RiEditLine className="size-4 text-gray-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="!p-2"
                    onClick={() => handleDelete(method.id)}
                  >
                    <RiDeleteBinLine className="size-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {paymentMethods.length === 0 && !isAdding && (
        <div className="mt-12 text-center">
          <div className="mx-auto size-12 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
            <RiBankCardLine className="size-full text-gray-400" />
          </div>
          <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-50">
            No payment methods
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add payment methods to track which cards/accounts are used
          </p>
          <Button className="mt-4" onClick={() => setIsAdding(true)}>
            <RiAddLine className="mr-2 size-4" />
            Add your first payment method
          </Button>
        </div>
      )}
    </div>
  )
}
