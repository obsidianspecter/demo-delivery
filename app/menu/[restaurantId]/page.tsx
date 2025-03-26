"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { ShoppingCart, Utensils, Filter, Search, Bot, ChefHat, Clock, Table, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import CartDrawer from "@/components/cart-drawer"
import MenuItemCard from "@/components/menu-item-card"
import OrderStatusModal from "@/components/order-status-modal"
import FoodPreparationModal from "@/components/food-preparation-modal"
import FoodGallery from "@/components/food-gallery"
import RestaurantInfo from "@/components/restaurant-info"
import { sampleMenuItems, type MenuItem, type CartItem } from "@/lib/sample-data"
import { addOrder, useOrder, updateOrderTable } from "@/lib/order-service"
import { fadeIn, slideUp, staggerContainer } from "@/lib/animation-variants"

// Available tables in the restaurant
const AVAILABLE_TABLES = [
  { id: "Table-1", capacity: 4, key: "t1" },
  { id: "Table-2", capacity: 6, key: "t2" },
  { id: "Table-3", capacity: 4, key: "t3" },
  { id: "Table-4", capacity: 8, key: "t4" },
  { id: "Table-5", capacity: 4, key: "t5" },
  { id: "Table-6", capacity: 6, key: "t6" },
  { id: "Table-7", capacity: 4, key: "t7" },
  { id: "Table-8", capacity: 8, key: "t8" },
  { id: "Table-9", capacity: 4, key: "t9" },
  { id: "Table-10", capacity: 6, key: "t10" },
]

