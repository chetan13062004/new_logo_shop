'use client'
import { ChevronUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className='bg-black text-white'>
      <div className='w-full'>
        {/* Back to Top Button */}
        <button
          className='bg-gray-800 w-full rounded-none py-2 flex items-center justify-center'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp className='mr-2 h-4 w-4' />
          Back to Top
        </button>
        
        {/* Footer Menu Sections */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto'>
          <div>
            <h3 className='font-bold mb-2'>Condition of Use</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/page/careers'>Privacy Notice</Link>
              </li>
              <li>
                <Link href='/page/blog'>Help</Link>
              </li>
              <li>
                <Link href='/page/about-us'>About Us</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='font-bold mb-2'>Make Money with Us</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/page/sell'>Sell products on SiteName</Link>
              </li>
              <li>
                <Link href='/page/become-affiliate'>Become an Affiliate</Link>
              </li>
              <li>
                <Link href='/page/advertise'>Advertise Your Products</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='font-bold mb-2'>Let Us Help You</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/page/shipping'>Shipping Rates & Policies</Link>
              </li>
              <li>
                <Link href='/page/returns-policy'>Returns & Replacements</Link>
              </li>
              <li>
                <Link href='/page/help'>Help</Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Footer Bottom Section */}
        <div className='border-t border-gray-800'>
          <div className='max-w-7xl mx-auto py-8 px-4 flex flex-col items-center space-y-4'>
            <div className='flex items-center space-x-4'>
              <Image
                src='/icons/logo.png'
                alt='Site logo'
                width={100}
                height={100}
                className='w-14'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links at the Bottom */}
      <div className='p-4'>
        <div className='flex justify-center gap-3 text-sm'>
          <Link href='/page/conditions-of-use'>Conditions of Use</Link>
          <Link href='/page/privacy-policy'>Privacy Notice</Link>
          <Link href='/page/help'>Help</Link>
        </div>
        <div className='flex justify-center text-sm'>
          <p>© 2025 YourSiteName</p>
        </div>
        <div className='mt-8 flex justify-center text-sm text-gray-400'>
          <p>YourSiteName Address | Phone Number</p>
        </div>
      </div>
    </footer>
  )
}
