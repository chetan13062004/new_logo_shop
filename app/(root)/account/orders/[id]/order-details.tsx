'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { deliverOrder, getOrderById } from '@/lib/actions/order.actions'
import { formatDateTime } from '@/lib/utils'
import { formatCurrency as formatPrice } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Define types for order and order items
interface OrderItem {
  name: string;
  slug: string;
  image: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  expectedDeliveryDate: string;
  // Using underscore prefix to indicate intentionally unused property
  _createdAt: string;
}

export default function OrderDetails() {
  const { id } = useParams()
  const { toast } = useToast()
  const router = useRouter()
  const { data: session } = useSession()
  
  // Removed unused user variable
  
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDelivering, setIsDelivering] = useState(false)
  
  const isAdmin = session?.user?.role === 'admin'
  const isDelivered = order?.isDelivered

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true)
      try {
        const res = await getOrderById(id as string)
        if ('success' in res && res.success) {
          setOrder(res as unknown as Order)
        } else {
          toast({
            description: (res as unknown as { message: string }).message,
            variant: 'destructive',
          })
          router.push('/account/orders')
        }
      } catch (_error) {
        toast({
          description: 'Failed to fetch order details',
          variant: 'destructive',
        })
        router.push('/account/orders')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchOrder()
    }
  }, [id, router, toast])

  const handleDeliverOrder = async () => {
    setIsDelivering(true)
    try {
      const res = await deliverOrder(id as string)
      if (res.success) {
        toast({
          description: res.message,
        })
        setOrder({
          ...order!,
          isDelivered: true,
          deliveredAt: new Date().toISOString(),
        })
      } else {
        toast({
          description: res.message,
          variant: 'destructive',
        })
      }
    } catch (_err) {
      toast({
        description: 'Failed to deliver order',
        variant: 'destructive',
      })
    } finally {
      setIsDelivering(false)
    }
  }

  if (isLoading) {
    return (
      <div className='container py-10'>
        <Skeleton className='h-8 w-64 mb-6' />
        <div className='grid md:grid-cols-3 gap-6'>
          <div className='md:col-span-2 space-y-6'>
            <Skeleton className='h-64 w-full' />
            <Skeleton className='h-64 w-full' />
          </div>
          <div>
            <Skeleton className='h-64 w-full' />
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className='container py-10'>
        <p>Order not found</p>
      </div>
    )
  }

  return (
    <div className='container py-10'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Order Details</h1>
        <Button variant='outline' asChild>
          <Link href='/account/orders'>Back to Orders</Link>
        </Button>
      </div>

      <div className='grid md:grid-cols-3 gap-6'>
        <div className='md:col-span-2 space-y-6'>
          <Card>
            <CardContent className='p-6'>
              <h2 className='text-xl font-bold mb-4'>Shipping</h2>
              <div className='space-y-2'>
                <p>
                  <span className='font-semibold'>Name:</span>{' '}
                  {order.shippingAddress.fullName}
                </p>
                <p>
                  <span className='font-semibold'>Address:</span>{' '}
                  {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                  {order.shippingAddress.province},{' '}
                  {order.shippingAddress.postalCode},{' '}
                  {order.shippingAddress.country}
                </p>
                <p>
                  <span className='font-semibold'>Phone:</span>{' '}
                  {order.shippingAddress.phone}
                </p>
                <p>
                  <span className='font-semibold'>Status:</span>{' '}
                  {order.isDelivered ? (
                    <span className='text-green-600'>
                      Delivered on{' '}
                      {formatDateTime(new Date(order.deliveredAt!)).dateTime}
                    </span>
                  ) : (
                    <span className='text-red-600'>Not Delivered</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <h2 className='text-xl font-bold mb-4'>Payment</h2>
              <div className='space-y-2'>
                <p>
                  <span className='font-semibold'>Method:</span>{' '}
                  {order.paymentMethod}
                </p>
                <p>
                  <span className='font-semibold'>Status:</span>{' '}
                  {order.isPaid ? (
                    <span className='text-green-600'>
                      Paid on {formatDateTime(new Date(order.paidAt!)).dateTime}
                    </span>
                  ) : (
                    <span className='text-red-600'>Not Paid</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <h2 className='text-xl font-bold mb-4'>Order Items</h2>
              <div className='space-y-4'>
                {order.orderItems.map((item: OrderItem, index: number) => (
                  <div
                    key={index}
                    className='flex items-center gap-4 border-b last:border-b-0 pb-4 last:pb-0'
                  >
                    <div className='relative w-20 h-20'>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes='80px'
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <div className='flex-1'>
                      <Link
                        href={`/product/${item.slug}`}
                        className='font-semibold hover:text-primary'
                      >
                        {item.name}
                      </Link>
                      <p className='text-sm text-muted-foreground'>
                        {item.color}, {item.size}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='font-semibold'>
                        {formatPrice(item.price)} x {item.quantity} ={' '}
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {isAdmin && !isDelivered && (
            <div className='mt-4'>
              <Button 
                onClick={handleDeliverOrder} 
                disabled={isDelivering}
                className='w-full'
              >
                {isDelivering ? 'Processing...' : 'Mark as Delivered'}
              </Button>
            </div>
          )}
        </div>

        <div>
          <Card>
            <CardContent className='p-6'>
              <h2 className='text-xl font-bold mb-4'>Order Summary</h2>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span>Items:</span>
                  <span>{formatPrice(order.itemsPrice)}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Shipping:</span>
                  <span>
                    {order.shippingPrice === 0
                      ? 'Free'
                      : formatPrice(order.shippingPrice)}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Tax:</span>
                  <span>{formatPrice(order.taxPrice)}</span>
                </div>
                <div className='flex justify-between font-bold text-lg pt-2 border-t'>
                  <span>Total:</span>
                  <span>{formatPrice(order.totalPrice)}</span>
                </div>
              </div>

              <div className='mt-6 space-y-2'>
                <h3 className='font-semibold'>Expected Delivery</h3>
                <p className='text-green-600 font-medium'>
                  {formatDateTime(new Date(order.expectedDeliveryDate)).dateOnly}
                </p>
              </div>

              <div className='mt-6 space-y-2'>
                <h3 className='font-semibold'>Order ID</h3>
                <p className='text-sm break-all'>{order._id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}