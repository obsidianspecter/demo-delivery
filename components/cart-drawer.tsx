"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { slideInRight, cartItemAdd } from "@/lib/animation-variants"
import type { CartItem } from "@/lib/sample-data"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  updateQuantity: (id: string, quantity: number) => void
  totalPrice: number
  placeOrder: () => void
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  updateQuantity,
  totalPrice,
  placeOrder,
}: CartDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <motion.div initial="hidden" animate="visible" variants={slideInRight} className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <motion.div whileHover={{ rotate: 10 }} transition={{ type: "spring", stiffness: 300 }}>
                <ShoppingCart className="h-5 w-5 text-primary" />
              </motion.div>
              <span className="gradient-text">Your Cart</span>
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4">
            {items.length === 0 ? (
              <motion.div
                className="flex h-full flex-col items-center justify-center text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}>
                  <ShoppingCart className="mb-4 h-16 w-16 text-slate-200" />
                </motion.div>
                <h3 className="text-lg font-medium">Your cart is empty</h3>
                <p className="text-sm text-slate-500">Add items from the menu to get started</p>
              </motion.div>
            ) : (
              <AnimatePresence>
                <motion.div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                      variants={cartItemAdd}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-slate-500">${item.price.toFixed(2)} each</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            {item.quantity === 1 ? (
                              <Trash2 className="h-4 w-4 text-destructive" />
                            ) : (
                              <Minus className="h-4 w-4" />
                            )}
                          </Button>
                        </motion.div>

                        <motion.span
                          className="flex h-8 w-8 items-center justify-center rounded-md bg-white font-medium"
                          key={item.quantity}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {item.quantity}
                        </motion.span>

                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {items.length > 0 && (
            <>
              <Separator />

              <motion.div
                className="py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <motion.span
                    className="text-lg font-bold text-primary"
                    key={totalPrice}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    ${totalPrice.toFixed(2)}
                  </motion.span>
                </div>
              </motion.div>

              <SheetFooter>
                <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={placeOrder}
                    className="w-full bg-gradient-to-r from-primary to-primary/90 py-6 text-lg"
                  >
                    Place Order
                  </Button>
                </motion.div>
              </SheetFooter>
            </>
          )}
        </motion.div>
      </SheetContent>
    </Sheet>
  )
}

