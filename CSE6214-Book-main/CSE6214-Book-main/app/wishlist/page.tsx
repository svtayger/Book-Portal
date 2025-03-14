'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(storedWishlist);
  }, []);

  const handleRemoveFromWishlist = (id: string) => {
    const updatedWishlist = wishlist.filter((book) => book.id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((book) => (
            <Card key={book.id} className="p-4">
              <CardContent>
                <img src={book.imgUrl} alt={book.title} className="w-full h-48 object-cover mb-4 rounded" />
                <h2 className="text-lg font-semibold">{book.title}</h2>
                <p className="text-gray-600">by {book.author}</p>
                <p className="text-gray-800 font-bold">${book.price}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/book/${book.id}`}>
                  <Button>View Details</Button>
                </Link>
                <Button variant="outline" onClick={() => handleRemoveFromWishlist(book.id)}>
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p>Your wishlist is empty.</p>
      )}
    </div>
  );
}
