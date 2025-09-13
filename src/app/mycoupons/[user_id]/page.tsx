"use client";

import React, { useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { auth_get } from "@/util/request";
import { getDisplayDay } from "@/util/display";

interface Coupon {
  coupon_id: string;
  day: string;
  food_preference: string;
  coupon_type: string;
  status: string;
  price: number;
  booked_on: Date;
  booked_by: string;
}

interface CouponResponse {
  count: number;
  coupons: Coupon[];
}

// Badge colors for different statuses
const statusColors: Record<string, string> = {
  booked: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  collected: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function MyCouponsPage({ params }: { params: { user_id: string } }) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const setCouponData = (data: CouponResponse) => {
    setCount(data.count);
    setCoupons(data.coupons);
  };

  useEffect(() => {
    async function fetchCoupons() {
      setLoading(true);
      try {
        const res: AxiosResponse = await auth_get(`/coupons/${params.user_id}`);
        setCouponData(res.data);
      } catch (err) {
        console.error("Failed to fetch coupons", err);
        const axiosError = err as AxiosError<{ detail: string }>;
        toast.error("Fetching coupons failed.", {
          description: axiosError.response?.data?.detail || "Unknown error",
          duration: 3000,
          dismissible: true,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchCoupons();
  }, [params.user_id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
        <span className="mt-2 text-gray-600">Loading coupons...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Coupons</h1>
      <p className="text-gray-600">You have {count} coupon{count !== 1 ? "s" : ""}.</p>

      {coupons.length === 0 ? (
        <p className="text-gray-500">No coupons found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <Card key={coupon.coupon_id} className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">
                  {getDisplayDay(coupon.day)}
                </CardTitle>
                <span
                  className={`px-2 py-1 text-sm font-medium rounded-full ${statusColors[coupon.status] || "bg-gray-100 text-gray-800"}`}
                >
                  {coupon.status.toUpperCase()}
                </span>
              </CardHeader>
              <CardContent className="space-y-1">
                <p>
                  <span className="font-medium">Type:</span> {coupon.coupon_type.toUpperCase()}
                </p>
                <p>
                  <span className="font-medium">Preference:</span> {coupon.food_preference.toUpperCase().replace("_"," ")}
                </p>
                <p>
                  <span className="font-medium">Price:</span> ₹{coupon.price}
                </p>
                <p className="text-sm text-gray-500">
                  Booked on {new Date(coupon.booked_on).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
