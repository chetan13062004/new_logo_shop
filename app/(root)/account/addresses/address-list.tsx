'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { deleteAddress, getAddresses } from '@/lib/actions/address.actions'
import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

interface AddressListProps {
  addresses?: Address[];
}

export default function AddressList({ addresses: initialAddresses }: AddressListProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses || [])
  const [loading, setLoading] = useState(!initialAddresses)

  useEffect(() => {
    // If addresses were provided as props, don't fetch them
    if (initialAddresses) {
      return;
    }
    
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
      } catch (error) {
        console.error('Error fetching addresses:', error)
        toast({
          title: "Error",
          description: 'Failed to load addresses',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAddresses()
  }, [toast, initialAddresses])

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteAddress(id)
      if (result.success) {
        toast({
          title: "Success",
          description: 'Address deleted successfully',
        })
        // Update the addresses list without a full page refresh
        setAddresses(addresses.filter(address => address._id !== id))
      } else {
        toast({
          title: "Error",
          description: result.message || 'Failed to delete address',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error deleting address:', error)
      toast({
        title: "Error",
        variant: 'destructive',
        description: 'Failed to delete address',
      })
    }
  }

  if (loading) {
    return <div>Loading addresses...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Addresses</h1>
        <Button asChild>
          <Link href="/account/addresses/new">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Address
          </Link>
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="p-4">
            <p>You don&apos;t have any addresses yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((address) => (
            <Card key={address._id}>
              <CardHeader className="p-4 pb-0 flex justify-between items-start">
                <h3 className="font-bold">{address.fullName}</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <Link href={`/account/addresses/edit/${address._id}`}>
                      <PencilIcon className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(address._id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <p>{address.phone}</p>
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.province} {address.postalCode}
                </p>
                <p>{address.country}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}