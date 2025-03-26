"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, Clock } from "lucide-react"

// Sample food gallery items
const galleryItems = [
  {
    id: 1,
    name: "Signature Burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop",
    description: "Our famous burger with premium beef, special sauce, and fresh vegetables",
    rating: 4.8,
    prepTime: "15 min",
    category: "Burgers",
  },
  {
    id: 2,
    name: "Margherita Pizza",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=400&fit=crop",
    description: "Classic pizza with tomato sauce, fresh mozzarella, and basil leaves",
    rating: 4.7,
    prepTime: "20 min",
    category: "Pizza",
  },
  {
    id: 3,
    name: "Caesar Salad",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&h=400&fit=crop",
    description: "Crisp romaine lettuce with our homemade Caesar dressing, croutons, and parmesan",
    rating: 4.5,
    prepTime: "10 min",
    category: "Salads",
  },
  {
    id: 4,
    name: "Chocolate Lava Cake",
    image: "https://images.unsplash.com/photo-1617305855058-336d24456869?w=500&h=400&fit=crop",
    description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
    rating: 4.9,
    prepTime: "15 min",
    category: "Desserts",
  },
]

export default function FoodGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const currentItem = galleryItems[currentIndex]

  const goToPrevious = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1))
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          {/* Gallery navigation */}
          <div className="absolute left-4 top-1/2 z-10 -translate-y-1/2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                size="icon"
                variant="secondary"
                onClick={goToPrevious}
                className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </motion.div>
          </div>

          <div className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                size="icon"
                variant="secondary"
                onClick={goToNext}
                className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </motion.div>
          </div>

          {/* Gallery image */}
          <div className="relative h-64 w-full overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={{
                  enter: (direction) => ({
                    x: direction > 0 ? 1000 : -1000,
                    opacity: 0,
                  }),
                  center: {
                    x: 0,
                    opacity: 1,
                  },
                  exit: (direction) => ({
                    x: direction > 0 ? -1000 : 1000,
                    opacity: 0,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute h-full w-full"
              >
                <Image
                  src={currentItem.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop"}
                  alt={currentItem.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Image overlay content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-full bg-primary/90 px-2 py-0.5 text-xs font-medium">
                        {currentItem.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{currentItem.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-white" />
                        <span className="text-xs font-medium">{currentItem.prepTime}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold">{currentItem.name}</h3>
                    <p className="text-sm text-white/80">{currentItem.description}</p>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Gallery indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
            {galleryItems.map((_, index) => (
              <motion.button
                key={index}
                className={`h-1.5 rounded-full ${index === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1)
                  setCurrentIndex(index)
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
        </div>

        {/* Featured items */}
        <div className="grid grid-cols-3 gap-px bg-slate-200">
          {galleryItems
            .filter((_, i) => i !== currentIndex)
            .slice(0, 3)
            .map((item, index) => (
              <motion.div
                key={item.id}
                className="relative bg-white p-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ backgroundColor: "#f8fafc" }}
              >
                <div className="relative mb-2 h-16 w-full overflow-hidden rounded">
                  <Image
                    src={item.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="text-xs font-medium">{item.name}</h4>
                <div className="mt-1 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{item.rating}</span>
                  </div>
                  <span className="text-xs text-slate-500">{item.prepTime}</span>
                </div>
              </motion.div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}

