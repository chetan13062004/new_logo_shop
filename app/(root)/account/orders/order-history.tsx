'use client'

import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/utils'
import { IOrder } from '@/lib/db/models/order.model'
import Link from 'next/link'

// Utility function for price formatting
const formatPrice = (price?: number) => {
  if (price === undefined) return '--';
  return `₹${price.toFixed(2)}`;
};

export default function OrderHistory({ orders }: { orders: IOrder[] }) {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              ID
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              DATE
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              TOTAL
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              PAID
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              DELIVERED
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              ACTION
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {order._id.substring(20, 24)}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {formatDateTime(order.createdAt).dateOnly}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {formatPrice(order.totalPrice)}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {order.isPaid ? (
                  <span className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'>
                    {order.paidAt ? formatDateTime(order.paidAt).dateOnly : ''}
                  </span>
                ) : (
                  <span className='px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'>
                    No
                  </span>
                )}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {order.isDelivered ? (
                  <span className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'>
                    {order.deliveredAt ? formatDateTime(order.deliveredAt).dateOnly : ''}
                  </span>
                ) : (
                  <span className='px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800'>
                    No
                  </span>
                )}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                <Link href={`/account/orders/${order._id}`}>
                  <Button variant='outline' size='sm'>
                    Details
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}