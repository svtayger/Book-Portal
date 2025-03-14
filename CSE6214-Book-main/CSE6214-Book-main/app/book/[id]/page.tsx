'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';  // Import Firebase auth

export default function BookDetailsPage({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track if the user is logged in
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const bookRef = doc(db, 'bookDetails', params.id);
        const bookDoc = await getDoc(bookRef);
        if (bookDoc.exists()) {
          const bookData = { id: params.id, ...bookDoc.data() };
          setBook(bookData);

          // Check if the book is already in the wishlist for guests
          const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
          setIsInWishlist(wishlist.some((item: any) => item.id === params.id));
        } else {
          console.error('No such book!');
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        setLoading(false);
      }
    };

    // Check if the user is logged in (Firebase Authentication)
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setIsLoggedIn(true);  // User is logged in
    }

    fetchBookDetails();  // Fetch book details
  }, [params.id]);

  // Handle guest wishlist
  const handleToggleWishlistGuest = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

    if (isInWishlist) {
      // Remove book from wishlist (guest)
      const updatedWishlist = wishlist.filter((item: any) => item.id !== book.id);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      toast({ title: 'Removed', description: 'Book removed from wishlist.' });
    } else {
      // Add book to wishlist (guest)
      wishlist.push(book);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      toast({ title: 'Added', description: 'Book added to wishlist.' });
    }

    setIsInWishlist(!isInWishlist);
  };

  // Handle user wishlist
  const handleToggleWishlistUser = async () => {
    if (!isLoggedIn) {
      toast({ title: 'Error', description: 'You need to be logged in to add to wishlist.' });
      return;
    }

    try {
      const bookRef = doc(db, 'bookDetails', book.id);
      await updateDoc(bookRef, { wishlist: '1' });  // Change wishlist field to "1" for logged-in user
      toast({ title: 'Added', description: 'Book added to wishlist.' });
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast({ title: 'Error', description: 'Failed to add book to wishlist.' });
    }
  };

  // Handle Add to Cart for logged-in users
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast({ title: 'Error', description: 'You need to be logged in to add to cart.' });
      return;
    }

    try {
      const bookRef = doc(db, 'bookDetails', book.id);
      await updateDoc(bookRef, {
        cart: '1', // Mark as added to cart
      });
      toast({ title: 'Added to Cart', description: 'Book added to your cart.' });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({ title: 'Error', description: 'Failed to add book to cart.' });
    }
  };

  if (loading) return <p>Loading book details...</p>;
  if (!book) return <p>Book not found.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Image
            src={book.imgUrl}
            alt={book.title}
            width={400}
            height={600}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
          <p className="text-2xl font-bold mb-4">${book.price.toFixed(2)}</p>
          <p className="mb-4">{book.description}</p>
          <div className="mb-4"><strong>Seller:</strong> {book.seller}</div>
          <div className="flex space-x-4">
            {/* Wishlist Button for Guests */}
            <Button variant="outline" onClick={handleToggleWishlistGuest}>
              {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist (Guest)'}
            </Button>

            {/* Wishlist Button for Logged-In Users */}
            <Button
              variant="outline"
              onClick={handleToggleWishlistUser}
              disabled={!isLoggedIn}  // Disable the button if not logged in
            >
              {isLoggedIn ? 'Add to Wishlist (User)' : 'Login to Add to Wishlist'}
            </Button>

            {/* Add to Cart Button for Logged-In Users */}
            <Button
              onClick={handleAddToCart}
              disabled={!isLoggedIn}  // Disable the button if not logged in
            >
              {isLoggedIn ? 'Add to Cart' : 'Login to Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
