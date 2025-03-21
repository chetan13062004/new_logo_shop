'use client'

import * as React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import ProductCard from './product-card'
import { IProduct } from '@/lib/db/models/product.model'

export default function ProductSlider({
  title,
  products,
  hideDetails = false,
}: {
  title?: string
  products: IProduct[]
  hideDetails?: boolean
}) {
  // console.log('Rendering ProductSlider Component') // Check if the component is rendering
  // console.log('Received products:', products) // Check if products are coming correctly

  return (
    <div className='w-full bg-background'>
      {title && <h2 className='h2-bold mb-5'>{title}</h2>}

      <Carousel
        opts={{
          align: 'start',
        }}
        className='w-full'
      >
        <CarouselContent>
          {products.length > 0 ? (
            products.map((product, index) => {
              console.log('Rendering product:', product) // Check each product being rendered

              return (
                <CarouselItem
                  key={product.slug || index} // Use index as fallback if slug is undefined
                  className={
                    hideDetails
                      ? 'md:basis-1/4 lg:basis-1/6'
                      : 'md:basis-1/3 lg:basis-1/5'
                  }
                >
                  <ProductCard
                    hideDetails={hideDetails}
                    hideAddToCart
                    hideBorder
                    product={product}
                  />
                </CarouselItem>
              )
            })
          ) : (
            <p className="text-center text-gray-500">No products available</p> // Show message if no products
          )}
        </CarouselContent>
        <CarouselPrevious className='left-0' />
        <CarouselNext className='right-0' />
      </Carousel>
    </div>
  )
}
