'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/usetoast'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

interface FormData {
  fullName: string
  phone: string
  street: string
  city: string
  postalCode: string
  province: string
  country: string
}

export default function AddressForm({ address, onSubmit }: {
    address?: FormData;
    onSubmit: (data: FormData) => Promise<void>;
  }) {
  const { toast } = useToast()
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: address,
  })

  const submitHandler = async (data: FormData) => {
    try {
      await onSubmit(data)
      toast({
        title: "Success",
        description: 'Address saved successfully',
      })
      router.push('/account/addresses')
    } catch {
      toast({
        title: "Error",
        variant: 'destructive',
        description: 'Failed to save address',
      })
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              {...register('fullName', {
                required: 'Full name is required',
              })}
            />
            {errors.fullName && (
              <div className="text-red-500">{errors.fullName.message}</div>
            )}
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              {...register('phone', {
                required: 'Phone number is required',
              })}
            />
            {errors.phone && (
              <div className="text-red-500">{errors.phone.message}</div>
            )}
          </div>
          <div>
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              {...register('street', {
                required: 'Street address is required',
              })}
            />
            {errors.street && (
              <div className="text-red-500">{errors.street.message}</div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

