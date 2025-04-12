'use client'
import React, { useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'

// Sample slides for demonstration
const SAMPLE_SLIDES = [
  {
    id: 1,
    title: 'New Arrivals',
    description: 'Check out our latest collection of premium shoes',
    image: '/images/hero/slide1.jpg',
    buttonText: 'Shop Now',
    buttonLink: '/search?tag=new-arrival',
  },
  {
    id: 2,
    title: 'Summer Sale',
    description: 'Up to 50% off on selected items',
    image: '/images/hero/slide2.jpg',
    buttonText: 'View Deals',
    buttonLink: '/search?tag=sale',
  },
  {
    id: 3,
    title: 'Limited Edition',
    description: 'Exclusive designs available for a limited time',
    image: '/images/hero/slide3.jpg',
    buttonText: 'Explore',
    buttonLink: '/search?tag=limited-edition',
  },
]

export default function HeroSlider() {
  const [slides] = useState(SAMPLE_SLIDES)
  const [loading] = useState(false)

  if (loading) {
    return (
      <div className="w-full">
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    )
  }

  return (
    <Carousel
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div className="relative h-[400px] w-full overflow-hidden">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center p-6">
                <h2 className="text-white text-4xl font-bold mb-4">
                  {slide.title}
                </h2>
                <p className="text-white text-xl mb-6">{slide.description}</p>
                <Button asChild>
                  <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                </Button>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  )
}