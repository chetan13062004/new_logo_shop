'use client'

import { useEffect, useState } from 'react'
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import {
  approvePayPalOrder,
  createPayPalOrder,
} from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/db/models/order.model'
import { formatDateTime } from '@/lib/utils'

import CheckoutFooter from '../checkout-footer'
import { redirect, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

// Utility function for price formatting
const formatPrice = (price?: number) => {
  if (price === undefined) return '--';
  return `₹${price.toFixed(2)}`;
};

export default function OrderDetailsForm({
  order,
  paypalClientId,
}: {
  order: IOrder
  paypalClientId: string
  isAdmin: boolean
}) {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const {
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    expectedDeliveryDate,
    isPaid,
  } = order
  const { toast } = useToast()

  // Handle component lifecycle to prevent issues during hot reloading
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  if (isPaid) {
    redirect(`/account/orders/${order._id}`)
  }
  
  function PrintLoadingState() {
    const [{ isPending, isRejected }] = usePayPalScriptReducer()
    let status = ''
    if (isPending) {
      status = 'Loading PayPal...'
    } else if (isRejected) {
      status = 'Error in loading PayPal.'
    }
    return status
  }
  
  const handleCreatePayPalOrder = async () => {
    setIsProcessing(true)
    try {
      const res = await createPayPalOrder(order._id)
      if (!res.success) {
        toast({
          description: res.message,
          variant: 'destructive',
        })
        return null
      }
      return res.data
    } catch (error) {
      console.error('PayPal createOrder error:', error)
      toast({
        description: 'Failed to create PayPal order. Please try again.',
        variant: 'destructive',
      })
      return null
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    setIsProcessing(true)
    try {
      const res = await approvePayPalOrder(order._id, data)
      toast({
        description: res.message,
        variant: res.success ? 'default' : 'destructive',
      })
      
      // If payment was successful, redirect to order page
      if (res.success) {
        router.push(`/account/orders/${order._id}`)
      }
    } catch (error) {
      console.error('PayPal approveOrder error:', error)
      toast({
        description: 'Failed to process payment. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const CheckoutSummary = () => (
    <Card>
      <CardContent className='p-4'>
        <div>
          <div className='text-lg font-bold'>Order Summary</div>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>Items:</span>
              <span>
                {formatPrice(itemsPrice)}
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Shipping & Handling:</span>
              <span>
                {shippingPrice === undefined ? (
                  '--'
                ) : shippingPrice === 0 ? (
                  'FREE'
                ) : (
                  formatPrice(shippingPrice)
                )}
              </span>
            </div>
            <div className='flex justify-between'>
              <span> Tax:</span>
              <span>
                {taxPrice === undefined ? (
                  '--'
                ) : (
                  formatPrice(taxPrice)
                )}
              </span>
            </div>
            <div className='flex justify-between pt-1 font-bold text-lg'>
              <span> Order Total:</span>
              <span>
                {formatPrice(totalPrice)}
              </span>
            </div>

            {isMounted && !isPaid && paymentMethod === 'PayPal' && (
              <div>
                <PayPalScriptProvider 
                  options={{ 
                    clientId: paypalClientId,
                    components: "buttons",
                    currency: "INR",
                    intent: "capture"
                  }}
                >
                  <PrintLoadingState />
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={handleCreatePayPalOrder}
                    onApprove={handleApprovePayPalOrder}
                    disabled={isProcessing}
                    onError={(err) => {
                      console.error('PayPal error:', err);
                      toast({
                        description: 'PayPal encountered an error. Please try again.',
                        variant: 'destructive',
                      });
                      setIsProcessing(false);
                    }}
                    onCancel={() => {
                      toast({
                        description: 'Payment cancelled.',
                        variant: 'default',
                      });
                      setIsProcessing(false);
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            )}

            {!isPaid && paymentMethod === 'Cash On Delivery' && (
              <Button
                className='w-full rounded-full'
                onClick={() => router.push(`/account/orders/${order._id}`)}
              >
                View Order
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <main className='max-w-6xl mx-auto px-4 sm:px-6'>
      <div className='grid md:grid-cols-4 gap-6'>
        <div className='md:col-span-3'>
          {/* Shipping Address */}
          <div>
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
              </div>
            </div>
          </div>

          {/* payment method */}
          <div className='border-y'>
            <div className='grid md:grid-cols-3 my-3 pb-3'>
              <div className='text-lg font-bold'>
                <span>Payment Method</span>
              </div>
              <div className='col-span-2'>
                <p>{paymentMethod}</p>
              </div>
            </div>
          </div>

          <div className='grid md:grid-cols-3 my-3 pb-3'>
            <div className='flex text-lg font-bold'>
              <span>Items and shipping</span>
            </div>
            <div className='col-span-2'>
              <p>
                Delivery date:{' '}
                {formatDateTime(expectedDeliveryDate).dateOnly}
              </p>
              <ul className='space-y-1 mt-2'>
                {items.map((item) => (
                  <li key={item.slug} className='flex justify-between'>
                    <span>{item.name} x {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='block md:hidden'>
            <CheckoutSummary />
          </div>

          <CheckoutFooter />
        </div>
        <div className='hidden md:block'>
          <CheckoutSummary />
        </div>
      </div>
    </main>
  )
}