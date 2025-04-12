import { auth } from '@/auth'
import AddToCart from '@/components/shared/product/add-to-cart'
import { Card, CardContent } from '@/components/ui/card'
import {
  getProductBySlug,
  getRelatedProductsByCategory,
} from '@/lib/actions/product.actions'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Truck, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

import ReviewList from './review-list'
import { generateId, round2 } from '@/lib/utils'
import SelectVariant from '@/components/shared/product/select-variant'
import ProductPrice from '@/components/shared/product/product-price'
import ProductGallery from '@/components/shared/product/product-gallery'
import AddToBrowsingHistory from '@/components/shared/product/add-to-browsing-history'
import { Separator } from '@/components/ui/separator'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import RatingSummary from '@/components/shared/product/rating-summary'
import ProductSlider from '@/components/shared/product/product-slider'
import Rating from '@/components/shared/product/rating'

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const product = await getProductBySlug(params.slug)
  if (!product) {
    return { title: 'Product not found' }
  }
  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductDetails(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page: string; color: string; size: string }>
}) {
  const searchParams = await props.searchParams

  const { page, color, size } = searchParams

  const params = await props.params

  const { slug } = params

  const session = await auth()

  const product = await getProductBySlug(slug)

  const relatedProducts = await getRelatedProductsByCategory({
    category: product.category,
    productId: product._id,
    page: Number(page || '1'),
  })

  return (
    <div className="container mx-auto px-4 py-6">
      <AddToBrowsingHistory id={product._id} category={product.category} />
      
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/search" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          Home / {product.category} / {product.name}
        </Link>
      </div>
      
      <section className="mb-12">
        <div className='grid grid-cols-1 md:grid-cols-5 gap-8'>
          <div className='col-span-2'>
            <ProductGallery images={product.images} />
          </div>

          <div className='flex w-full flex-col gap-4 md:p-5 col-span-2'>
            <div className='flex flex-col gap-3'>
              <Badge variant="outline" className="w-fit">
                {product.brand} {product.category}
              </Badge>
              
              <h1 className='text-3xl font-bold tracking-tight'>{product.name}</h1>

              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">{product.avgRating.toFixed(1)}</span>
                <Rating rating={product.avgRating}/>
                <span className="text-sm text-muted-foreground">({product.numReviews} ratings)</span>
                <Link href="#reviews" className="text-sm text-primary ml-2">
                  See all reviews
                </Link>
              </div>
              
              <Separator className="my-2" />
              
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                <div className='flex gap-3'>
                  <ProductPrice
                    price={product.price}
                    listPrice={product.listPrice}
                    isDeal={product.tags.includes('todays-deal')}
                    forListing={false}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <SelectVariant
                product={product}
                size={size || product.sizes[0]}
                color={color || product.colors[0]}
              />
            </div>
            
            <Separator className='my-4' />
            
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="py-4">
                <p className='text-base leading-relaxed'>
                  {product.description}
                </p>
              </TabsContent>
              
              <TabsContent value="features" className="py-4">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Premium quality materials</li>
                  <li>Cushioned insole for comfort</li>
                  <li>Durable rubber outsole</li>
                  <li>Breathable mesh upper</li>
                  <li>Lightweight design</li>
                </ul>
              </TabsContent>
              
              <TabsContent value="specifications" className="py-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Brand</div>
                  <div>{product.brand}</div>
                  <div className="font-medium">Category</div>
                  <div>{product.category}</div>
                  <div className="font-medium">Material</div>
                  <div>Synthetic, Mesh</div>
                  <div className="font-medium">Closure</div>
                  <div>Lace-up</div>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Shipping info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-sm">Free shipping over ₹1000</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm">Authentic products</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-sm">Secure payment</span>
              </div>
            </div>
          </div>
          
          <div>
            <Card className="sticky top-24">
              <CardContent className='p-6 flex flex-col gap-4'>
                <h3 className="font-semibold text-lg">Order Summary</h3>
                
                <ProductPrice price={product.price} />

                {product.countInStock > 0 && product.countInStock <= 3 && (
                  <div className='text-destructive font-medium text-sm'>
                    Only {product.countInStock} left in stock - order soon
                  </div>
                )}
                
                {product.countInStock !== 0 ? (
                  <div className='text-green-700 font-medium flex items-center gap-2'>
                    <CheckCircle className="h-4 w-4" />
                    In Stock
                  </div>
                ) : (
                  <div className='text-destructive font-medium'>
                    Out of Stock
                  </div>
                )}

                {product.countInStock !== 0 && (
                  <div className='flex justify-center items-center mt-2'>
                    <AddToCart
                      item={{
                        clientId: generateId(),
                        product: product._id,
                        countInStock: product.countInStock,
                        name: product.name,
                        slug: product.slug,
                        category: product.category,
                        price: round2(product.price),
                        quantity: 1,
                        image: product.images[0],
                        size: size || product.sizes[0],
                        color: color || product.colors[0],
                      }}
                    />
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground mt-4">
                  <p>Delivery: 3-5 business days</p>
                  <p>Returns: 30 days easy returns</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <section className='mt-16' id="reviews">
        <div className="flex items-center justify-between mb-6">
          <h2 className='text-2xl font-bold'>
            Customer Reviews
          </h2>
          <RatingSummary
            avgRating={product.avgRating}
            numReviews={product.numReviews}
            asPopover
            ratingDistribution={product.ratingDistribution}
          />
        </div>
        <ReviewList product={product} userId={session?.user.id} />
      </section>
      
      <Separator className="my-16" />
      
      <section>
        <ProductSlider
          products={relatedProducts.data}
          title={`Best Sellers in ${product.category}`}
        />
      </section>
      
      <section>
        <BrowsingHistoryList className='mt-16' />
      </section>
    </div>
  )
}