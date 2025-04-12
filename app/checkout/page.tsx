import CheckoutForm from './checkout-form'
import { getAddresses } from '@/lib/actions/address.actions'

export const metadata = {
  title: 'Checkout',
}

export default async function CheckoutPage() {
  const addressesResponse = await getAddresses()

  return (
    <CheckoutForm
      userAddresses={addressesResponse.success ? addressesResponse.data : []}
    />
  )
}