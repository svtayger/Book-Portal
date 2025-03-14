'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase'; // Ensure your Firebase config file is correctly imported
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Define the Complaint type
interface Complaint {
  id: string;
  customer: string;
  description: string;
  date: any; // Firestore Timestamp type (use Date if you convert it)
}

export default function ViewComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]); // Use the Complaint type for state
  const [filter, setFilter] = useState(''); // State for search filter

  // Fetch complaints from Firestore
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'complaints')); // Fetch complaints collection
        const complaintsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Complaint[]; // Cast the data to Complaint type
        console.log('Fetched Complaints:', complaintsData); // Debugging
        setComplaints(complaintsData); // Update state
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchComplaints();
  }, []);

  // Filter complaints based on user input
  const filteredComplaints = complaints.filter((item) =>
    item.customer?.toLowerCase().includes(filter.toLowerCase()) ||
    item.description?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-teal-700">View Customer Complaints</h1>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search complaints..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.customer || 'Anonymous'}</TableCell>
                <TableCell>{item.description || 'No description provided'}</TableCell>
                <TableCell>
                  {item.date?.toDate ? item.date.toDate().toLocaleString() : 'N/A'}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No complaints found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
