import { cn } from '@/lib/utils'

const ProductPrice = ({
  price,
  className,
  listPrice = 0,
  isDeal = false,
  forListing = true,
  plain = false,
}: {
  price: number
  isDeal?: boolean
  listPrice?: number
  className?: string
  forListing?: boolean
  plain?: boolean
}) => {
  // Ensure price has exactly 2 decimal places
  const formattedPrice = Number(price).toFixed(2)
  const formattedListPrice = listPrice > 0 ? Number(listPrice).toFixed(2) : '0.00'
  
  const discountPercent = Math.round(100 - (price / listPrice) * 100)
  const [intValue, floatValue] = formattedPrice.split('.')

  // Plain view
  if (plain) {
    return (
      <span className={cn('text-3xl', className)}>
        Rs {parseFloat(intValue).toLocaleString('en-IN')}
        <span className='text-xs align-super'>{floatValue}</span>
      </span>
    )
  }

  // No list price
  if (listPrice === 0) {
    return (
      <span className={cn('text-3xl', className)}>
        Rs {parseFloat(intValue).toLocaleString('en-IN')}
        <span className='text-xs align-super'>{floatValue}</span>
      </span>
    )
  }

  // Deal display
  if (isDeal) {
    return (
      <div className='space-y-2'>
        <div className='flex justify-center items-center gap-2'>
          <span className='bg-red-700 rounded-sm p-1 text-white text-sm font-semibold'>
            {discountPercent}% off
          </span>
          <span className='text-red-700 text-xs font-bold'>
            Limited time deal
          </span>
        </div>
        <div className={`flex ${forListing && 'justify-center'} items-center gap-2`}>
          <span className={cn('text-3xl', className)}>
            Rs {parseFloat(intValue).toLocaleString('en-IN')}
            <span className='text-xs align-super'>{floatValue}</span>
          </span>
          <span className='text-muted-foreground text-xs py-2'>
            Was: <span className='line-through'>Rs {parseFloat(formattedListPrice.split('.')[0]).toLocaleString('en-IN')}.{formattedListPrice.split('.')[1]}</span>
          </span>
        </div>
      </div>
    )
  }

  // Default price display
  return (
    <div>
      <div className='flex justify-center gap-3'>
        <span className={cn('text-3xl', className)}>
          Rs {parseFloat(intValue).toLocaleString('en-IN')}
          <span className='text-xs align-super'>{floatValue}</span>
        </span>
        {listPrice > 0 && (
          <span className='text-muted-foreground text-xs py-2'>
            Was: <span className='line-through'>Rs {parseFloat(formattedListPrice.split('.')[0]).toLocaleString('en-IN')}.{formattedListPrice.split('.')[1]}</span>
          </span>
        )}
      </div>
    </div>
  )
}

export default ProductPrice