"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth_get } from "@/util/request"
import { Loader2, ClipboardList, Coins, XCircle, CheckCircle } from "lucide-react"
import { getDisplayDay } from "@/util/display"

interface DayStats {
  day: string
  meals: {
    breakfast: number
    lunch: number
    dinner: number
  }
}

interface DashboardStats {
  total_coupons_booked: number
  total_coupons_paid: number
  total_coupons_collected: number
  total_coupons_unpaid: number
  per_day_stats: DayStats[]
  payment_stats: {
    paid_amount: number
    unpaid_amount: number
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await auth_get<DashboardStats>("/admin/dashboard")
        setStats(res.data)
      } catch (err) {
        console.error("Failed to load dashboard", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (!stats) {
    return <p className="text-center text-red-500">Failed to load dashboard.</p>
  }

  return (
    <div className="space-y-8 p-4">
      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-t-4 border-blue-500 hover:shadow-lg transition">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Total Booked</CardTitle>
            <ClipboardList className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.total_coupons_booked}
          </CardContent>
        </Card>

        <Card className="border-t-4 border-green-500 hover:shadow-lg transition">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Total Paid</CardTitle>
            <Coins className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.total_coupons_paid}
          </CardContent>
        </Card>

        <Card className="border-t-4 border-yellow-500 hover:shadow-lg transition">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Total Unpaid</CardTitle>
            <XCircle className="h-6 w-6 text-yellow-500" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.total_coupons_unpaid}
          </CardContent>
        </Card>

        <Card className="border-t-4 border-purple-500 hover:shadow-lg transition">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Total Collected</CardTitle>
            <CheckCircle className="h-6 w-6 text-purple-500" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.total_coupons_collected}
          </CardContent>
        </Card>
      </div>

      {/* Payment stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-l-4 border-green-600 hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="text-green-600">Paid Amount</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-extrabold text-green-700">
            ₹ {stats.payment_stats.paid_amount}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-red-600 hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="text-red-600">Unpaid Amount</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-extrabold text-red-700">
            ₹ {stats.payment_stats.unpaid_amount}
          </CardContent>
        </Card>
      </div>

      {/* Daily breakdown */}
      <div>
        <h2 className="text-xl font-bold mb-4">📅 Daily Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.per_day_stats.map((day_stat) => (
            <Card
              key={day_stat.day}
              className="hover:shadow-lg transition border border-gray-200"
            >
              <CardHeader>
                <CardTitle>{getDisplayDay(day_stat.day)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Breakfast</span>
                  <span className="font-semibold">{day_stat.meals.breakfast}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lunch</span>
                  <span className="font-semibold">{day_stat.meals.lunch}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dinner</span>
                  <span className="font-semibold">{day_stat.meals.dinner}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
