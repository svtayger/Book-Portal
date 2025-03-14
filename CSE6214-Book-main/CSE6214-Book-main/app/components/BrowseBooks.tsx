'use client';

import { useEffect, useState } from 'react';
import { db } from '@/config/firebase';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import BookList from './BookList';

export default function BrowseBooks() {
  const [books, setBooks] = useState([]); // State for Firestore data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksRef = collection(db, 'bookDetails');
        const q = query(booksRef, where('status', '==', 'approved')); // Only fetch approved books
        const querySnapshot = await getDocs(q);

        const booksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBooks(booksData);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
      setLoading(false);
    };

    fetchBooks();
  }, []);

  // 🔹 Handle Add to Cart
  const handleAddToCart = async (bookId: string) => {
    try {
      const bookRef = doc(db, 'bookDetails', bookId);
      await updateDoc(bookRef, { cart: '1' });

      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === bookId ? { ...book, cart: '1' } : book
        )
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return <p>Loading books...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Browse Books</h1>
      {books.length > 0 ? (
        <BookList books={books} onAddToCart={handleAddToCart} />
      ) : (
        <p>No books available.</p>
      )}
    </div>
  );
}
