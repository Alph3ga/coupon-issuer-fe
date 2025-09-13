"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { auth_get, auth_post } from "@/util/request"
import { Loader2 } from "lucide-react"

interface CouponTemplate {
  coupon_type: "breakfast" | "lunch" | "dinner"
  food_preference: "vegetarian" | "non_vegetarian"
  price: number
}

export default function CouponTemplatesPage() {
  const [templates, setTemplates] = useState<CouponTemplate[]>([])
  const [loading, setLoading] = useState(true)

  // form state
  const [meal, setMeal] = useState<string>("")
  const [preference, setPreference] = useState<string>("")
  const [price, setPrice] = useState("")

  const fetchTemplates = async () => {
    try {
      const res = await auth_get<CouponTemplate[]>("/template")
      setTemplates(res.data)
    } catch (err) {
      console.error("Failed to load templates", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const handleUpsert = async (
    coupon_type: string,
    food_preference: string,
    price: number
  ) => {
    try {
      await auth_post("/template/edit", {
        coupon_type,
        food_preference,
        price,
      })
      
      fetchTemplates();
    } catch (err) {
      console.error("Failed to upsert template", err)
    }
  }

  const handleCreate = () => {
    if (!meal || !preference || !price) return
    handleUpsert(meal, preference, Number(price))
    setMeal("")
    setPreference("")
    setPrice("")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8 p-4">
      {/* Create or Edit Template */}
      <Card>
        <CardHeader>
          <CardTitle>Create / Edit Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Meal</Label>
            <Select value={meal} onValueChange={(val: string) => setMeal(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select meal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Food Preference</Label>
            <Select value={preference} onValueChange={(val: string) => setPreference(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Veg / Non-Veg" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vegetarian">Veg</SelectItem>
                <SelectItem value="non_vegetarian">Non-Veg</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Price</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
            />
          </div>

          <Button onClick={handleCreate} disabled={!meal || !preference || !price}>
            Save Template
          </Button>
        </CardContent>
      </Card>

      {/* Existing Templates */}
      <div>
        <h2 className="text-xl font-bold mb-4">Existing Templates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <Card key={t.food_preference+t.coupon_type} className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle className="capitalize">
                  {t.coupon_type} - {t.food_preference === "vegetarian" ? "Veg" : "Non-Veg"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price</span>
                  <span className="font-bold">₹ {t.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="New price"
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        const newPrice = Number((e.target as HTMLInputElement).value)
                        if (newPrice > 0) await handleUpsert(t.coupon_type, t.food_preference, newPrice)
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={async () => {
                      const input = (document.activeElement as HTMLInputElement).value
                      const newPrice = Number(input)
                      if (newPrice > 0) await handleUpsert(t.coupon_type, t.food_preference, newPrice)
                    }}
                  >
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
