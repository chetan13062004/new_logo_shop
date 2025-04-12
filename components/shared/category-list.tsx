'use client'
import React, { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import Link from 'next/link'
import Image from 'next/image'

// Sample categories for demonstration
const SAMPLE_CATEGORIES = [
  { name: 'Running Shoes', image: '/images/categories/running.jpg' },
  { name: 'Casual Shoes', image: '/images/categories/casual.jpg' },
  { name: 'Formal Shoes', image: '/images/categories/formal.jpg' },
  { name: 'Athletic Shoes', image: '/images/categories/athletic.jpg' },
  { name: 'Boots', image: '/images/categories/boots.jpg' },
  { name: 'Sandals', image: '/images/categories/sandals.jpg' },
]

export default function CategoryList() {
  const [categories] = useState(SAMPLE_CATEGORIES)
  const [loading] = useState(false)

  // Uncomment this if you want to fetch categories from an API
  /*
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/categories')
        const data = await res.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCategories()
  }, [])
  */

  if (loading) {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category, index) => (
          <Link key={index} href={`/search?category=${category.name}`}>
            <Card className="overflow-hidden h-40 transition-transform hover:scale-105">
              <CardContent className="p-0 h-full relative">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-3">
                  <h3 className="text-white font-medium">{category.name}</h3>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}