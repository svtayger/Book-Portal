'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/config/firebase'
import { collection, getDocs, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

// *** Added for logout functionality ***
import { getAuth } from 'firebase/auth'
import { useToast } from '@/components/ui/use-toast'
import { LogOut } from 'lucide-react'

export default function SellerDashboardPage() {
  const [books, setBooks] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [isSeller, setIsSeller] = useState<boolean | null>(null)
  const [sellerData, setSellerData] = useState<any>(null) // Stores seller info
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    price: '',
    stock: '',
    stockStatus: 'in stock',
    description: '',
    imgUrl: '',
  })
  const [toastMessage, setToastMessage] = useState<string | null>(null) // <-- Toast state

  const router = useRouter()

  // *** Added for logout functionality ***
  const authInstance = getAuth()
  const { toast } = useToast()

  // *** Added logout function ***
  const handleLogout = () => {
    console.log("Logging out")
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push("/login")
  }

  // 🔹 Check if user is a seller
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists() && userDoc.data().role === 'seller') {
          setIsSeller(true)
          setSellerData({ id: user.uid, name: userDoc.data().name }) // Store seller info
          fetchBooks()
          fetchOrders()
        } else {
          setIsSeller(false)
        }
      } else {
        setIsSeller(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // 🔹 Fetch books from Firestore
  const fetchBooks = async () => {
    try {
      const booksSnapshot = await getDocs(collection(db, 'bookDetails'))
      const filteredBooks = booksSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((book) => book.status === "approved") // Only approved books
  
      setBooks(filteredBooks)
    } catch (error) {
      console.error('Error fetching books:', error)
    }
  }

  // 🔹 Fetch orders where orderPlaced === "1"
  const fetchOrders = async () => {
    try {
      const booksSnapshot = await getDocs(collection(db, 'bookDetails'))
      const booksData = booksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

      // Only show books where orderPlaced === "1" (string)
      setOrders(booksData.filter((book) => book.orderPlaced === "1" && book.returnStatus !== "1"))
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  // 🔹 Update book stock & status
  const handleUpdateBook = async (bookId: string, newStock: number, newStatus: string) => {
    try {
      const bookRef = doc(db, 'bookDetails', bookId)
      await updateDoc(bookRef, { stock: newStock, stockStatus: newStatus })

      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === bookId ? { ...book, stock: newStock, stockStatus: newStatus } : book
        )
      )
    } catch (error) {
      console.error('Error updating book:', error)
    }
  }

  const updateReturnStatus = async (bookId: string) => {
    try {
      const bookRef = doc(db, 'bookDetails', bookId)
      await updateDoc(bookRef, { returnStatus: "1" }) // Set returnStatus to "1"
  
      fetchOrders() // Refresh orders list
    } catch (error) {
      console.error('Error updating return status:', error)
    }
  }  

  // 🔹 Handle input changes for new book
  const handleInputChange = (e: any) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value })
  }

  // 🔹 Handle adding new book to Firestore with unified validation
  const handleAddBook = async () => {
    if (!sellerData) return

    // Unified validation for required fields and datatype
    if (
      !newBook.title.trim() ||
      !newBook.author.trim() ||
      newBook.price.trim() === "" ||
      isNaN(Number(newBook.price))
    ) {
      setToastMessage("Invalid input: Title, Author, and Price must be valid.")
      setTimeout(() => setToastMessage(null), 3000)
      return
    }

    // Default stock to 0 if not entered
    const stockValue = newBook.stock.trim() === "" ? 0 : Number(newBook.stock)

    const bookData = {
      ...newBook,
      price: Number(newBook.price),
      stock: stockValue,
      seller: sellerData.name,
      sellerId: sellerData.id,
      cart: '0',
      wishlist: '0',
      shipStatus: 'processing',
      returnStatus: "0",
      status: 'pending',
      orderPlaced: "0",
    }

    try {
      await addDoc(collection(db, 'bookDetails'), bookData)
      fetchBooks()
      setNewBook({
        title: '',
        author: '',
        price: '',
        stock: '',
        stockStatus: 'in stock',
        description: '',
        imgUrl: '',
      })

      // Show toast notification (UI only)
      setToastMessage('Book added successfully! Pending admin approval.')
      setTimeout(() => setToastMessage(null), 3000)

    } catch (error) {
      console.error('Error adding book:', error)
    }
  }

  // 🔹 Update shipStatus and remove from list when shipped
  const updateShipStatus = async (bookId: string, newStatus: string) => {
    try {
      const bookRef = doc(db, 'bookDetails', bookId)
      await updateDoc(bookRef, { 
        shipStatus: newStatus, 
        orderPlaced: newStatus === 'shipped' ? "0" : "1"  // If shipped, remove from list
      })

      fetchOrders()
    } catch (error) {
      console.error('Error updating ship status:', error)
    }
  }

  const setBookPending = async (bookId: string) => {
    try {
      const bookRef = doc(db, 'bookDetails', bookId)
      await updateDoc(bookRef, { status: "pending" }) // Update status to pending
  
      // Update state to reflect the change
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === bookId ? { ...book, status: "pending" } : book
        )
      )
    } catch (error) {
      console.error('Error updating book status:', error)
    }
  }  

  if (isSeller === null) return <div>Loading...</div>
  if (!isSeller) return <div>Access Denied. You are not a seller.</div>

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Added Logout Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <Button onClick={handleLogout} variant="outline" className="flex items-center">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md z-50">
          {toastMessage}
        </div>
      )}

      {/* Add New Book Form */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/seller/view-feedback">
            <Button>View Feedback</Button>
          </Link>
        </div>
        <h2 className="text-2xl font-semibold mb-4">Add New Book</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input type="text" name="title" value={newBook.title} onChange={handleInputChange} placeholder="Title" required />
          <Input type="text" name="author" value={newBook.author} onChange={handleInputChange} placeholder="Author" required />
          <Input type="number" name="price" value={newBook.price} onChange={handleInputChange} placeholder="Price" required />
          <Input type="number" name="stock" value={newBook.stock} onChange={handleInputChange} placeholder="Stock" />
          <Input type="text" name="description" value={newBook.description} onChange={handleInputChange} placeholder="Description" />
          <Input type="text" name="imgUrl" value={newBook.imgUrl} onChange={handleInputChange} placeholder="Image URL" />
          <select name="stockStatus" value={newBook.stockStatus} onChange={handleInputChange}>
            <option value="in stock">In Stock</option>
            <option value="out of stock">Out of Stock</option>
          </select>
        </div>
        <Button className="mt-4" onClick={handleAddBook}>Add Book</Button>
      </section>

      {/* Books List */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">My Books</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Title</th>
              <th className="text-left">Stock</th>
              <th className="text-left">Status</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>
                  <Input
                    type="number"
                    value={book.stock}
                    onChange={(e) => handleUpdateBook(book.id, Number(e.target.value), book.stockStatus)}
                  />
                </td>
                <td>
                  <select
                    value={book.stockStatus}
                    onChange={(e) => handleUpdateBook(book.id, book.stock, e.target.value)}
                  >
                    <option value="in stock">In Stock</option>
                    <option value="out of stock">Out of Stock</option>
                  </select>
                </td>
                <td>
                  <Button onClick={() => handleUpdateBook(book.id, book.stock, book.stockStatus)}>Save</Button>
                  <Button 
                    className="ml-2" 
                    variant="destructive"
                    onClick={() => setBookPending(book.id)}
                  >
                    Remove Book
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Orders Tracking */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Manage Orders</h2>
        {orders.length === 0 ? (
          <p>No orders placed.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Title</th>
                <th className="text-left">Shipping Status</th>
                <th className="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.title}</td>
                  <td>{order.shipStatus}</td>
                  <td>
                    <Button onClick={() => updateShipStatus(order.id, 'shipped')}>Set Shipped</Button>
                    <Button onClick={() => updateReturnStatus(order.id)} variant="outline">Set Returned</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
