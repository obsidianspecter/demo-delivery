"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QRCodeSVG } from "qrcode.react"
import { motion } from "framer-motion"
import { QrCode, Download, LinkIcon, Table, Utensils } from "lucide-react"
import { fadeIn, slideUp, scaleUp } from "@/lib/animation-variants"

export default function QRCodeGenerator() {
  const [restaurantId, setRestaurantId] = useState("demo-restaurant")
  const [tableNumber, setTableNumber] = useState("1")
  const [baseUrl, setBaseUrl] = useState("http://localhost:3000")
  const [qrColor, setQrColor] = useState("#f97316") // Primary color

  const menuUrl = `${baseUrl}/menu/${restaurantId}?table=${tableNumber}`

  return (
    <motion.div
      className="container mx-auto flex min-h-screen items-center justify-center p-4 food-pattern-bg"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <motion.div variants={slideUp}>
        <Card className="w-full max-w-md overflow-hidden shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary to-accent/80 text-white">
            <motion.div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
              whileHover={{ rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <QrCode className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-center text-2xl">QR Code Generator</CardTitle>
            <CardDescription className="text-center text-white/80">
              Generate a QR code for your restaurant table
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Label htmlFor="base-url" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-primary" />
                Base URL
              </Label>
              <Input
                id="base-url"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://your-domain.com"
                className="border-slate-200 focus-visible:ring-primary"
              />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Label htmlFor="restaurant-id" className="flex items-center gap-2">
                <Utensils className="h-4 w-4 text-primary" />
                Restaurant ID
              </Label>
              <Input
                id="restaurant-id"
                value={restaurantId}
                onChange={(e) => setRestaurantId(e.target.value)}
                placeholder="restaurant-name"
                className="border-slate-200 focus-visible:ring-primary"
              />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="table-number" className="flex items-center gap-2">
                <Table className="h-4 w-4 text-primary" />
                Table Number
              </Label>
              <Input
                id="table-number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="1"
                className="border-slate-200 focus-visible:ring-primary"
              />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Label htmlFor="qr-color" className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full" style={{ backgroundColor: qrColor }} />
                QR Code Color
              </Label>
              <Input
                id="qr-color"
                type="color"
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
                className="h-10 border-slate-200 focus-visible:ring-primary"
              />
            </motion.div>

            <motion.div
              className="rounded-lg border border-slate-200 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="mb-2 text-sm font-medium">Generated URL:</p>
              <p className="break-all text-sm text-slate-500">{menuUrl}</p>
            </motion.div>

            <motion.div className="flex justify-center py-4" variants={scaleUp}>
              <motion.div
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                whileHover={{
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  y: -5,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <QRCodeSVG value={menuUrl} size={200} fgColor={qrColor} level="H" includeMargin />
              </motion.div>
            </motion.div>
          </CardContent>
          <CardFooter className="bg-slate-50 p-6">
            <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full gap-2 bg-gradient-to-r from-primary to-primary/90"
                onClick={() => {
                  // Create a temporary link element
                  const link = document.createElement("a")

                  // Set link properties
                  link.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                    document.querySelector("svg")?.outerHTML || "",
                  )}`
                  link.download = `qr-${restaurantId}-table-${tableNumber}.svg`

                  // Append to body, click, and remove
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }}
              >
                <Download className="h-4 w-4" />
                Download QR Code
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  )
}

