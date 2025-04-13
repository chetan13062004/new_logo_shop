'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AddressForm from '../../address-form'
import { getAddressById, updateAddress } from '@/lib/actions/address.actions'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/hooks/use-toast'

export default function EditAddressPage() {
  const params = useParams()
  const router = useRouter()
  const [address, setAddress] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        if (!params.id) {
          router.push('/account/addresses')
          return
        }

        const addressId = Array.isArray(params.id) ? params.id[0] : params.id
        const result = await getAddressById(addressId)
        
        if (result.success) {
          setAddress(result.data)
        } else {
          router.push('/account/addresses')
        }
      } catch (err) {
        console.error('Error fetching address:', err)
        router.push('/account/addresses')
      } finally {
        setLoading(false)
      }
    }

    fetchAddress()
  }, [params.id, router])

  const handleSubmit = async (data: any) => {
    try {
      const addressId = Array.isArray(params.id) ? params.id[0] : params.id
      const result = await updateAddress({ id: addressId, ...data })
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Address updated successfully",
        })
        router.push('/account/addresses')
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update address",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error('Error updating address:', err)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Address</h1>
      {address && <AddressForm address={address} onSubmit={handleSubmit} />}
    </div>
  )
}