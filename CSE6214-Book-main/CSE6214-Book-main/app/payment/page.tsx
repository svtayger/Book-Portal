'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function PaymentProcessingPage() {
  const [scanned, setScanned] = useState(false)
  const router = useRouter()

  const handleScan = () => {
    setScanned(true)
  }

  const handleDone = () => {
    router.push('/UserDashboard')
  }

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-8 text-teal-700">Scan to Pay</h1>
      {!scanned ? (
        <div>
          <Image 
            src="/fake-qr-code.jpg" 
            alt="Fake QR Code" 
            width={200} 
            height={200} 
            className="mx-auto"
          />
          <p className="mt-4 text-gray-600">Scan the QR code to proceed with the payment.</p>
          <Button onClick={handleScan} className="mt-6 bg-teal-500 hover:bg-teal-600">I've Scanned</Button>
        </div>
      ) : (
        <div>
          <p className="text-lg text-teal-700">Payment is being processed...</p>
          <Button onClick={handleDone} className="mt-6 bg-teal-500 hover:bg-teal-600">Done</Button>
        </div>
      )}
    </div>
  )
}
