"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Clock, Utensils, ChefHat, Flame, Thermometer, Bot } from "lucide-react"
import type { MenuItem } from "@/lib/sample-data"

interface FoodPreparationModalProps {
  isOpen: boolean
  onClose: () => void
  item: MenuItem | null
}

export default function FoodPreparationModal({ isOpen, onClose, item }: FoodPreparationModalProps) {
  const [activeTab, setActiveTab] = useState("preparation")

  if (!item) return null

  // Preparation steps based on category
  const getPreparationSteps = () => {
    switch (item.category) {
      case "Burgers":
        return [
          {
            step: 1,
            title: "Patty Preparation",
            description: "Fresh ground beef is seasoned and formed into patties",
            time: "2 min",
            icon: <Utensils className="h-5 w-5" />,
          },
          {
            step: 2,
            title: "Grill",
            description: "Patty is grilled to perfection on our flame grill",
            time: "8 min",
            icon: <Flame className="h-5 w-5" />,
          },
          {
            step: 3,
            title: "Assembly",
            description: "Burger is assembled with fresh toppings and condiments",
            time: "2 min",
            icon: <ChefHat className="h-5 w-5" />,
          },
          {
            step: 4,
            title: "Quality Check",
            description: "Chef ensures burger meets our quality standards",
            time: "1 min",
            icon: <Thermometer className="h-5 w-5" />,
          },
          {
            step: 5,
            title: "Delivery",
            description: "Our delivery bot brings your burger to your table",
            time: "2 min",
            icon: <Bot className="h-5 w-5" />,
          },
        ]
      case "Pizza":
        return [
          {
            step: 1,
            title: "Dough Preparation",
            description: "Fresh dough is hand-stretched to the perfect thickness",
            time: "3 min",
            icon: <ChefHat className="h-5 w-5" />,
          },
          {
            step: 2,
            title: "Topping Application",
            description: "Sauce, cheese, and toppings are added",
            time: "4 min",
            icon: <Utensils className="h-5 w-5" />,
          },
          {
            step: 3,
            title: "Baking",
            description: "Pizza is baked in our stone oven at 800°F",
            time: "10 min",
            icon: <Flame className="h-5 w-5" />,
          },
          {
            step: 4,
            title: "Slicing",
            description: "Pizza is sliced and checked for quality",
            time: "1 min",
            icon: <Thermometer className="h-5 w-5" />,
          },
          {
            step: 5,
            title: "Delivery",
            description: "Our delivery bot brings your pizza to your table",
            time: "2 min",
            icon: <Bot className="h-5 w-5" />,
          },
        ]
      case "Salads":
        return [
          {
            step: 1,
            title: "Ingredient Prep",
            description: "Fresh vegetables are washed and prepared",
            time: "3 min",
            icon: <Utensils className="h-5 w-5" />,
          },
          {
            step: 2,
            title: "Protein Cooking",
            description: "Any proteins are cooked to order",
            time: "5 min",
            icon: <Flame className="h-5 w-5" />,
          },
          {
            step: 3,
            title: "Assembly",
            description: "Salad is assembled with all ingredients",
            time: "2 min",
            icon: <ChefHat className="h-5 w-5" />,
          },
          {
            step: 4,
            title: "Dressing",
            description: "Dressing is added or served on the side",
            time: "1 min",
            icon: <Thermometer className="h-5 w-5" />,
          },
          {
            step: 5,
            title: "Delivery",
            description: "Our delivery bot brings your salad to your table",
            time: "2 min",
            icon: <Bot className="h-5 w-5" />,
          },
        ]
      default:
        return [
          {
            step: 1,
            title: "Preparation",
            description: "Ingredients are prepared according to recipe",
            time: "5 min",
            icon: <Utensils className="h-5 w-5" />,
          },
          {
            step: 2,
            title: "Cooking",
            description: "Food is cooked using the appropriate method",
            time: "8 min",
            icon: <Flame className="h-5 w-5" />,
          },
          {
            step: 3,
            title: "Finishing",
            description: "Final touches and plating",
            time: "2 min",
            icon: <ChefHat className="h-5 w-5" />,
          },
          {
            step: 4,
            title: "Quality Check",
            description: "Chef ensures food meets our quality standards",
            time: "1 min",
            icon: <Thermometer className="h-5 w-5" />,
          },
          {
            step: 5,
            title: "Delivery",
            description: "Our delivery bot brings your food to your table",
            time: "2 min",
            icon: <Bot className="h-5 w-5" />,
          },
        ]
    }
  }

  const preparationSteps = getPreparationSteps()
  const totalPrepTime = preparationSteps.reduce((total, step) => total + Number.parseInt(step.time), 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl gradient-text">Food Preparation Process</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="preparation" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preparation">
              <ChefHat className="mr-2 h-4 w-4" />
              Preparation
            </TabsTrigger>
            <TabsTrigger value="delivery">
              <Bot className="mr-2 h-4 w-4" />
              Delivery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preparation" className="mt-4">
            <div className="mb-4 rounded-lg bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">{item.preparationTime} min</span>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />

              {/* Preparation steps */}
              <div className="space-y-6">
                {preparationSteps.map((step, index) => (
                  <motion.div
                    key={step.step}
                    className="relative flex gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 z-10">
                      {step.icon}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{step.title}</h4>
                        <span className="text-sm text-slate-500">{step.time}</span>
                      </div>
                      <p className="text-sm text-slate-600">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="delivery" className="mt-4">
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="mb-2 font-medium">Delivery Bot Process</h3>
                <p className="text-sm text-slate-600">
                  Our state-of-the-art delivery bots bring your food directly from the kitchen to your table, ensuring
                  your meal arrives hot and fresh.
                </p>
              </div>

              <div className="grid gap-4">
                <motion.div
                  className="rounded-lg border p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <ChefHat className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="font-medium">Kitchen Preparation</h4>
                  </div>
                  <p className="text-sm text-slate-600">
                    Once your food is prepared, it's placed in a temperature-controlled compartment on our delivery bot.
                  </p>
                </motion.div>

                <motion.div
                  className="rounded-lg border p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="font-medium">Bot Navigation</h4>
                  </div>
                  <p className="text-sm text-slate-600">
                    The bot uses advanced sensors and mapping technology to navigate from the kitchen to your table,
                    avoiding obstacles along the way.
                  </p>
                </motion.div>

                <motion.div
                  className="rounded-lg border p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Thermometer className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="font-medium">Temperature Control</h4>
                  </div>
                  <p className="text-sm text-slate-600">
                    Our bots maintain the perfect temperature for your food during transit, ensuring hot foods stay hot
                    and cold foods stay cold.
                  </p>
                </motion.div>

                <motion.div
                  className="rounded-lg border p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Utensils className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="font-medium">Delivery Completion</h4>
                  </div>
                  <p className="text-sm text-slate-600">
                    When the bot arrives at your table, it will announce its presence and open its compartment, allowing
                    you to take your food. The bot then returns to the kitchen for its next delivery.
                  </p>
                </motion.div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

