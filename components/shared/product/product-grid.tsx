'use client'

import { IProduct } from '@/lib/db/models/product.model'
import ProductCard from './product-card'

export default function ProductGrid({
  products,
  hideDetails = false,
}: {
  products: IProduct[]
  hideDetails?: boolean
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard 
            key={product._id} 
            product={product} 
            hideDetails={hideDetails}
          />
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500 py-8">
          No products available
        </p>
      )}
    </div>
  )
}