'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ShoppingCart, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // This should be managed by your auth system
  const [userRole, setUserRole] = useState<'guest' | 'buyer' | 'seller' | 'admin'>('guest') // This should be managed by your auth system

  const handleLogout = () => {
    // Implement logout logic here
    setIsLoggedIn(false)
    setUserRole('guest')
  }

  const navItems = ['Browse', 'Account']
  if (isLoggedIn && (userRole === 'seller' || userRole === 'admin')) {
    navItems.push('Seller')
  }
  if (isLoggedIn && userRole === 'admin') {
    navItems.push('Admin')
  }

  return (
    <header className="bg-gradient-to-r from-teal-400 to-teal-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tight hover:text-teal-100 transition-colors">
          Thriftbooks
        </Link>
        <nav className="hidden md:flex space-x-1">
          {navItems.map((item) => (
            <DropdownMenu key={item}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hover:bg-teal-600 hover:text-white focus:bg-teal-600 focus:text-white transition-colors">
                  {item} <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-teal-200 shadow-xl">
                {item === 'Browse' && (
                  <>
                    <DropdownMenuItem className="hover:bg-teal-50 focus:bg-teal-50 text-teal-800">
                      <Link href="/browse">All Books</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-teal-50 focus:bg-teal-50 text-teal-800">
                      <Link href="/wishlist">Wishlist (Guest)</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-teal-50 focus:bg-teal-50 text-teal-800">
                      <Link href="/wishlist1">Wishlist (User)</Link>
                    </DropdownMenuItem>
                  </>
                )}
                {item === 'Account' && (
                  <>
                    {!isLoggedIn ? (
                      <>
                        <DropdownMenuItem className="hover:bg-teal-50 focus:bg-teal-50 text-teal-800">
                          <Link href="/login">Login</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-teal-50 focus:bg-teal-50 text-teal-800">
                          <Link href="/register">Register</Link>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem className="hover:bg-teal-50 focus:bg-teal-50 text-teal-800">
                          <Link href="/profile">My Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-teal-50 focus:bg-teal-50 text-teal-800">
                          <Link href="/orders">My Orders</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-teal-50 focus:bg-teal-50 text-teal-800">
                          <Link href="/wishlist">Wishlist</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-teal-50 focus:bg-teal-50 text-teal-800">
                          <Link href="/complaint">Submit Complaint</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="hover:bg-teal-50 focus:bg-teal-50 text-teal-800">
                          Logout
                        </DropdownMenuItem>
                      </>
                    )}
                  </>
                )}
                {item === 'Seller' && (
                  <>
                    <DropdownMenuItem className="hover:bg-teal-50 focus:bg-teal-50 text-teal-800">
                      <Link href="/seller-dashboard">Seller Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-teal-50 focus:bg-teal-50 text-teal-800">
                      <Link href="/add-book">Add New Book</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-teal-50 focus:bg-teal-50 text-teal-800">
                      <Link href="/manage-inventory">Manage Inventory</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-teal-50 focus:bg-teal-50 text-teal-800">
                      <Link href="/seller-orders">Manage Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-teal-50 focus:bg-teal-50 text-teal-800">
                      <Link href="/seller-feedback">View Feedback</Link>
                    </DropdownMenuItem>
                  </>
                )}
                {item === 'Admin' && (
                  <>
                    <DropdownMenuItem className="hover:bg-teal-50 focus:bg-teal-50 text-teal-800">
                      <Link href="/admin-dashboard">Admin Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-teal-50 focus:bg-teal-50 text-teal-800">
                      <Link href="/manage-users">Manage Users</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-teal-50 focus:bg-teal-50 text-teal-800">
                      <Link href="/approve-sellers">Approve Sellers</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-teal-50 focus:bg-teal-50 text-teal-800">
                      <Link href="/verify-products">Verify Products</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-teal-50 focus:bg-teal-50 text-teal-800">
                      <Link href="/admin-feedback">Manage Feedback</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          {/* <Link href="/cart" className="hover:text-teal-200 transition-colors">
            <ShoppingCart className="h-6 w-6" />
          </Link> */}
          <button
            className="md:hidden text-white hover:text-teal-200 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-teal-500">
          <nav className="flex flex-col items-center py-4">
            {navItems.map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="py-2 px-4 w-full text-center hover:bg-teal-600 transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
