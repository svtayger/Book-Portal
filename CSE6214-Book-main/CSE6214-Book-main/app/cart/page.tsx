'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { getAuth } from "firebase/auth"
import { db } from "@/config/firebase"
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation' 

export default function CartPage() {
  const [cart, setCart] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    fetchCartItems()
  }, [])

  const router = useRouter()

  const fetchCartItems = async () => {
    try {
      const booksRef = collection(db, 'bookDetails')
      const q = query(booksRef, where('cart', '==', '1'))
      const querySnapshot = await getDocs(q)

      const cartItems = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        quantity: 1, // Default quantity
      }))

      setCart(cartItems)
    } catch (error) {
      console.error('Error fetching cart items:', error)
    }
  }

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCart(cart.map(item => item.id === id ? { ...item, quantity: newQuantity } : item))
  }

  const handleRemoveItem = async (id: string) => {
    try {
      const auth = getAuth()
      const user = auth.currentUser
  
      if (!user) {
        toast({ title: "Error", description: "You must be logged in to modify the cart." })
        return
      }
  
      const bookRef = doc(db, 'bookDetails', id)
      await updateDoc(bookRef, { cart: "0" }) // Update Firestore cart field to "0"
  
      setCart(cart.filter(item => item.id !== id)) // Remove from UI
  
      toast({
        title: "Removed",
        description: "Item removed from cart.",
      })
    } catch (error) {
      console.error('Error removing item from cart:', error)
      toast({
        title: "Error",
        description: "Failed to remove item. Check permissions.",
      })
    }
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = async () => {
    try {
      const auth = getAuth()
      const user = auth.currentUser

      if (!user) {
        toast({ title: "Error", description: "You must be logged in to checkout." })
        return
      }

      // Update orderPlaced field for all books in the cart
      const updatePromises = cart.map((item) => {
        const bookRef = doc(db, 'bookDetails', item.id)
        return updateDoc(bookRef, { orderPlaced: "1" })
      })

      await Promise.all(updatePromises)

      toast({
        title: "Success",
        description: "Your order has been placed.",
      })

      router.push('/payment')
    } catch (error) {
      console.error('Error during checkout:', error)
      toast({
        title: "Error",
        description: "Checkout failed. Please try again.",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                <Image
                  src={item.imgUrl}
                  alt={item.title}
                  width={80}
                  height={120}
                  className="object-cover"
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-gray-600">{item.author}</p>
                  <p className="text-lg font-bold">${item.price}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</Button>
                  <span>{item.quantity}</span>
                  <Button variant="outline" size="sm" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</Button>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.id)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Total: ${total.toFixed(2)}</h2>
            <Button onClick={handleCheckout}>Proceed to Checkout</Button>
          </div>
        </>
      )}
    </div>
  )
}
