'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function SellerRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !description) {
      setError("All fields are required.");
      return;
    }

    try {
      // Save seller data with "Pending" status
      await addDoc(collection(db, "users"), {
        email,
        name,
        role: "seller",
        description,
        status: "Pending", // status set as Pending
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Seller Application Submitted",
        description: "Your application is now pending approval.",
      });
      router.push("/");
    } catch (error: any) {
      console.error("Seller registration error:", error);
      setError(error.message || "Failed to register as seller.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Register as a Seller</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Name</label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">Password</label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
        <Button type="submit">Register as Seller</Button>
      </form>
    </div>
  );
}
