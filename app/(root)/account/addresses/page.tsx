import { Metadata } from 'next'
import Link from 'next/link'
import { getAddresses } from '@/lib/actions/address.actions'
import { AddressList } from './address-list'

const PAGE_TITLE = 'Your Addresses'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}

export default async function AddressesPage() {
  const addresses = await getAddresses()
  
  return (
    <div>
      <div className='flex gap-2'>
        <Link href='/account'>Your Account</Link>
        <span>›</span>
        <span>{PAGE_TITLE}</span>
      </div>
      <h1 className='h1-bold py-4'>{PAGE_TITLE}</h1>
      
      <AddressList addresses={addresses.data || []} />
      
      <div className="mt-6">
        <Link 
          href="/account/addresses/new" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Add a new address
        </Link>
      </div>
    </div>
  )
}