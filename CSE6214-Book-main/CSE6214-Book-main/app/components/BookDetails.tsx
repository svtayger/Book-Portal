import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface BookDetailsProps {
  id: string
  title: string
  author: string
  description: string
  price: number
  imageUrl: string
  condition: string
  seller: string
}

export default function BookDetails({
  id,
  title,
  author,
  description,
  price,
  imageUrl,
  condition,
  seller,
}: BookDetailsProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Image
            src={imageUrl}
            alt={title}
            width={400}
            height={600}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-gray-600 mb-4">by {author}</p>
          <p className="text-2xl font-bold mb-4">${price.toFixed(2)}</p>
          <p className="mb-4">{description}</p>
          <div className="mb-4">
            <strong>Condition:</strong> {condition}
          </div>
          <div className="mb-4">
            <strong>Seller:</strong> {seller}
          </div>
          <div className="flex space-x-4">
            <Button size="lg">Add to Cart</Button>
            <Button size="lg" variant="outline">Add to Wishlist</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

