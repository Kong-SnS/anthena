const store = new Map<string, number[]>()

// Clean up old entries every 10 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now()
    for (const [key, timestamps] of store.entries()) {
      const recent = timestamps.filter((ts) => ts > now - 15 * 60 * 1000)
      if (recent.length === 0) store.delete(key)
      else store.set(key, recent)
    }
  }, 10 * 60 * 1000)
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now()
  const windowStart = now - windowMs

  const timestamps = (store.get(key) || []).filter((ts) => ts > windowStart)

  if (timestamps.length >= limit) {
    const oldest = timestamps[0]
    return { allowed: false, remaining: 0, retryAfterMs: oldest + windowMs - now }
  }

  timestamps.push(now)
  store.set(key, timestamps)

  return { allowed: true, remaining: limit - timestamps.length, retryAfterMs: 0 }
}

export function getIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return request.headers.get("x-real-ip") ?? "unknown"
}
