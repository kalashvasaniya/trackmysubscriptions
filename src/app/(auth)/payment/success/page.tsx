"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { RiLoader4Line, RiCheckboxCircleLine, RiErrorWarningLine } from "@remixicon/react"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")
  const [message, setMessage] = useState("Verifying your payment...")

  useEffect(() => {
    async function verifyAndSave() {
      // Dodo may send payment_id, subscription_id, session_id, or checkout_id
      const paymentId =
        searchParams.get("payment_id") ||
        searchParams.get("subscription_id") ||
        searchParams.get("session_id") ||
        searchParams.get("checkout_id")
      const paymentStatus = searchParams.get("status")

      // Allow verify when user landed from payment (has any id or status=active)
      if (!paymentId && paymentStatus !== "active" && paymentStatus !== "succeeded") {
        setStatus("error")
        setMessage("Invalid payment information")
        return
      }

      try {
        const response = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentId,
            status: paymentStatus || "active",
          }),
        })

        const result = await response.json()

        if (response.ok && result.success) {
          setStatus("success")
          setMessage("Payment verified! Redirecting to dashboard...")

          setTimeout(() => {
            router.push("/dashboard")
          }, 2000)
        } else {
          setStatus("error")
          setMessage(result.error || "Failed to verify payment")
        }
      } catch (error) {
        console.error("Verification error:", error)
        setStatus("error")
        setMessage("Something went wrong. Please contact support.")
      }
    }

    verifyAndSave()
  }, [searchParams, router])

  return (
    <div className="mx-4 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg dark:border-gray-800 dark:bg-gray-900">
      {status === "verifying" && (
        <>
          <RiLoader4Line className="mx-auto size-16 animate-spin text-blue-500" />
          <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
            Processing Payment
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <RiCheckboxCircleLine className="size-10 text-emerald-500" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
            Payment Successful!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
          <div className="mt-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <RiCheckboxCircleLine className="size-4" />
              Lifetime Access Activated
            </div>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <RiErrorWarningLine className="size-10 text-red-500" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
            Verification Failed
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            Go to Dashboard
          </button>
        </>
      )}
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="mx-4 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <RiLoader4Line className="mx-auto size-16 animate-spin text-blue-500" />
      <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
        Loading...
      </h1>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <Suspense fallback={<LoadingFallback />}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  )
}
