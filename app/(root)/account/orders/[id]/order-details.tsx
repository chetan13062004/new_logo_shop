'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { deliverOrder } from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/db/models/order.model'
import { formatDateTime } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const formatPrice = (price?: number) => {
    if (price === undefined) return '--';
    return "Rs. " + price.toFixed(2);
  };
  
export default function OrderDetails({
  order,
  isAdmin = false,
}: {
  order: IOrder
  isAdmin?: boolean
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDelivering, setIsDelivering] = useState(false)

  const {
    _id,
    user,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    shippingAddress,
    paymentMethod,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    createdAt,
    expectedDeliveryDate,
  } = order

  const handleDeliverOrder = async () => {
    setIsDelivering(true)
    try {
      const res = await deliverOrder(_id)
      if (res.success) {
        toast({
          description: res.message,
        })
        router.refresh()
      } else {
        toast({
          description: res.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        description: 'An error occurred while updating the order.',
        variant: 'destructive',
      })
    } finally {
      setIsDelivering(false)
    }
  }

  return (
    <div className='max-w-6xl mx-auto px-4 sm:px-6'>
      <div className='grid md:grid-cols-4 gap-6'>
        <div className='md:col-span-3'>
          <div className='flex justify-between items-center'>
            <h1 className='text-2xl font-bold'>Order Details</h1>
            <div className='text-sm text-muted-foreground'>
              Order ID: {_id}
            </div>
          </div>

          <div className='grid md:grid-cols-3 my-3 pb-3'>
            <div className='text-lg font-bold'>
              <span>Shipping Address</span>
            </div>
            <div className='col-span-2'>
              <p>
                {shippingAddress.fullName} <br />
                {shippingAddress.street} <br />
                {`${shippingAddress.city}, ${shippingAddress.province}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}
              </p>
              <div className='mt-2'>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    isDelivered
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {isDelivered
                    ? `Delivered at ${deliveredAt ? formatDateTime(deliveredAt).dateTime : 'Unknown'}`
                    : `Expected delivery: ${
                        formatDateTime(expectedDeliveryDate).dateOnly
                      }`}
                </span>
              </div>
            </div>
          </div>

          <div className='border-y'>
            <div className='grid md:grid-cols-3 my-3 pb-3'>
              <div className='text-lg font-bold'>
                <span>Payment</span>
              </div>
              <div className='col-span-2'>
                <p>Method: {paymentMethod}</p>
                <div className='mt-2'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      isPaid
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {isPaid
                      ? `Paid at ${paidAt ? formatDateTime(paidAt).dateTime : 'Unknown'}`
                      : 'Not paid'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className='border-b'>
            <div className='grid md:grid-cols-3 my-3 pb-3'>
              <div className='text-lg font-bold'>
                <span>Order Items</span>
              </div>
              <div className='col-span-2 space-y-4'>
                {items.map((item) => (
                  <div key={item.slug} className='flex gap-4'>
                    <div className='relative w-20 h-20'>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes='20vw'
                        style={{
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                    <div className='flex-1'>
                      <Link
                        href={`/product/${item.slug}`}
                        className='hover:text-primary'
                      >
                        {item.name}
                      </Link>
                      <div className='flex justify-between'>
                        <div>
                          {item.color}, {item.size}
                        </div>
                        <div>
                          {item.quantity} x {formatPrice(item.price)} ={' '}
                          {formatPrice(item.quantity * item.price)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {isAdmin && !isDelivered && (
            <div className='mt-4'>
              <Button 
                onClick={handleDeliverOrder} 
                disabled={isDelivering}
              >
                {isDelivering ? 'Processing...' : 'Mark as Delivered'}
              </Button>
            </div>
          )}
        </div>

        <div>
          <Card>
            <CardContent className='p-4'>
              <div className='text-lg font-bold mb-4'>Order Summary</div>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span>Items:</span>
                  <span>{formatPrice(itemsPrice)}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Shipping:</span>
                  <span>
                    {shippingPrice === 0 ? 'FREE' : formatPrice(shippingPrice)}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Tax:</span>
                  <span>{formatPrice(taxPrice)}</span>
                </div>
                <div className='flex justify-between pt-2 border-t font-bold'>
                  <span>Order Total:</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}