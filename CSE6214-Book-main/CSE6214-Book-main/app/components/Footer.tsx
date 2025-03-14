import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm text-teal-100">
            Thriftbooks is your go-to platform for buying and selling used books online.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/browse" className="hover:text-teal-200 transition-colors">All Books</Link></li>
              <li><Link href="/seller-register" className="hover:text-teal-200 transition-colors">Sell Books</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-teal-400 text-center text-sm text-teal-100">
          <p>&copy; 2024 Thriftbooks. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

