import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}


const ToastContext = React.createContext<ToastContextType | null>(null)

type ToastContextType = {
  toasts: ToasterToast[]
  addToast: (toast: ToasterToast) => void
  removeToast: (id: string) => void
  updateToast: (id: string, toast: ToasterToast) => void
}

export function useToast() {
  const context = React.useContext(ToastContext)

  if (context === null) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return {
    toast: (props: Omit<ToasterToast, "id">) => {
      context.addToast({ ...props, id: Math.random().toString() })
    },
    dismiss: (toastId?: string) => {
      if (toastId) {
        context.removeToast(toastId)
      } else {
        context.toasts.forEach((toast) => {
          context.removeToast(toast.id)
        })
      }
    },
    update: (id: string, props: Omit<ToasterToast, "id">) => {
      context.updateToast(id, { ...props, id })
    },
  }
}

export function ToastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([])

  const addToast = React.useCallback((toast: ToasterToast) => {
    setToasts((prevToasts) => {
      const newToasts = [...prevToasts, toast]
      if (newToasts.length > TOAST_LIMIT) {
        const [, ...rest] = newToasts
        return rest
      }
      return newToasts
    })
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  const updateToast = React.useCallback((id: string, toast: ToasterToast) => {
    setToasts((prevToasts) =>
      prevToasts.map((t) => (t.id === id ? { ...t, ...toast } : t))
    )
  }, [])

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        updateToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}