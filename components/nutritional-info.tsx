"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import { Leaf, Flame, Droplets, Apple } from "lucide-react"
import type { MenuItem } from "@/lib/sample-data"

interface NutritionalInfoProps {
  item: MenuItem
}

// Sample nutritional data
const getNutritionalData = (itemId: string) => {
  const baseData = {
    calories: 450,
    protein: 22,
    carbs: 45,
    fat: 18,
    fiber: 3,
    sugar: 8,
    sodium: 800,
    allergens: ["Gluten", "Dairy"],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
  }

  // Customize based on item ID
  switch (itemId) {
    case "1": // Classic Burger
      return {
        ...baseData,
        calories: 550,
        protein: 28,
        carbs: 40,
        fat: 32,
        allergens: ["Gluten", "Dairy", "Eggs"],
      }
    case "2": // Veggie Burger
      return {
        ...baseData,
        calories: 380,
        protein: 15,
        carbs: 48,
        fat: 16,
        isVegetarian: true,
        allergens: ["Gluten"],
      }
    case "5": // Caesar Salad
      return {
        ...baseData,
        calories: 320,
        protein: 12,
        carbs: 15,
        fat: 24,
        fiber: 5,
        sugar: 3,
        allergens: ["Dairy", "Eggs"],
      }
    case "9": // Chocolate Brownie
      return {
        ...baseData,
        calories: 420,
        protein: 5,
        carbs: 65,
        fat: 22,
        sugar: 40,
        allergens: ["Gluten", "Dairy", "Eggs"],
      }
    default:
      return baseData
  }
}

export default function NutritionalInfo({ item }: NutritionalInfoProps) {
  const [activeTab, setActiveTab] = useState("nutrition")

  const nutritionalData = getNutritionalData(item.id)

  // Data for macronutrient pie chart
  const macroData = [
    { name: "Protein", value: nutritionalData.protein * 4 }, // 4 calories per gram
    { name: "Carbs", value: nutritionalData.carbs * 4 }, // 4 calories per gram
    { name: "Fat", value: nutritionalData.fat * 9 }, // 9 calories per gram
  ]

  // Data for nutrient bar chart
  const nutrientData = [
    { name: "Protein", amount: nutritionalData.protein, unit: "g" },
    { name: "Carbs", amount: nutritionalData.carbs, unit: "g" },
    { name: "Fat", amount: nutritionalData.fat, unit: "g" },
    { name: "Fiber", amount: nutritionalData.fiber, unit: "g" },
    { name: "Sugar", amount: nutritionalData.sugar, unit: "g" },
    { name: "Sodium", amount: nutritionalData.sodium / 100, unit: "00mg" },
  ]

  // Colors for pie chart
  const COLORS = ["#10b981", "#f59e0b", "#ef4444"]

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Apple className="h-5 w-5 text-primary" />
          Nutritional Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="nutrition" onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="nutrition" className="text-xs">
              <Flame className="mr-1 h-3 w-3" />
              Nutrition Facts
            </TabsTrigger>
            <TabsTrigger value="dietary" className="text-xs">
              <Leaf className="mr-1 h-3 w-3" />
              Dietary Info
            </TabsTrigger>
          </TabsList>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="nutrition" className="mt-0">
              <div className="mb-4 rounded-md bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Calories</h3>
                  <span className="text-lg font-bold">{nutritionalData.calories}</span>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="mb-2 text-xs font-medium text-slate-500">Macronutrients</h4>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={macroData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {macroData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-xs font-medium text-slate-500">Nutrients</h4>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={nutrientData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                      >
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={50} tick={{ fontSize: 10 }} />
                        <Tooltip
                          formatter={(value, name, props) => [`${value}${props.payload.unit}`, props.payload.name]}
                        />
                        <Bar dataKey="amount" fill="#8884d8" background={{ fill: "#eee" }} radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md bg-slate-50 p-2 text-sm">
                  <span>Protein</span>
                  <span className="font-medium">{nutritionalData.protein}g</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 p-2 text-sm">
                  <span>Carbohydrates</span>
                  <span className="font-medium">{nutritionalData.carbs}g</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 p-2 text-sm">
                  <span>Fat</span>
                  <span className="font-medium">{nutritionalData.fat}g</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 p-2 text-sm">
                  <span>Fiber</span>
                  <span className="font-medium">{nutritionalData.fiber}g</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 p-2 text-sm">
                  <span>Sugar</span>
                  <span className="font-medium">{nutritionalData.sugar}g</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 p-2 text-sm">
                  <span>Sodium</span>
                  <span className="font-medium">{nutritionalData.sodium}mg</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="dietary" className="mt-0">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium">Dietary Preferences</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div
                      className={`flex flex-col items-center rounded-md p-2 ${
                        nutritionalData.isVegetarian ? "bg-green-50 text-green-700" : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      <Leaf className="mb-1 h-5 w-5" />
                      <span className="text-xs font-medium">Vegetarian</span>
                    </div>
                    <div
                      className={`flex flex-col items-center rounded-md p-2 ${
                        nutritionalData.isVegan ? "bg-green-50 text-green-700" : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      <Leaf className="mb-1 h-5 w-5" />
                      <span className="text-xs font-medium">Vegan</span>
                    </div>
                    <div
                      className={`flex flex-col items-center rounded-md p-2 ${
                        nutritionalData.isGlutenFree ? "bg-green-50 text-green-700" : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      <Droplets className="mb-1 h-5 w-5" />
                      <span className="text-xs font-medium">Gluten-Free</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium">Allergens</h4>
                  <div className="flex flex-wrap gap-2">
                    {nutritionalData.allergens.map((allergen) => (
                      <div key={allergen} className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                        {allergen}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-md bg-slate-50 p-3">
                  <h4 className="mb-2 text-sm font-medium">Ingredients</h4>
                  <p className="text-xs text-slate-600">
                    {item.id === "1"
                      ? "Beef patty (100% grass-fed beef), brioche bun, lettuce, tomato, onion, pickles, cheddar cheese, special sauce (mayonnaise, ketchup, relish, spices)."
                      : item.id === "2"
                        ? "Plant-based patty (pea protein, beets, coconut oil), whole grain bun, lettuce, tomato, onion, avocado, vegan mayo."
                        : item.id === "5"
                          ? "Romaine lettuce, croutons, parmesan cheese, Caesar dressing (olive oil, egg yolk, lemon juice, garlic, anchovies, parmesan)."
                          : "Flour, sugar, butter, eggs, cocoa powder, chocolate chips, vanilla extract, salt."}
                  </p>
                </div>

                <div className="rounded-md bg-blue-50 p-3">
                  <h4 className="mb-2 text-sm font-medium text-blue-700">Preparation Method</h4>
                  <p className="text-xs text-blue-600">
                    {item.id === "1" || item.id === "2"
                      ? "Grilled to order. Our patties are cooked on a separate grill from other menu items to prevent cross-contamination."
                      : item.id === "5"
                        ? "Freshly prepared. Lettuce is washed and dried, dressing is made in-house daily."
                        : "Baked fresh daily in our kitchen."}
                  </p>
                </div>
              </div>
            </TabsContent>
          </motion.div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

