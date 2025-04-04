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
  const discountPercent = Math.round(100 - (price / listPrice) * 100)
  const stringValue = price.toString()
  const [intValue, floatValue] = stringValue.includes('.')
    ? stringValue.split('.')
    : [stringValue, '00']

  // Plain view
  if (plain) {
    return (
      <div className={cn('text-3xl', className)}>
        Rs {parseFloat(intValue).toLocaleString('en-IN')}
        <span className='text-xs align-super'>{floatValue}</span>
      </div>
    )
  }

  // No list price
  if (listPrice === 0) {
    return (
      <div className={cn('text-3xl', className)}>
      Rs {parseFloat(intValue).toLocaleString('en-IN')}
        <span className='text-xs align-super'>{floatValue}</span>
      </div>
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
          <div className={cn('text-3xl', className)}>
            Rs {parseFloat(intValue).toLocaleString('en-IN')}
            <span className='text-xs align-super'>{floatValue}</span>
          </div>
          <div className='text-muted-foreground text-xs py-2'>
            Was: <span className='line-through'>Rs{parseFloat(listPrice.toString()).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    )
  }

  // Default price display
  return (
    <div>
      <div className='flex justify-center gap-3'>
        <div className='text-3xl text-orange-700'>-{discountPercent}%</div>
        <div className={cn('text-3xl', className)}>
          Rs {parseFloat(intValue).toLocaleString('en-IN')}
          <span className='text-xs align-super'>{floatValue}</span>
        </div>
      </div>
    </div>
  )
}

export default ProductPrice