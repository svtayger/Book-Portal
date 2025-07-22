'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  imgUrl: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const queryTerm = searchParams.get('q') || '';
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (queryTerm) {
      fetchBooks(queryTerm);
    } else {
      setLoading(false);
    }
  }, [queryTerm]);

  const fetchBooks = async (searchQuery: string) => {
    setLoading(true);
    try {
      const booksRef = collection(db, 'bookDetails');
      const querySnapshot = await getDocs(booksRef);
  
      const lowerCaseQuery = searchQuery.toLowerCase();
  
      const booksData = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Book, 'id'>),
        }))
        .filter(book => 
          book.title.toLowerCase().includes(lowerCaseQuery) ||
          book.author.toLowerCase().includes(lowerCaseQuery)
        );
  
      setBooks(booksData);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results for "{queryTerm}"</h1>
      {loading ? (
        <p>Loading books...</p>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map(book => (
            <div key={book.id} className="border rounded-lg overflow-hidden shadow-lg">
              <Image
                src={book.imgUrl}
                alt={book.title}
                width={200}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                <p className="text-lg font-bold mb-4">${book.price.toFixed(2)}</p>
                <div className="flex justify-between">
                  <Link href={`/book/${book.id}`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No books found. Please try again.</p>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}