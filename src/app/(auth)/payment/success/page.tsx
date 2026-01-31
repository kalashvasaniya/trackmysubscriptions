"use client"

import { useEffect, useState, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { RiCheckboxCircleFill, RiLoader4Line, RiArrowRightLine, RiErrorWarningLine } from "@remixicon/react"
import { Button } from "@/components/Button"

function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <RiLoader4Line className="mx-auto size-12 animate-spin text-gray-400" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  )
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "pending" | "error">("loading")
  const [attempts, setAttempts] = useState(0)
  const checkoutId = searchParams.get("checkout_id")

  const verifyPayment = useCallback(async () => {
    if (!checkoutId) {
      setStatus("error")
      return
    }

    try {
      const res = await fetch(`/api/payments/verify?checkout_id=${checkoutId}`)
      const data = await res.json()

      if (data.verified) {
        setStatus("success")
        // Auto-redirect to dashboard after 2 seconds
        setTimeout(() => router.push("/dashboard"), 2000)
      } else if (attempts < 10) {
        // Payment not yet confirmed, keep polling (webhook may be delayed)
        setStatus("pending")
        setAttempts((prev) => prev + 1)
      } else {
        // After 10 attempts (~30 seconds), show manual redirect option
        setStatus("pending")
      }
    } catch {
      if (attempts < 5) {
        setAttempts((prev) => prev + 1)
      } else {
        setStatus("error")
      }
    }
  }, [checkoutId, attempts, router])

  useEffect(() => {
    // Initial verification after short delay
    const timer = setTimeout(verifyPayment, 1500)
    return () => clearTimeout(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Poll for payment verification if pending
    if (status === "pending" && attempts < 10) {
      const timer = setTimeout(verifyPayment, 3000)
      return () => clearTimeout(timer)
    }
  }, [status, attempts, verifyPayment])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <RiLoader4Line className="mx-auto size-12 animate-spin text-gray-400" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <RiErrorWarningLine className="size-10 text-red-500" />
            </div>
            <h1 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-white">
              Verification Failed
            </h1>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              We couldn&apos;t verify your payment. If you completed the payment, please contact support.
            </p>
            <div className="mt-8 space-y-3">
              <Button className="w-full" onClick={() => router.push("/")}>
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (status === "pending") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <RiLoader4Line className="mx-auto size-12 animate-spin text-amber-500" />
            <h1 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-white">
              Processing Payment...
            </h1>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Your payment is being processed. This usually takes a few seconds.
            </p>
            {attempts >= 10 && (
              <div className="mt-8 space-y-3">
                <Button className="w-full" onClick={() => router.push("/dashboard")}>
                  Continue to Dashboard
                  <RiArrowRightLine className="size-4" />
                </Button>
                <p className="text-xs text-gray-500">
                  If you completed the payment, your access will be activated shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <RiCheckboxCircleFill className="size-10 text-emerald-500" />
          </div>
          
          <h1 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-white">
            Payment Successful!
          </h1>
          
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Thank you for your purchase. You now have lifetime access to all features.
          </p>

          <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400">
            Redirecting to dashboard...
          </p>

          <div className="mt-8 space-y-3">
            <Button 
              className="w-full" 
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
              <RiArrowRightLine className="size-4" />
            </Button>
          </div>

          <p className="mt-6 text-xs text-gray-500">
            Order ID: {checkoutId}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
