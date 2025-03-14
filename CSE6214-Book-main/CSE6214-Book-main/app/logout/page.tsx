'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { getAuth, signOut } from 'firebase/auth'

export default function LogoutPage() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const auth = getAuth()

    signOut(auth)
      .then(() => {
        console.log('User successfully logged out')

        // Show a toast notification
        toast({
          title: 'Logged Out',
          description: 'You have been successfully logged out.',
        })

        // Redirect to home page after a short delay
        setTimeout(() => {
          router.push('/')
        }, 2000)
      })
      .catch((error) => {
        console.error('Logout failed:', error)

        toast({
          title: 'Logout Failed',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive',
        })
      })
  }, [router, toast])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-teal-700">Logging Out</h1>
      <p className="text-teal-600">Please wait while we log you out...</p>
    </div>
  )
}
