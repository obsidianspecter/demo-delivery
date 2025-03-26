"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Utensils, QrCode, Clock, ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"
import { fadeIn, slideUp, staggerContainer } from "@/lib/animation-variants"

export default function Home() {
  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4 food-pattern-bg"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <motion.div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-xl" variants={slideUp}>
        <motion.div
          className="text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Utensils className="h-8 w-8 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 gradient-text">QR Food Ordering</h1>
          <p className="mt-2 text-sm text-slate-600">Scan a QR code to order food directly from your table</p>
        </motion.div>

        <motion.div className="space-y-6" variants={staggerContainer}>
          <motion.div className="rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 p-6" variants={slideUp}>
            <h2 className="mb-3 font-medium text-slate-900">How it works:</h2>
            <motion.ol className="ml-5 list-decimal space-y-3 text-sm text-slate-600">
              <motion.li
                className="flex items-center gap-2"
                variants={slideUp}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <QrCode className="h-4 w-4 text-primary" />
                <span>Scan the QR code at your table</span>
              </motion.li>
              <motion.li
                className="flex items-center gap-2"
                variants={slideUp}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Utensils className="h-4 w-4 text-primary" />
                <span>Browse the menu and add items to your cart</span>
              </motion.li>
              <motion.li
                className="flex items-center gap-2"
                variants={slideUp}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ShoppingCart className="h-4 w-4 text-primary" />
                <span>Place your order</span>
              </motion.li>
              <motion.li
                className="flex items-center gap-2"
                variants={slideUp}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Clock className="h-4 w-4 text-primary" />
                <span>Track your order status in real-time</span>
              </motion.li>
            </motion.ol>
          </motion.div>

          <motion.div
            className="flex justify-center"
            variants={slideUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/menu/demo-restaurant">
              <Button className="gap-2 bg-gradient-to-r from-primary to-primary/90 px-6 py-6 text-lg shadow-lg transition-all hover:shadow-xl">
                Try Demo
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-8 text-center text-sm text-slate-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p>No account needed. Just scan and order!</p>
      </motion.div>
    </motion.div>
  )
}

