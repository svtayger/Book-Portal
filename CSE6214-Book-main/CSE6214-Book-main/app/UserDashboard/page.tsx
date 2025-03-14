'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { LogOut, Search } from "lucide-react"
import { getAuth } from "firebase/auth"
import { db } from "@/config/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Input } from "@/components/ui/input"

export default function UserDashboard() {
  const [userData, setUserData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const authInstance = getAuth()

  useEffect(() => {
    const currentUser = authInstance.currentUser
    if (currentUser) {
      fetchUserData(currentUser.uid)
    } else {
      setError("No user is logged in.")
    }
  }, [])

  const fetchUserData = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid)
      const userDoc = await getDoc(userDocRef)
      if (userDoc.exists()) {
        setUserData(userDoc.data())
      } else {
        setError("User not found")
      }
    } catch (error) {
      setError("Failed to fetch user data")
      console.error(error)
    }
  }

  const handleLogout = () => {
    console.log("Logging out")
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push("/login")
  }

  const handleRegisterAsSeller = () => {
    console.log("Registering as seller")
    toast({
      title: "Seller Registration",
      description: "Redirecting to seller registration form.",
    })
    router.push("/seller-register")
  }

  // Search function
  const [query, setQuery] = useState('')
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  if (error) return <div>{error}</div>
  if (!userData) return <div>Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Logout Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-teal-700">Welcome, {userData.name}</h1>
        <Button onClick={handleLogout} variant="outline" className="flex items-center">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex justify-center mb-8">
        <div className="relative w-full max-w-xl">
          <Input
            type="text"
            placeholder="Search for books..."
            className="pr-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" className="absolute right-0 top-0 bottom-0">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Profile Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Profile Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Member Since:</strong> {userData.createdAt.toDate().toLocaleDateString()}</p>
        </CardContent>
      </Card>

      {/* Buttons in a Grid Layout */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/wishlist1">
          <Button className="w-full">View Wishlist</Button>
        </Link>
        <Link href="/cart">
          <Button className="w-full">View Shopping Cart</Button>
        </Link>
        <Link href="/complaint">
          <Button className="w-full">Submit Complaint</Button>
        </Link>
        <Button onClick={handleRegisterAsSeller} className="w-full">
          Register as Seller
        </Button>
      </div>
    </div>
  )
}
