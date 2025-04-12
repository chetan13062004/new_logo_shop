'use client'
import useBrowsingHistory from '@/hooks/use-browsing-history'
import React, { useEffect, useState } from 'react'
import ProductSlider from './product/product-slider'
import { Separator } from '../ui/separator'
import { cn } from '@/lib/utils'

export default function BrowsingHistoryList({
  className,
}: {
  className?: string
}) {
  const { products } = useBrowsingHistory()
  const [hasProducts, setHasProducts] = useState(false)
  
  useEffect(() => {
    setHasProducts(products.length > 0)
  }, [products])

  if (!hasProducts) return null;

  return (
    <div className='bg-background'>
      <Separator className={cn('mb-4', className)} />
      <ProductList
        title={"Related to items that you've viewed"}
        type='related'
      />
      <Separator className='mb-4' />
      <ProductList
        title={'Your browsing history'}
        hideDetails
        type='history'
      />
    </div>
  )
}

function ProductList({
  title,
  type = 'history',
  hideDetails = false,
  excludeId = '',
}: {
  title: string
  type: 'history' | 'related'
  excludeId?: string
  hideDetails?: boolean
}) {
  const { products } = useBrowsingHistory()
  const [data, setData] = React.useState([])
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fix the API path from /api/products/browsing-history to /api/product/browsing-history
        const res = await fetch(
          `/api/product/browsing-history?type=${type}&excludeId=${excludeId}&categories=${products
            .map((product) => product.category)
            .join(',')}&ids=${products.map((product) => product.id).join(',')}`
        )
        const data = await res.json()
        setData(data)
      } catch (error) {
        console.error('Error fetching browsing history products:', error)
        setData([])
      }
    }
    
    if (products.length > 0) {
      fetchProducts()
    }
  }, [excludeId, products, type])

  return (
    data.length > 0 && (
      <ProductSlider title={title} products={data} hideDetails={hideDetails} />
    )
  )
}