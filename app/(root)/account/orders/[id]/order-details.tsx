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
      } catch (error) {
        console.error('Error fetching order:', error)
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
  }, [id, toast, router])

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
    } catch (error) {
      console.error('Error delivering order:', error)
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
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-16 w-16" />
                      <div className="flex-1 ml-4">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl">Order not found</h2>
        <Link href="/account/orders" className="text-primary hover:underline">
          Back to orders
        </Link>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 md:gap-5">
      <div className="overflow-x-auto md:col-span-2 space-y-4">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <p>
              {order.shippingAddress.fullName} {order.shippingAddress.phone}
            </p>
            <p>
              {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.province}, {order.shippingAddress.postalCode},{' '}
              {order.shippingAddress.country}{' '}
            </p>
            <div className="mt-4">
              {order.isDelivered ? (
                <div className="bg-green-100 p-2 rounded-md text-green-700">
                  Delivered at {formatDateTime(new Date(order.deliveredAt!)).dateTime}
                </div>
              ) : (
                <div>
                  <div className="bg-red-100 p-2 rounded-md text-red-700">
                    Not delivered
                  </div>
                  <div className="mt-2">
                    Expected delivery at{' '}
                    {formatDateTime(new Date(order.expectedDeliveryDate)).dateTime}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <p>{order.paymentMethod}</p>
            <div className="mt-4">
              {order.isPaid ? (
                <div className="bg-green-100 p-2 rounded-md text-green-700">
                  Paid at {formatDateTime(new Date(order.paidAt!)).dateTime}
                </div>
              ) : (
                <div className="bg-red-100 p-2 rounded-md text-red-700">
                  Not paid
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="divide-y">
              {order.orderItems.map((item) => (
                <div key={`${item.slug}-${item.color}-${item.size}`} className="py-4 flex">
                  <div className="flex-shrink-0 mr-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      {item.name}
                    </Link>
                    <div className="text-sm text-gray-500">
                      {item.color} / {item.size}
                    </div>
                    <div className="mt-1">
                      {item.quantity} × {formatPrice(item.price)} ={' '}
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>{formatPrice(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{formatPrice(order.shippingPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formatPrice(order.taxPrice)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
            </div>

            {isAdmin && !order.isDelivered && (
              <Button
                className="w-full mt-4"
                onClick={handleDeliverOrder}
                disabled={isDelivering}
              >
                {isDelivering ? 'Processing...' : 'Mark as Delivered'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}