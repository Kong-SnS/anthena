"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, MousePointerClick, Eye, Clock } from "lucide-react"

interface Analytics {
  configured: boolean
  message?: string
  error?: string
  days?: number
  totals?: {
    activeUsers: number
    newUsers: number
    sessions: number
    pageViews: number
    avgSessionDuration: number
  }
  trend?: { date: string; users: number; pageViews: number }[]
  topPages?: { path: string; views: number }[]
  channels?: { channel: string; sessions: number }[]
}

const RANGES = [
  { days: 7, label: "7 days" },
  { days: 28, label: "28 days" },
  { days: 90, label: "90 days" },
]

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}m ${s}s`
}

// Minimal inline sparkline — avoids pulling in a chart library.
function TrendChart({ data }: { data: { date: string; users: number }[] }) {
  if (data.length < 2) return null
  const w = 600
  const h = 120
  const max = Math.max(...data.map((d) => d.users), 1)
  const step = w / (data.length - 1)
  const points = data
    .map((d, i) => `${i * step},${h - (d.users / max) * (h - 10) - 5}`)
    .join(" ")

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-32"
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-green-600"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export default function AnalyticsPage() {
  const [days, setDays] = useState(28)
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    fetch(`/api/admin/analytics?days=${days}`)
      .then((r) => r.json())
      .then((json) => {
        if (active) setData(json)
      })
      .catch(() => {
        if (active) setData({ configured: true, error: "Failed to load analytics" })
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [days])

  const t = data?.totals
  const kpis = [
    { title: "Active Users", value: t?.activeUsers ?? 0, icon: Users, color: "text-blue-600" },
    { title: "New Users", value: t?.newUsers ?? 0, icon: UserPlus, color: "text-purple-600" },
    { title: "Sessions", value: t?.sessions ?? 0, icon: MousePointerClick, color: "text-orange-600" },
    { title: "Page Views", value: t?.pageViews ?? 0, icon: Eye, color: "text-green-600" },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <Button
              key={r.days}
              variant={days === r.days ? "default" : "outline"}
              size="sm"
              onClick={() => setDays(r.days)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Not-configured setup notice */}
      {data && data.configured === false && (
        <Card>
          <CardContent className="p-6">
            <p className="font-medium mb-2">Google Analytics isn&apos;t connected yet</p>
            <p className="text-sm text-muted-foreground">
              Add <code className="text-xs">GA_PROPERTY_ID</code> and{" "}
              <code className="text-xs">GOOGLE_SERVICE_ACCOUNT_KEY</code> environment
              variables (service account with Viewer access on the GA4 property), then
              redeploy.
            </p>
          </CardContent>
        </Card>
      )}

      {data?.error && (
        <Card>
          <CardContent className="p-6 text-sm text-red-600">{data.error}</CardContent>
        </Card>
      )}

      {data?.configured && !data.error && (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {kpis.map((k) => (
              <Card key={k.title}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{k.title}</p>
                      <p className="text-2xl font-bold mt-1">
                        {loading ? "—" : k.value.toLocaleString()}
                      </p>
                    </div>
                    <k.icon className={`h-8 w-8 ${k.color} opacity-80`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trend */}
          <Card className="mb-6">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-lg">Active Users Trend</CardTitle>
              {t && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Avg session {formatDuration(t.avgSessionDuration)}
                </span>
              )}
            </CardHeader>
            <CardContent>
              {data.trend && data.trend.length > 1 ? (
                <TrendChart data={data.trend} />
              ) : (
                <p className="text-sm text-muted-foreground">Not enough data yet.</p>
              )}
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top pages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Pages</CardTitle>
              </CardHeader>
              <CardContent>
                {data.topPages && data.topPages.length > 0 ? (
                  <div className="space-y-2">
                    {data.topPages.map((p) => (
                      <div
                        key={p.path}
                        className="flex items-center justify-between text-sm gap-4"
                      >
                        <span className="truncate text-muted-foreground">{p.path}</span>
                        <span className="font-medium shrink-0">
                          {p.views.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No data yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Channels */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                {data.channels && data.channels.length > 0 ? (
                  <div className="space-y-2">
                    {data.channels.map((c) => (
                      <div
                        key={c.channel}
                        className="flex items-center justify-between text-sm gap-4"
                      >
                        <span className="text-muted-foreground">{c.channel}</span>
                        <span className="font-medium shrink-0">
                          {c.sessions.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No data yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
