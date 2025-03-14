'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { db, auth } from '@/config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function ComplaintPage() {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [customer, setCustomer] = useState<string | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Listen for authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCustomer(user.displayName || user.email || 'Unknown User');
      } else {
        setCustomer(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject || !description) {
      toast({
        title: "Error",
        description: "Please fill out all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const complaintsRef = collection(db, 'complaints');
      await addDoc(complaintsRef, {
        subject,
        description,
        customer: customer || 'Guest User', // Save user info or fallback
        date: serverTimestamp(),
      });

      toast({
        title: "Success",
        description: "Your complaint has been submitted.",
      });

      setSubject('');
      setDescription('');
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Submit a Complaint</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="subject" className="block mb-2">Subject</label>
          <Input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2">Description</label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Complaint"}
        </Button>
      </form>
    </div>
  );
}