export default function MenuPage() {
  const params = useParams()
  const restaurantId = params.restaurantId as string

  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [currentOrderId, setCurrentOrderId] = useState<string | undefined>(undefined)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isPreparationModalOpen, setIsPreparationModalOpen] = useState(false)
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [sortOption, setSortOption] = useState<
    "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc" | "prep-time"
  >("default")
  const [currentTable, setCurrentTable] = useState("Table-1")
  const [showTableDialog, setShowTableDialog] = useState(false)

  // Get current order from order service
  const currentOrder = useOrder(currentOrderId)

  // Ref for scrolling to categories
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Calculate total items in cart
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Fetch menu items (simulated)
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Use sample data
        setMenuItems(sampleMenuItems)

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(sampleMenuItems.map((item) => item.category)))
        setCategories(uniqueCategories)

        // Extract unique tags
        const allTags = sampleMenuItems
          .flatMap((item) => item.tags || [])
          .filter((tag, index, self) => self.indexOf(tag) === index)
        setAvailableTags(allTags)

        // Set first category as active
        if (uniqueCategories.length > 0) {
          setActiveCategory(uniqueCategories[0])
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchMenuItems()
  }, [restaurantId])

  // Show status modal when order status changes
  useEffect(() => {
    if (currentOrder) {
      setIsStatusModalOpen(true)
    }
  }, [currentOrder])

  // Filter and sort menu items
  const filteredMenuItems = menuItems
    .filter((item) => {
      // Filter by category if active
      if (activeCategory && item.category !== activeCategory) {
        return false
      }

      // Filter by search query
      if (
        searchQuery &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Filter by selected tags
      if (selectedTags.length > 0) {
        const itemTags = item.tags || []
        if (!selectedTags.some((tag) => itemTags.includes(tag))) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "prep-time":
          return (a.preparationTime || 0) - (b.preparationTime || 0)
        default:
          // Default sorting - by category then by name
          if (a.category === b.category) {
            return a.name.localeCompare(b.name)
          }
          return a.category.localeCompare(b.category)
      }
    })

  // Add item to cart
  const addToCart = (item: MenuItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id)

      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      } else {
        return [...prevItems, { ...item, quantity: 1 }]
      }
    })
  }

  // Update item quantity in cart
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
    } else {
      setCartItems((prevItems) => prevItems.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
    }
  }

  // Place order with current table
  const placeOrder = () => {
    try {
      // Add order to order service with current table
      const newOrder = addOrder(cartItems, totalPrice, currentTable)

      // Update state
      setCurrentOrderId(newOrder.id)
      setCartItems([])
      setIsCartOpen(false)
      setIsStatusModalOpen(true)
    } catch (error) {
      console.error("Error placing order:", error)
    }
  }

  // Open food preparation modal
  const openPreparationModal = (item: MenuItem) => {
    setSelectedMenuItem(item)
    setIsPreparationModalOpen(true)
  }

  // Scroll to category
  const scrollToCategory = (category: string) => {
    if (categoryRefs.current[category]) {
      categoryRefs.current[category]?.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <motion.div
      className="min-h-screen bg-slate-50 pb-20 menu-pattern-bg"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Restaurant header */}
      <motion.div className="bg-white shadow-md" variants={slideUp}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
                whileHover={{ rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Utensils className="h-6 w-6 text-primary" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 gradient-text">
                  {restaurantId
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </h1>
                <div className="flex items-center gap-2">
                  <Table className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-500">{currentTable}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 hover:bg-slate-100"
                    onClick={() => setShowTableDialog(true)}
                  >
                    Change Table
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Table Selection Dialog */}
      <Dialog open={showTableDialog} onOpenChange={setShowTableDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Your Table</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {AVAILABLE_TABLES.map((table) => (
              <Button
                key={table.key}
                variant={currentTable === table.id ? "default" : "outline"}
                className="h-16 flex flex-col items-center justify-center gap-2"
                onClick={() => {
                  setCurrentTable(table.id)
                  setShowTableDialog(false)
                }}
              >
                <span className="font-medium">{table.id}</span>
                <div className="flex items-center text-xs text-slate-500">
                  <Users className="mr-1 h-3 w-3" />
                  Up to {table.capacity} people
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Food gallery */}
      <div className="container mx-auto px-4 py-4">
        <FoodGallery />
      </div>

      {/* Category navigation */}
      <motion.div className="sticky top-0 z-10 bg-white shadow-sm" variants={slideUp}>
        <div className="container mx-auto px-4">
          <div className="no-scrollbar flex overflow-x-auto py-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                className={`mr-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                onClick={() => {
                  setActiveCategory(category)
                  scrollToCategory(category)
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Search and filters */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search menu..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex gap-2" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
            Filters
            {selectedTags.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {selectedTags.length}
              </Badge>
            )}
          </Button>
        </div>

        {showFilters && (
          <motion.div
            className="mt-3 rounded-lg border bg-white p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="mb-3">
              <h3 className="mb-2 text-sm font-medium">Dietary Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Sort By</h3>
              <select
                className="w-full rounded-md border border-slate-200 p-2 text-sm"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="prep-time">Preparation Time</option>
              </select>
            </div>
          </motion.div>
        )}
      </div>

      {/* Menu content and sidebar */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            {isLoading ? (
              <motion.div className="grid gap-4 sm:grid-cols-2" variants={staggerContainer}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div key={i} variants={slideUp} className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="h-40 animate-pulse bg-slate-200" />
                    <div className="p-4">
                      <div className="mb-2 h-6 w-2/3 animate-pulse rounded bg-slate-200" />
                      <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                      <div className="mt-4 h-10 w-full animate-pulse rounded bg-slate-200" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : filteredMenuItems.length === 0 ? (
              <motion.div
                className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Search className="mb-3 h-10 w-10 text-slate-300" />
                <h3 className="text-lg font-medium">No items found</h3>
                <p className="text-sm text-slate-500">Try adjusting your search or filters</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedTags([])
                    setActiveCategory(null)
                  }}
                >
                  Clear filters
                </Button>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                {categories
                  .filter((category) => !activeCategory || category === activeCategory)
                  .map((category) => {
                    const categoryItems = filteredMenuItems.filter((item) => item.category === category)

                    if (categoryItems.length === 0) return null

                    return (
                      <motion.div
                        key={category}
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        ref={(el) => (categoryRefs.current[category] = el)}
                      >
                        <motion.h2
                          className="mb-4 text-xl font-semibold text-slate-900"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          {category}
                        </motion.h2>
                        <motion.div
                          className="grid gap-4 sm:grid-cols-2"
                          variants={staggerContainer}
                          initial="hidden"
                          animate="visible"
                        >
                          {categoryItems.map((item) => (
                            <motion.div key={item.id} variants={slideUp}>
                              <MenuItemCard
                                item={item}
                                onAddToCart={() => addToCart(item)}
                                onViewPreparation={() => openPreparationModal(item)}
                              />
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    )
                  })}
              </AnimatePresence>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <RestaurantInfo />

            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="mb-3 flex items-center gap-2 font-medium">
                <Clock className="h-5 w-5 text-primary" />
                Preparation Times
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between rounded-md bg-slate-50 p-2">
                  <span>Burgers</span>
                  <span className="font-medium">12-18 min</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 p-2">
                  <span>Pizza</span>
                  <span className="font-medium">18-25 min</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 p-2">
                  <span>Salads</span>
                  <span className="font-medium">8-15 min</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 p-2">
                  <span>Appetizers</span>
                  <span className="font-medium">10-15 min</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 p-2">
                  <span>Desserts</span>
                  <span className="font-medium">5-15 min</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow">
              <h3 className="mb-3 flex items-center gap-2 font-medium">
                <ChefHat className="h-5 w-5 text-primary" />
                Our Process
              </h3>
              <p className="mb-3 text-sm text-slate-600">Learn about our food preparation and delivery process.</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // Use a popular item as default if none selected
                    const popularItem = menuItems.find((item) => item.popular) || menuItems[0]
                    setSelectedMenuItem(popularItem)
                    setIsPreparationModalOpen(true)
                  }}
                >
                  <ChefHat className="mr-2 h-4 w-4" />
                  Preparation
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (currentOrder) {
                      setIsStatusModalOpen(true)
                    } else {
                      // Create a sample order to show delivery
                      const newOrder = addOrder([{ ...menuItems[0], quantity: 1 }], menuItems[0].price, "Table-1")
                      setCurrentOrderId(newOrder.id)
                      setIsStatusModalOpen(true)
                    }
                  }}
                >
                  <Bot className="mr-2 h-4 w-4" />
                  Delivery
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart button */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            className="fixed bottom-4 left-0 right-0 flex justify-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 px-6 py-6 text-lg shadow-lg"
                size="lg"
              >
                <motion.div
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, repeatDelay: 2 }}
                >
                  <ShoppingCart className="h-5 w-5" />
                </motion.div>
                <span>View Cart ({totalItems})</span>
                <motion.span
                  className="ml-2 font-bold"
                  key={totalPrice}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  ${totalPrice.toFixed(2)}
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        updateQuantity={updateQuantity}
        totalPrice={totalPrice}
        placeOrder={placeOrder}
      />

      {/* Order status modal */}
      <OrderStatusModal 
        isOpen={isStatusModalOpen} 
        onClose={() => setIsStatusModalOpen(false)} 
        order={currentOrder}
        onTableChange={(newTable) => {
          if (currentOrder) {
            updateOrderTable(currentOrder.id, newTable)
          }
        }}
      />

      {/* Food preparation modal */}
      <FoodPreparationModal
        isOpen={isPreparationModalOpen}
        onClose={() => setIsPreparationModalOpen(false)}
        item={selectedMenuItem}
      />
    </motion.div>
  )
}

