"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Phone, Globe, Star, Info, Utensils, Calendar } from "lucide-react"

export default function RestaurantInfo() {
  const [activeTab, setActiveTab] = useState("info")

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Utensils className="h-5 w-5 text-primary" />
          Restaurant Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="info" onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="info" className="text-xs">
              <Info className="mr-1 h-3 w-3" />
              Details
            </TabsTrigger>
            <TabsTrigger value="hours" className="text-xs">
              <Clock className="mr-1 h-3 w-3" />
              Hours
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs">
              <Star className="mr-1 h-3 w-3" />
              Reviews
            </TabsTrigger>
          </TabsList>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="info" className="mt-0">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <div>
                    <h4 className="text-sm font-medium">Address</h4>
                    <p className="text-xs text-slate-500">123 Main Street, Anytown, USA</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <div>
                    <h4 className="text-sm font-medium">Phone</h4>
                    <p className="text-xs text-slate-500">(555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Globe className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <div>
                    <h4 className="text-sm font-medium">Website</h4>
                    <p className="text-xs text-slate-500">www.demorestaurant.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Utensils className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <div>
                    <h4 className="text-sm font-medium">Cuisine</h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">
                        American
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Burgers
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Pizza
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Salads
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hours" className="mt-0">
              <div className="space-y-2">
                {[
                  { day: "Monday", hours: "11:00 AM - 10:00 PM" },
                  { day: "Tuesday", hours: "11:00 AM - 10:00 PM" },
                  { day: "Wednesday", hours: "11:00 AM - 10:00 PM" },
                  { day: "Thursday", hours: "11:00 AM - 10:00 PM" },
                  { day: "Friday", hours: "11:00 AM - 11:00 PM" },
                  { day: "Saturday", hours: "10:00 AM - 11:00 PM" },
                  { day: "Sunday", hours: "10:00 AM - 9:00 PM" },
                ].map((item, index) => (
                  <motion.div
                    key={item.day}
                    className="flex items-center justify-between rounded-md p-2 text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: "#f8fafc" }}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-primary" />
                      <span className="font-medium">{item.day}</span>
                    </div>
                    <span className="text-xs text-slate-500">{item.hours}</span>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <div className="space-y-3">
                {[
                  {
                    name: "John D.",
                    rating: 5,
                    date: "2 days ago",
                    comment: "Amazing food and quick service! The burger was perfectly cooked.",
                  },
                  {
                    name: "Sarah M.",
                    rating: 4,
                    date: "1 week ago",
                    comment: "Great experience overall. The pizza was delicious but took a bit longer than expected.",
                  },
                  {
                    name: "Mike T.",
                    rating: 5,
                    date: "2 weeks ago",
                    comment: "The delivery bot was so cool! Food arrived hot and fresh.",
                  },
                ].map((review, index) => (
                  <motion.div
                    key={index}
                    className="rounded-md border border-slate-100 p-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-medium text-sm">{review.name}</span>
                      <span className="text-xs text-slate-500">{review.date}</span>
                    </div>
                    <div className="mb-2 flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600">{review.comment}</p>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </motion.div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

