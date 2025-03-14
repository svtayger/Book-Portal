'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function Home() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Thriftbooks</h1>
        <p className="text-xl mb-8">Discover, buy, and sell secondhand books with ease.</p>
        <form onSubmit={handleSearch} className="flex justify-center">
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
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-blue-100 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Buy Books</h2>
          <p className="mb-4">Find your next favorite book from our vast collection of secondhand titles.</p>
          <Link href="/browse">
            <Button>Start Browsing</Button>
          </Link>
        </div>
        <div className="bg-green-100 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Sell Books</h2>
          <p className="mb-4">Turn your old books into cash by selling them on our platform.</p>
          <Link href="/seller-register">
            <Button>Start Selling</Button>
          </Link>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Why Choose Thriftbooks?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
            <p>Browse through thousands of titles across various genres.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Great Prices</h3>
            <p>Find amazing deals on secondhand books.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
            <p>Our platform makes buying and selling books a breeze.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
