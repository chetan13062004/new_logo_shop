'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useToast } from '@/components/ui/usetoast'
import { deleteAddress } from '@/lib/actions/address.actions'
import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

export default function AddressList({ addresses }: { addresses: Address[] }) {
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async (id: string) => {
    try {
      await deleteAddress(id)
      toast({
        title: "Success",
        description: 'Address deleted successfully',
      })
      router.refresh()
    } catch {
      toast({
        title: "Error",
        variant: 'destructive',
        description: 'Failed to delete address',
      })
    }
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
                    <Link href={`/account/addresses/${address._id}/edit`}>
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

