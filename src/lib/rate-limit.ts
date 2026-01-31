// Simple in-memory rate limiter for development
// For production, consider using @upstash/ratelimit with Redis

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean every minute

export interface RateLimitConfig {
  interval: number // in milliseconds
  limit: number
}

export const RATE_LIMITS = {
  // General API limits
  api: { interval: 60000, limit: 100 }, // 100 requests per minute
  read: { interval: 60000, limit: 120 }, // 120 reads per minute
  write: { interval: 60000, limit: 60 }, // 60 writes per minute
  
  // Write operations
  create: { interval: 60000, limit: 30 }, // 30 creates per minute
  update: { interval: 60000, limit: 50 }, // 50 updates per minute
  delete: { interval: 60000, limit: 20 }, // 20 deletes per minute
  
  // Expensive operations
  export: { interval: 300000, limit: 5 }, // 5 exports per 5 minutes
  import: { interval: 300000, limit: 3 }, // 3 imports per 5 minutes
  analytics: { interval: 30000, limit: 10 }, // 10 analytics requests per 30 seconds
  
  // Email operations
  email: { interval: 86400000, limit: 50 }, // 50 emails per day
  
  // Auth operations
  auth: { interval: 300000, limit: 10 }, // 10 auth attempts per 5 minutes
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const key = identifier
  
  const existing = rateLimitStore.get(key)
  
  if (!existing || existing.resetAt < now) {
    // New window
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + config.interval,
    })
    return {
      success: true,
      remaining: config.limit - 1,
      resetAt: now + config.interval,
    }
  }
  
  if (existing.count >= config.limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: existing.resetAt,
    }
  }
  
  existing.count++
  return {
    success: true,
    remaining: config.limit - existing.count,
    resetAt: existing.resetAt,
  }
}

export function getRateLimitKey(
  userId: string | undefined,
  operation: string,
  ip?: string
): string {
  // Use userId if available, otherwise fall back to IP
  const identifier = userId || ip || "anonymous"
  return `${operation}:${identifier}`
}

// Helper to create rate limit response headers
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  }
}
