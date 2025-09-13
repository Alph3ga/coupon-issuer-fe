"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { auth_get, auth_post } from "@/util/request"
import { Loader2 } from "lucide-react"

type CouponStatus = "booked" | "paid" | "collected" | "cancelled"
type CouponType = "breakfast" | "lunch" | "dinner"
type FoodPreference = "veg" | "nonveg"

interface CouponResponse {
  coupon_id: string
  day: string
  food_preference: FoodPreference
  coupon_type: CouponType
  status: CouponStatus
  price: number
  booked_on: string
  booked_by: string
}

interface CouponList {
  count: number
  total_unpaid_price: number
  total_price: number
  coupons: CouponResponse[]
}

const CouponRow = React.memo(function CouponRow({
  coupon,
  updateStatus,
}: {
  coupon: CouponResponse
  updateStatus: (id: string, status: CouponStatus) => void
}) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-2">{coupon.day}</td>
      <td className="p-2 capitalize">{coupon.coupon_type}</td>
      <td className="p-2 capitalize">{coupon.food_preference}</td>
      <td className="p-2">₹{coupon.price}</td>
      <td className="p-2">{coupon.booked_on}</td>
      <td className="p-2">{coupon.booked_by}</td>
      <td className="p-2 capitalize">{coupon.status}</td>
      <td className="p-2 flex gap-2">
        {coupon.status === "booked" && (
          <Button size="sm" onClick={() => updateStatus(coupon.coupon_id, "paid")}>
            Mark Paid
          </Button>
        )}
        {coupon.status === "paid" && (
          <Button size="sm" onClick={() => updateStatus(coupon.coupon_id, "collected")}>
            Mark Collected
          </Button>
        )}
        {coupon.status !== "cancelled" && coupon.status !== "collected" && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => updateStatus(coupon.coupon_id, "cancelled")}
          >
            Cancel
          </Button>
        )}
      </td>
    </tr>
  )
})

// ✅ Memoized card for mobile
const CouponCard = React.memo(function CouponCard({
  coupon,
  updateStatus,
}: {
  coupon: CouponResponse
  updateStatus: (id: string, status: CouponStatus) => void
}) {
  return (
    <Card key={coupon.coupon_id}>
      <CardHeader>
        <CardTitle>
          {coupon.day} • {coupon.coupon_type} ({coupon.food_preference})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>Price:</span>
          <span>₹{coupon.price}</span>
        </div>
        <div className="flex justify-between">
          <span>Booked On:</span>
          <span>{coupon.booked_on}</span>
        </div>
        <div className="flex justify-between">
          <span>Booked By:</span>
          <span>{coupon.booked_by}</span>
        </div>
        <div className="flex justify-between">
          <span>Status:</span>
          <span className="capitalize">{coupon.status}</span>
        </div>

        <div className="flex gap-2 pt-2 flex-wrap">
          {coupon.status === "booked" && (
            <Button size="sm" onClick={() => updateStatus(coupon.coupon_id, "paid")}>
              Mark Paid
            </Button>
          )}
          {coupon.status === "paid" && (
            <Button size="sm" onClick={() => updateStatus(coupon.coupon_id, "collected")}>
              Mark Collected
            </Button>
          )}
          {coupon.status !== "cancelled" && coupon.status !== "collected" && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => updateStatus(coupon.coupon_id, "cancelled")}
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
})

export default function AdminCouponsPage() {
  const [data, setData] = useState<CouponList | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<CouponStatus | "all">("all")
  const [bookedBy, setBookedBy] = useState<string>("all")

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true)
        const res = await auth_get<CouponList>("/coupons")
        setData(res.data)
      } catch (err) {
        console.error("Failed to fetch coupons", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCoupons()
  }, [])

  // ✅ Optimistic state update
  const updateStatus = async (coupon_id: string, nextStatus: CouponStatus) => {
    try {
      await auth_post("/coupons/status", { coupon_id, status: nextStatus })
      setData((prev) =>
        prev
          ? {
              ...prev,
              coupons: prev.coupons.map((c) =>
                c.coupon_id === coupon_id ? { ...c, status: nextStatus } : c
              ),
            }
          : prev
      )
    } catch (err) {
      console.error("Failed to update status", err)
    }
  }

  // ✅ Filtering with useMemo
  const filteredCoupons = useMemo(() => {
    if (!data) return []
    return data.coupons.filter(
      (c) =>
        c.status !== "cancelled" &&
        (filter === "all" || c.status === filter) &&
        (bookedBy === "all" || c.booked_by === bookedBy)
    )
  }, [data, filter, bookedBy])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (!data) {
    return <p className="text-center text-red-500">Failed to load coupons.</p>
  }

  return (
    <div className="p-4 space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap justify-around gap-4">
          <div>Total Coupons: {data.count}</div>
          <div>Total Price: ₹{data.total_price}</div>
          <div>Total Unpaid: ₹{data.total_unpaid_price}</div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="font-medium">Filter:</span>
        <Select onValueChange={(val) => setFilter(val as CouponStatus | "all")} defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="booked">Booked</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="collected">Collected</SelectItem>
          </SelectContent>
        </Select>

        <span className="font-medium">Booked By:</span>
        <Select onValueChange={(val) => setBookedBy(val)} defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {Array.from(new Set(data.coupons.map((c) => c.booked_by))).map((user) => (
              <SelectItem key={user} value={user}>
                {user}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Coupons */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Day</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Preference</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Booked On</th>
              <th className="p-2 text-left">Booked By</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoupons.map((c) => (
              <CouponRow key={c.coupon_id} coupon={c} updateStatus={updateStatus} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {filteredCoupons.map((c) => (
          <CouponCard key={c.coupon_id} coupon={c} updateStatus={updateStatus} />
        ))}
      </div>
    </div>
  )
}
