"use client"

import { Button } from "@/components/Button"
import { RiGoogleFill } from "@remixicon/react"
import { signIn } from "next-auth/react"
import Link from "next/link"

export default function RegisterPage() {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <div className="w-full max-w-md px-4">
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Start tracking your subscriptions for free
          </p>
        </div>

        <Button
          variant="secondary"
          className="w-full gap-2"
          onClick={handleGoogleSignIn}
          type="button"
        >
          <RiGoogleFill className="size-5" />
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          By signing up, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  )
}
