"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { days, getDisplayDay } from "@/util/display";
import { auth_post } from "@/util/request";

interface CartItem {
  id: string;
  day: string;
  meal: string;
  preference: string;
  quantity: number;
}

export default function BookCouponsPage() {
  const [day, setDay] = useState<string>("");
  const [meal, setMeal] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [preference, setPreference] = useState<string>("")
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = () => {
    if (!day || !meal || quantity <= 0) {
      toast.error("Please select day, meal, and quantity.");
      return;
    }

    const newItem: CartItem = {
      id: Date.now().toString()+ Math.ceil(Math.random()*100).toString(),
      day,
      meal,
      preference,
      quantity,
    };

    setCart([...cart, newItem]);
    setDay("");
    setMeal("");
    setPreference("");
    setQuantity(1);
    toast.success("Coupon added to cart");
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const bookCoupons = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    const booking_cart= cart;
    for(const item of booking_cart){
        const res= await auth_post(
            "/coupons/book",
            {
                count: item.quantity,
                coupon: {
                    day: new Date(item.day),
                    coupon_type: item.meal,
                    food_preference: item.preference,
                }
            }
        )
        if(res.status==201){
            setCart(cart.filter((cart_item) => cart_item.id !== item.id));
        }
    }
    toast.success("Coupons booked successfully!");
    setCart([]);
  };

  const getDisplayPreference= (pref: string)=>{
    if(pref == "vegetarian") return "Veg";
    else return "Non-veg"
  }

  return (
    <div className="p-4 sm:p-6 space-y-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center sm:text-left">
        Book Coupons
      </h1>

      {/* Form Section */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Select Coupon</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Select Day */}
          <Select value={day} onValueChange={setDay}>
            <SelectTrigger>
              <SelectValue placeholder="Select Day" />
            </SelectTrigger>
            <SelectContent>
            {days.map(([date, day]) => (
            <SelectItem 
                key={date.toISOString()} 
                value={date.toISOString()}
            >
                {day} ({date.toDateString()})
            </SelectItem>
            ))}
            </SelectContent>
          </Select>

          {/* Select Meal */}
          <Select value={meal} onValueChange={setMeal}>
            <SelectTrigger>
              <SelectValue placeholder="Select Meal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
            </SelectContent>
          </Select>

            <RadioGroup value={preference} onValueChange={setPreference} className="flex gap-4">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vegetarian" id="veg" />
                    <Label htmlFor="vegetarian">Veg</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non_vegetarian" id="nonveg" />
                    <Label htmlFor="non_vegetarian">Non-Veg</Label>
                </div>
            </RadioGroup>

          {/* Quantity */}
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            placeholder="Quantity"
          />

          <Button className="w-full sm:w-auto" onClick={addToCart}>
            Add to Cart
          </Button>
        </CardContent>
      </Card>

      {/* Cart Section */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle>My Cart</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.length === 0 ? (
            <p className="text-gray-500">No coupons in cart.</p>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between border p-3 rounded-lg gap-2"
                >
                  <div className="flex-1">
                    <p className="font-medium">{getDisplayDay(item.day)}</p>
                    <p className="text-sm text-gray-600">
                      {item.meal} {getDisplayPreference(item.preference)} × {item.quantity}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="self-start sm:self-auto"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <Button className="w-full mt-4" onClick={bookCoupons}>
              Book Selected Coupons
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
