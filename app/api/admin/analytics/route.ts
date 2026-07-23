import { NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/admin-auth"
import {
  analyticsConfigured,
  batchRunReports,
  type ReportResult,
} from "@/lib/google-analytics"

// GA4 admin analytics. Returns headline metrics, a daily trend, top pages, and
// traffic channels for a chosen window. Results are cached in memory per-range
// so repeated dashboard loads don't burn the (free) GA4 API quota.

const ALLOWED_DAYS = [7, 28, 90] as const
type Days = (typeof ALLOWED_DAYS)[number]

const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour
const cache = new Map<Days, { at: number; payload: unknown }>()

const num = (rows: ReportResult["rows"], row = 0, col = 0) =>
  Number(rows?.[row]?.metricValues?.[col]?.value ?? 0)

export async function GET(request: NextRequest) {
  const auth = await verifyAdmin()
  if (!auth.authorized) return auth.response!

  if (!analyticsConfigured()) {
    return NextResponse.json(
      {
        configured: false,
        message:
          "Google Analytics is not configured. Set GA_PROPERTY_ID and GOOGLE_SERVICE_ACCOUNT_KEY.",
      },
      { status: 200 }
    )
  }

  const daysParam = Number(request.nextUrl.searchParams.get("days"))
  const days: Days = (ALLOWED_DAYS as readonly number[]).includes(daysParam)
    ? (daysParam as Days)
    : 28

  const cached = cache.get(days)
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return NextResponse.json(cached.payload)
  }

  const dateRanges = [{ startDate: `${days}daysAgo`, endDate: "today" }]

  try {
    const [totals, trend, pages, channels] = await batchRunReports([
      // 0: headline totals
      {
        metrics: [
          { name: "activeUsers" },
          { name: "newUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "averageSessionDuration" },
        ],
        dateRanges,
      },
      // 1: daily trend for the chart
      {
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
        dateRanges,
      },
      // 2: top pages
      {
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 8,
        dateRanges,
      },
      // 3: traffic channels
      {
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 6,
        dateRanges,
      },
    ])

    const payload = {
      configured: true,
      days,
      totals: {
        activeUsers: num(totals.rows, 0, 0),
        newUsers: num(totals.rows, 0, 1),
        sessions: num(totals.rows, 0, 2),
        pageViews: num(totals.rows, 0, 3),
        avgSessionDuration: num(totals.rows, 0, 4), // seconds
      },
      trend: (trend.rows ?? []).map((r) => ({
        date: r.dimensionValues?.[0]?.value ?? "",
        users: Number(r.metricValues?.[0]?.value ?? 0),
        pageViews: Number(r.metricValues?.[1]?.value ?? 0),
      })),
      topPages: (pages.rows ?? []).map((r) => ({
        path: r.dimensionValues?.[0]?.value ?? "",
        views: Number(r.metricValues?.[0]?.value ?? 0),
      })),
      channels: (channels.rows ?? []).map((r) => ({
        channel: r.dimensionValues?.[0]?.value ?? "",
        sessions: Number(r.metricValues?.[0]?.value ?? 0),
      })),
    }

    cache.set(days, { at: Date.now(), payload })
    return NextResponse.json(payload)
  } catch (err) {
    console.error("GA4 analytics error:", err)
    return NextResponse.json(
      { configured: true, error: "Failed to load analytics" },
      { status: 502 }
    )
  }
}
