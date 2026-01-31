import {
  fetchExchangeRates,
  convertWithRates,
} from "@/lib/currency"
import dbConnect from "@/lib/mongodb"
import Subscription from "@/models/Subscription"
import User from "@/models/User"
import Folder from "@/models/Folder"
import PaymentMethod from "@/models/PaymentMethod"
import {
  requireAuth,
  checkRateLimit,
  validateBody,
  errorResponse,
  successResponse,
  ApiErrors,
  getClientIp,
} from "@/lib/api-utils"
import { createSubscriptionSchema } from "@/lib/validations"

// Ensure models are registered for populate
void Folder
void PaymentMethod

// GET all subscriptions (with amounts in user's display currency)
export async function GET(request: Request) {
  try {
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }
    const { userId } = authResult

    // Rate limit
    const rateLimitResult = checkRateLimit(userId, "api", getClientIp(request))
    if (!rateLimitResult.success) {
      return rateLimitResult.response
    }

    await dbConnect()

    const user = await User.findById(userId).select("currency").lean()
    const displayCurrency = user?.currency ?? "USD"
    const rates = await fetchExchangeRates("USD")
    const toDisplay = (amount: number, fromCurrency: string) =>
      convertWithRates(amount, fromCurrency, displayCurrency, rates)

    const subscriptions = await Subscription.find({ userId })
      .populate("folderId", "name color")
      .populate("paymentMethodId", "name type lastFour")
      .sort({ nextBillingDate: 1 })
      .lean()

    const subscriptionsWithDisplay = subscriptions.map((sub) => ({
      ...sub,
      displayAmount: Math.round(toDisplay(sub.amount, sub.currency) * 100) / 100,
    }))

    return successResponse(
      { subscriptions: subscriptionsWithDisplay, displayCurrency },
      200,
      rateLimitResult.headers
    )
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return errorResponse(ApiErrors.INTERNAL_ERROR)
  }
}

// POST create a new subscription
export async function POST(request: Request) {
  try {
    const authResult = await requireAuth()
    if (!authResult.success) {
      return authResult.response
    }
    const { userId } = authResult

    // Rate limit for create operations
    const rateLimitResult = checkRateLimit(userId, "create", getClientIp(request))
    if (!rateLimitResult.success) {
      return rateLimitResult.response
    }

    // Parse request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return errorResponse(ApiErrors.VALIDATION_ERROR("Invalid JSON body"))
    }

    // Validate request body
    const validation = validateBody(createSubscriptionSchema, body)
    if (!validation.success) {
      return validation.response
    }

    const data = validation.data

    await dbConnect()

    // Validate date is not in the past (for start date)
    const startDate = data.startDate ? new Date(data.startDate) : new Date()
    const nextBillingDate = new Date(data.nextBillingDate)

    // Sanitize and create subscription
    const subscription = await Subscription.create({
      name: data.name.trim(),
      description: data.description?.trim(),
      amount: data.amount,
      currency: data.currency || "USD",
      billingCycle: data.billingCycle,
      nextBillingDate,
      startDate,
      status: data.status || "active",
      category: data.category,
      url: data.url || undefined,
      logo: data.logo || undefined,
      alertDays: data.alertDays ?? 3,
      alertEnabled: true,
      userId,
      folderId: data.folderId || undefined,
      tagIds: data.tagIds || [],
      paymentMethodId: data.paymentMethodId || undefined,
    })

    return successResponse(subscription, 201, rateLimitResult.headers)
  } catch (error) {
    console.error("Error creating subscription:", error)
    return errorResponse(ApiErrors.INTERNAL_ERROR)
  }
}
