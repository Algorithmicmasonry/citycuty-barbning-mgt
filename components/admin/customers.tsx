
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, MessageCircle, Phone, MessageCircleWarning, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Customer {
  id: string
  name: string
  phone: string
  visits: number
  lastVisit: string
  totalSpent: number
  hasVisits: boolean
}

interface Props {
  customers: Customer[]
}

export function CustomerRecords({ customers }: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "visits" | "spent">("name")

  // Filter and sort customers
  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customers

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        customer =>
          customer.name.toLowerCase().includes(query) ||
          customer.phone.includes(query)
      )
    }

    // Sort customers
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "visits":
          return b.visits - a.visits
        case "spent":
          return b.totalSpent - a.totalSpent
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return sorted
  }, [customers, searchQuery, sortBy])

  // Calculate stats
  const stats = useMemo(() => {
    const total = customers.length
    const active = customers.filter(c => c.hasVisits).length
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
    const avgSpent = total > 0 ? totalRevenue / total : 0

    return { total, active, totalRevenue, avgSpent }
  }, [customers])

  const handleWhatsApp = (phone: string, name: string) => {
    // Remove non-numeric characters and format for WhatsApp
    const cleanPhone = phone.replace(/\D/g, "")
    const message = encodeURIComponent(`Hello ${name}, thank you for choosing CityCut BarberShop!`)
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank")
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Customer Records</h2>
        <p className="text-muted-foreground">All registered customers and their service history</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              <span className="text-2xl font-bold text-foreground">{stats.active}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% with visits
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">
                ₦{stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">From all customers</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">
                ₦{stats.avgSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Per customer</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Sort */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find customers by name or phone number</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="w-full md:w-[200px] space-y-2">
              <Label htmlFor="sort">Sort By</Label>
              <Select value={sortBy} onValueChange={(value: "name" | "visits" | "spent") => setSortBy(value)}>
                <SelectTrigger id="sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="visits">Most Visits</SelectItem>
                  <SelectItem value="spent">Highest Spent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
          <CardDescription>
            Showing {filteredAndSortedCustomers.length} of {customers.length} customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAndSortedCustomers.length === 0 ? (
            <div className="space-y-4 flex flex-col items-center justify-center py-12">
              <MessageCircleWarning className="w-12 h-12 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium text-foreground">No customers found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "No customers have been registered yet"}
                </p>
              </div>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAndSortedCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-3 px-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-13 md:ml-0 flex-wrap">
                    <div className="text-left md:text-right">
                      <p className="text-sm font-semibold text-foreground">
                        {customer.visits} visit{customer.visits !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-muted-foreground">Last: {customer.lastVisit}</p>
                    </div>
                    <div className="text-left md:text-right min-w-[80px]">
                      <p className="text-sm font-semibold text-foreground">
                        ₦{customer.totalSpent.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">Total spent</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-green-500/10 hover:bg-green-500/20 border-green-500/30"
                        onClick={() => handleWhatsApp(customer.phone, customer.name)}
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        WhatsApp
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleCall(customer.phone)}>
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}