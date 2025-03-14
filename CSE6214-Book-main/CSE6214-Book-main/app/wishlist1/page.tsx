'use client';

import { useEffect, useState } from 'react';
import { db } from '@/config/firebase';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getAuth } from 'firebase/auth'; // Firebase Authentication to check if user is logged in
import Image from 'next/image';

export default function WishlistPage() {
  const [wishlistBooks, setWishlistBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if the user is logged in
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setIsLoggedIn(true);
      fetchWishlistBooks(); // Fetch wishlist books only if logged in
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleRemoveFromWishlist = async (bookId: string) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user) {
        toast({ title: "Error", description: "You must be logged in to remove items from wishlist." });
        return;
      }
  
      const bookRef = doc(db, 'bookDetails', bookId);
      await updateDoc(bookRef, { wishlist: "0" }); // Update Firestore wishlist field
  
      setWishlistBooks(wishlistBooks.filter((book) => book.id !== bookId)); // Remove from UI
  
      toast({ title: "Removed", description: "Book removed from wishlist." });
    } catch (error) {
      console.error('Error removing book from wishlist:', error);
      toast({ title: "Error", description: "Failed to remove book from wishlist." });
    }
  };

  const handleAddToCart = async (bookId: string) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user) {
        toast({ title: "Error", description: "You must be logged in to add items to cart." });
        return;
      }
  
      const bookRef = doc(db, 'bookDetails', bookId);
      await updateDoc(bookRef, { cart: "1" }); // Update Firestore cart field
  
      toast({ title: "Added to Cart", description: "Book added to your cart." });
    } catch (error) {
      console.error('Error adding book to cart:', error);
      toast({ title: "Error", description: "Failed to add book to cart." });
    }
  };

  const fetchWishlistBooks = async () => {
    try {
      const booksQuery = query(
        collection(db, 'bookDetails'),
        where('wishlist', '==', '1') // Fetch only books where wishlist field is "1"
      );
      const querySnapshot = await getDocs(booksQuery);
      const wishlistBooksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWishlistBooks(wishlistBooksData);
    } catch (error) {
      console.error('Error fetching wishlist books:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading your wishlist...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Your Wishlist</h1>

      {!isLoggedIn ? (
        <p className="text-lg text-gray-500">You need to be logged in to see your wishlist.</p>
      ) : (
        <>
          {wishlistBooks.length === 0 ? (
            <p className="text-lg text-gray-500">No books in your wishlist.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistBooks.map((book) => (
                <div key={book.id} className="border rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src={book.imgUrl}
                    alt={book.title}
                    width={180}
                    height={270}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-md font-semibold mb-2">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                    <p className="text-lg font-bold mb-4">${book.price.toFixed(2)}</p>
                    <div className="flex justify-between">
                    <Button variant="outline" onClick={() => handleRemoveFromWishlist(book.id)}>
                      Remove from Wishlist
                    </Button>
                    <Button onClick={() => handleAddToCart(book.id)}>
                      Add to Cart
                    </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
