"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Clock, ChefHat } from "lucide-react"
import { motion } from "framer-motion"
import { cardHover, buttonHover } from "@/lib/animation-variants"
import type { MenuItem } from "@/lib/sample-data"

interface MenuItemCardProps {
  item: MenuItem
  onAddToCart: () => void
  onViewPreparation: () => void
}

export default function MenuItemCard({ item, onAddToCart, onViewPreparation }: MenuItemCardProps) {
  return (
    <motion.div initial="rest" whileHover="hover" whileTap="tap" variants={cardHover}>
      <Card className="overflow-hidden">
        <motion.div
          className="relative h-48 w-full overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={item.image || "/placeholder.jpg"}
            alt={item.name}
            fill
            className="object-cover transition-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute bottom-2 right-2 rounded-full bg-primary px-2 py-1 text-xs font-bold text-white">
            ${item.price.toFixed(2)}
          </div>
          {item.popular && (
            <div className="absolute left-2 top-2 rounded-full bg-accent px-2 py-1 text-xs font-bold text-white">
              Popular
            </div>
          )}
        </motion.div>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-bold">
              <motion.span whileHover={{ color: "var(--primary)" }}>{item.name}</motion.span>
            </CardTitle>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              <span>{item.preparationTime || 15} min</span>
            </div>
          </div>
          <motion.p className="text-sm text-slate-500" initial={{ opacity: 0.8 }} whileHover={{ opacity: 1 }}>
            {item.description}
          </motion.p>

          {item.tags && item.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
        <CardFooter>
          <div className="flex w-full gap-2">
            <motion.div className="flex-1" variants={buttonHover}>
              <Button onClick={onAddToCart} className="w-full gap-2 bg-gradient-to-r from-primary to-primary/90">
                <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                  <PlusCircle className="h-4 w-4" />
                </motion.div>
                Add to Cart
              </Button>
            </motion.div>

            <motion.div variants={buttonHover}>
              <Button variant="outline" size="icon" onClick={onViewPreparation} className="h-10 w-10">
                <ChefHat className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

