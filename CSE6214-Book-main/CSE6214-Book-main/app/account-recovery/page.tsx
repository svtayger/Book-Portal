'use client';

import { useState } from 'react';
import { sendPasswordResetEmail, confirmPasswordReset } from 'firebase/auth'; // Firebase functions for recovery
import { auth } from '@/config/firebase'; // Firebase configuration
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

export default function AccountRecoveryPage() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'newPassword'>('email');
  const [oobCode, setOobCode] = useState(''); // Out-of-band code from recovery email
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }
  
    try {
      // Send recovery email via Firebase
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Recovery Email Sent',
        description: 'Please check your email for the recovery link.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  

  const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Reset the password using the out-of-band code
      await confirmPasswordReset(auth, oobCode, newPassword);
      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully updated. You can now log in.',
      });
      // Redirect to login page (optional)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-teal-700">Account Recovery</h1>
      {step === 'email' && (
        <form onSubmit={handleSubmitEmail} className="max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-teal-700">
              Email
            </label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600">
            Send Recovery Email
          </Button>
        </form>
      )}
      {step === 'newPassword' && (
        <form onSubmit={handleSubmitNewPassword} className="max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="oobCode" className="block mb-2 text-teal-700">
              Recovery Code (from email link)
            </label>
            <Input
              type="text"
              id="oobCode"
              value={oobCode}
              onChange={(e) => setOobCode(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block mb-2 text-teal-700">
              New Password
            </label>
            <Input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2 text-teal-700">
              Confirm New Password
            </label>
            <Input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600">
            Update Password
          </Button>
        </form>
      )}
    </div>
  );
}
