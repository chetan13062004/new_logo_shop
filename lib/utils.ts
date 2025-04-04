import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import qs from 'query-string'

export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string
  key: string
  value: string | null
}) {
  const currentUrl = qs.parse(params)

  currentUrl[key] = value

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatNumberWithDecimal = (num: number): string => {
  const [int, decimal] = num.toString().split('.')
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : int
}

export const toSlug = (text: string): string => {
  return text
    .toLowerCase() // Convert to lowercase
    .replace(/[^\w\s-]/g, '') // Remove non-word, non-whitespace, and non-hyphen characters
    .replace(/\s+/g, '-') // Replace whitespace with hyphens
    .replace(/^-+|-+$/g, ''); // Trim leading and trailing hyphens
};

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2,
})

export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount)
}

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US')
export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number)
}

export const round2 = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100

export const generateId = () =>
  Array.from({ length: 24 }, () => Math.floor(Math.random() * 10)).join('')

interface ZodErrorType {
  errors: Record<string, { message: string; path: string }>
  name: string
}

interface ValidationErrorType {
  errors: Record<string, { message: string }>
  name: string
}

interface DuplicateKeyErrorType {
  code: number
  keyValue: Record<string, string>
}

export const formatError = (error: unknown): string => {
  if (error && typeof error === 'object') {
    if ('name' in error) {
      if (error.name === 'ZodError' && 'errors' in error && error.errors && typeof error.errors === 'object') {
        const zodError = error as ZodErrorType
        const fieldErrors = Object.keys(zodError.errors).map((field) => {
          const errorObj = zodError.errors[field];
          return `${errorObj.path}: ${errorObj.message}`;
        });
        return fieldErrors.join('. ');
      } else if (error.name === 'ValidationError' && 'errors' in error && error.errors && typeof error.errors === 'object') {
        const validationError = error as ValidationErrorType
        const fieldErrors = Object.keys(validationError.errors).map((field) => {
          return validationError.errors[field].message;
        });
        return fieldErrors.join('. ');
      }
    }
    
    if ('code' in error && error.code === 11000 && 'keyValue' in error && error.keyValue && typeof error.keyValue === 'object') {
      const duplicateError = error as DuplicateKeyErrorType
      const duplicateField = Object.keys(duplicateError.keyValue)[0];
      return `${duplicateField} already exists`;
    }
    
    if ('message' in error) {
      return typeof error.message === 'string'
        ? error.message
        : JSON.stringify(error.message)
    }
  }
  
  return 'An unknown error occurred'
}

export function calculateFutureDate(days: number) {
  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() + days)
  return currentDate
}

export function getMonthName(yearMonth: string): string {
  const [year, month] = yearMonth.split('-').map(Number)
  const date = new Date(year, month - 1)
  const monthName = date.toLocaleString('default', { month: 'long' })
  const now = new Date()

  if (year === now.getFullYear() && month === now.getMonth() + 1) {
    return `${monthName} Ongoing`
  }
  return monthName
}

export function calculatePastDate(days: number) {
  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() - days)
  return currentDate
}

export function timeUntilMidnight(): { hours: number; minutes: number } {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0) // Set to 12:00 AM (next day)

  const diff = midnight.getTime() - now.getTime() // Difference in milliseconds
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return { hours, minutes }
}

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }
  const dateOptions: Intl.DateTimeFormatOptions = {
    // weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  }
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  )
  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  )
  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  )
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  }
}

export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`
}

export const getFilterUrl = ({
  category = 'all',
  tag = 'all',
  price = 'all',
  rating = 'all',
  sort = 'best-selling',
  page = '1',
  params = {},
}: {
  category?: string
  tag?: string
  price?: string
  rating?: string
  sort?: string
  page?: string
  params?: Record<string, string>
}) => {
  const newParams = { ...params }
  if (category) newParams.category = category
  if (tag) newParams.tag = toSlug(tag)
  if (price) newParams.price = price
  if (rating) newParams.rating = rating
  if (page) newParams.page = page
  if (sort) newParams.sort = sort
  return `/search?${new URLSearchParams(newParams).toString()}`
}