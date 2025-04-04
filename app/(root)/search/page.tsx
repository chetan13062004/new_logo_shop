import Link from 'next/link'
import Pagination from '@/components/shared/pagination'
import ProductCard from '@/components/shared/product/product-card'
import { Button } from '@/components/ui/button'
import {
  getAllCategories,
  getAllProducts,
  getAllTags,
} from '@/lib/actions/product.actions'
import { IProduct } from '@/lib/db/models/product.model'
import ProductSortSelector from '@/components/shared/product/product-sort-selector'
import { getFilterUrl, toSlug } from '@/lib/utils'
import Rating from '@/components/shared/product/rating'
import CollapsibleOnMobile from '@/components/shared/collapsible-on-mobile'

const sortOrders = [
  { value: 'price-low-to-high', name: 'Price: Low to high' },
  { value: 'price-high-to-low', name: 'Price: High to low' },
  { value: 'newest-arrivals', name: 'Newest arrivals' },
  { value: 'avg-customer-review', name: 'Avg. customer review' },
  { value: 'best-selling', name: 'Best selling' },
]

const prices = [
  {
    name: 'Rs 1 to Rs 1,500',
    value: '1-1500',
  },
  {
    name: 'Rs 1,501 to Rs 4,000',
    value: '1501-4000',
  },
  {
    name: 'Rs 4,001 to Rs 80,000',
    value: '4001-80000',
  },
]

// Define the correct interface for Next.js 15 page props
interface SearchPageProps {
  searchParams: {
    q?: string
    category?: string
    tag?: string
    price?: string
    rating?: string
    sort?: string
    page?: string
  }
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps) {
  const q = searchParams.q || 'all'
  const category = searchParams.category || 'all'
  const tag = searchParams.tag || 'all'
  const price = searchParams.price || 'all'
  const rating = searchParams.rating || 'all'

  if (
    (q !== 'all' && q !== '') ||
    category !== 'all' ||
    tag !== 'all' ||
    rating !== 'all' ||
    price !== 'all'
  ) {
    return {
      title: `Search Results${q !== 'all' ? ' for "' + q + '"' : ''}
          ${category !== 'all' ? ` : Category ${category}` : ''}
          ${tag !== 'all' ? ` : Tag ${tag}` : ''}
          ${price !== 'all' ? ` : Price ${price}` : ''}
          ${rating !== 'all' ? ` : Rating ${rating}` : ''}`,
    }
  } else {
    return {
      title: 'Search Products',
    }
  }
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const q = searchParams.q || 'all'
  const category = searchParams.category || 'all'
  const tag = searchParams.tag || 'all'
  const price = searchParams.price || 'all'
  const rating = searchParams.rating || 'all'
  const sort = searchParams.sort || 'best-selling'
  const page = searchParams.page || '1'

  const filterParams = { q, category, tag, price, rating, sort, page }

  // Fetch data using Promise.all for parallel requests
  const [categories, tags, data] = await Promise.all([
    getAllCategories(),
    getAllTags(),
    getAllProducts({
      category,
      tag,
      query: q,
      price,
      rating,
      page: Number(page),
      sort,
    })
  ]);

  return (
    <div className='px-4 py-6 md:px-6 lg:px-12'>
      <div className='my-4 flex flex-col justify-between gap-4 md:flex-row md:items-center'>
        <div className='text-sm text-muted-foreground'>
          {data.totalProducts === 0
            ? 'No results found.'
            : `${data.from}-${data.to} of ${data.totalProducts} results`}
          {(q !== 'all' && q !== '') ||
          (category !== 'all' && category !== '') ||
          (tag !== 'all' && tag !== '') ||
          rating !== 'all' ||
          price !== 'all'
            ? ` for:`
            : null}
          {q !== 'all' && q !== '' && ` "${q}"`}
          {category !== 'all' && ` | Category: ${category}`}
          {tag !== 'all' && ` | Tag: ${tag}`}
          {price !== 'all' && ` | Price: ${price}`}
          {rating !== 'all' && ` | Rating: ${rating} & up`}
          &nbsp;
          {(q !== 'all' && q !== '') ||
          (category !== 'all' && category !== '') ||
          (tag !== 'all' && tag !== '') ||
          rating !== 'all' ||
          price !== 'all' ? (
            <Button variant='link' className='text-blue-500' asChild>
              <Link href='/search'>Clear</Link>
            </Button>
          ) : null}
        </div>

        <ProductSortSelector
          sortOrders={sortOrders}
          sort={sort}
          params={filterParams}
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-5 md:gap-6'>
        <CollapsibleOnMobile title='Filters'>
          <div className='space-y-6 text-sm'>
            <div>
              <h3 className='font-semibold mb-1'>Department</h3>
              <ul className='space-y-1'>
                <li>
                  <Link
                    className={`${('all' === category || '' === category) && 'text-primary font-semibold'}`}
                    href={getFilterUrl({ category: 'all', params: filterParams })}
                  >
                    All
                  </Link>
                </li>
                {categories.map((c: string) => (
                  <li key={c}>
                    <Link
                      className={`${c === category && 'text-primary font-semibold'}`}
                      href={getFilterUrl({ category: c, params: filterParams })}
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className='font-semibold mb-1'>Price</h3>
              <ul className='space-y-1'>
                <li>
                  <Link
                    className={`${'all' === price && 'text-primary font-semibold'}`}
                    href={getFilterUrl({ price: 'all', params: filterParams })}
                  >
                    All
                  </Link>
                </li>
                {prices.map((p) => (
                  <li key={p.value}>
                    <Link
                      href={getFilterUrl({ price: p.value, params: filterParams })}
                      className={`${p.value === price && 'text-primary font-semibold'}`}
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className='font-semibold mb-1'>Customer Reviews</h3>
              <ul className='space-y-1'>
                <li>
                  <Link
                    href={getFilterUrl({ rating: 'all', params: filterParams })}
                    className={`${'all' === rating && 'text-primary font-semibold'}`}
                  >
                    All
                  </Link>
                </li>
                <li>
                  <Link
                    href={getFilterUrl({ rating: '4', params: filterParams })}
                    className={`${'4' === rating && 'text-primary font-semibold'}`}
                  >
                    <div className='flex items-center gap-1'>
                      <Rating size={4} rating={4} />
                      Up
                    </div>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className='font-semibold mb-1'>Tag</h3>
              <ul className='space-y-1'>
                <li>
                  <Link
                    className={`${('all' === tag || '' === tag) && 'text-primary font-semibold'}`}
                    href={getFilterUrl({ tag: 'all', params: filterParams })}
                  >
                    All
                  </Link>
                </li>
                {tags.map((t: string) => (
                  <li key={t}>
                    <Link
                      className={`${toSlug(t) === tag && 'text-primary font-semibold'}`}
                      href={getFilterUrl({ tag: t, params: filterParams })}
                    >
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CollapsibleOnMobile>

        <div className='md:col-span-4 space-y-6'>
          <div>
            <h2 className='text-2xl font-semibold'>Results</h2>
            <p className='text-muted-foreground'>Check each product page for other buying options.</p>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {data.products.length === 0 && (
              <div className='col-span-full text-center'>No product found</div>
            )}
            {data.products.map((product: IProduct) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <Pagination page={page} totalPages={data.totalPages} />
          )}
        </div>
      </div>
    </div>
  )
}