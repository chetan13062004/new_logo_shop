'use client'
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App error:', error)
  }, [error])

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='p-6 rounded-lg shadow-md max-w-md w-full text-center'>
        <h1 className='text-3xl font-bold mb-4'>Something went wrong</h1>
        <p className='text-destructive mb-4'>{error.message || 'An unexpected error occurred'}</p>
        {error.digest && (
          <p className='text-xs text-muted-foreground mb-4'>Error ID: {error.digest}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button variant='default' className='mt-4' onClick={() => reset()}>
            Try again
          </Button>
          <Button
            variant='outline'
            className='mt-4'
            onClick={() => (window.location.href = '/')}
          >
            Back To Home
          </Button>
        </div>
      </div>
    </div>
  )
}