'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { createOrder } from '@/lib/actions/order.actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCart } from '@/hooks/use-cart'
import { getAddresses } from '@/lib/actions/address.actions'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'

const formSchema = z.object({
  shippingAddress: z.string().min(1, 'Please select a shipping address'),
  paymentMethod: z.enum(['Credit Card', 'PayPal', 'Cash on Delivery'], {
    required_error: 'Please select a payment method',
  }),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface Address {
  _id: string;
  fullName: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
}

export default function CheckoutForm() {
  const { toast } = useToast()
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shippingAddress: '',
      paymentMethod: 'Credit Card',
      notes: '',
    },
  })

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const result = await getAddresses()
        if (result.success) {
          setAddresses(result.data || [])
        } else {
          toast({
            title: "Error",
            description: result.message || 'Failed to load addresses',
            variant: 'destructive',
          })
        }
      } catch (_error) {
        toast({
          title: "Error",
          description: 'Failed to load addresses',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAddresses()
  }, [toast])

  const onSubmit = async (data: FormValues) => {
    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const selectedAddress = addresses.find(addr => addr._id === data.shippingAddress)
      
      if (!selectedAddress) {
        toast({
          title: "Error",
          description: "Please select a valid shipping address",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const orderItems = items.map(item => ({
        name: item.name,
        slug: item.slug,
        image: item.image,
        price: item.price,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
      }))

      const orderData = {
        orderItems,
        shippingAddress: selectedAddress,
        paymentMethod: data.paymentMethod,
        notes: data.notes || '',
        itemsPrice: items.reduce((total, item) => total + item.price * item.quantity, 0),
        shippingPrice: 0, // You can calculate this based on your business logic
        taxPrice: 0, // You can calculate this based on your business logic
        totalPrice: totalPrice,
      }

      const result = await createOrder(orderData)

      if (result.success) {
        clearCart()
        toast({
          title: "Success",
          description: "Your order has been placed successfully",
        })
        router.push(`/account/orders/${result.data._id}`)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to place order",
          variant: "destructive",
        })
      }
    } catch (_error) {
      // Using _error with underscore to indicate it's intentionally unused
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div>Loading checkout information...</div>
  }

  if (addresses.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="mb-4">You need to add a shipping address before checkout.</p>
          <Button onClick={() => router.push('/account/addresses/new')}>
            Add Address
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <FormField
                control={form.control}
                name="shippingAddress"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-3"
                      >
                        {addresses.map((address) => (
                          <div key={address._id} className="flex items-start space-x-2">
                            <RadioGroupItem value={address._id} id={address._id} />
                            <FormLabel htmlFor={address._id} className="font-normal cursor-pointer">
                              <div>
                                <p className="font-medium">{address.fullName}</p>
                                <p>{address.street}</p>
                                <p>
                                  {address.city}, {address.province} {address.postalCode}
                                </p>
                                <p>{address.country}</p>
                                <p>{address.phone}</p>
                              </div>
                            </FormLabel>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Credit Card" id="credit-card" />
                          <FormLabel htmlFor="credit-card" className="font-normal cursor-pointer">
                            Credit Card
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="PayPal" id="paypal" />
                          <FormLabel htmlFor="paypal" className="font-normal cursor-pointer">
                            PayPal
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Cash on Delivery" id="cod" />
                          <FormLabel htmlFor="cod" className="font-normal cursor-pointer">
                            Cash on Delivery
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Notes (Optional)</h2>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Add any special instructions or notes for your order"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.color}, {item.size} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Place Order"}
          </Button>
        </form>
      </Form>
    </div>
  )
}