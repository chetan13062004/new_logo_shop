import { createAddress } from '@/lib/actions/address.actions'
import Link from 'next/link'
import AddressForm from '../address-form'

export default function NewAddressPage() {
  const onSubmit = async (data: {
    fullName: string
    phone: string
    street: string
    city: string
    postalCode: string
    province: string
    country: string
  }) => {
    await createAddress({
      address: data.street,
      state: data.province,
      email: '', // Add email if required
      fullName: data.fullName,
      phone: data.phone,
      city: data.city,
      postalCode: data.postalCode,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Link href="/account">Your Account</Link>
        <span>›</span>
        <Link href="/account/addresses">Your Addresses</Link>
        <span>›</span>
        <span>Add Address</span>
      </div>
      <h1 className="text-2xl font-bold">Add a New Address</h1>
      <AddressForm onSubmit={onSubmit} />
    </div>
  )
}