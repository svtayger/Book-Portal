'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { db, auth } from "@/config/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const authInstance = getAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Both email and password are required.");
      return;
    }

    try {
      await signInWithEmailAndPassword(authInstance, email, password);

      toast({
        title: "Login Successful",
        description: "Redirecting to your dashboard...",
      });

      const user = authInstance.currentUser;
      if (user) {
        const role = await getUserRole(user.uid, email);

        if (role === "admin") {
          router.push("/admin-dashboard");
        } else if (role === "seller") {
          router.push("/seller-dashboard");
        } else {
          router.push("/UserDashboard");
        }
      }
    } catch (error: any) {
      setError(error.message || "Failed to log in.");
    }
  };

  const getUserRole = async (uid: string, email: string) => {
    try {
      const sellersQuery = query(collection(db, "sellers"), where("email", "==", email));
      const sellersSnapshot = await getDocs(sellersQuery);

      if (!sellersSnapshot.empty) {
        const sellerData = sellersSnapshot.docs[0].data();
        if (sellerData.status === "Approved") {
          return "seller";
        }
      }

      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData?.role || "user";
      }

      return "user";
    } catch (error) {
      console.error("Error fetching user role:", error);
      return "user";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Login</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
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
        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
        <Button type="submit" className="w-full">Login</Button>
        <div className="mt-4 text-center">
          <Link href="/account-recovery" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
}
