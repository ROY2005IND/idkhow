import { useEffect } from 'react'
import { ToastContainer, toast, ToastContent, ToastOptions } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface NotificationOptions {
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left'
}

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'dark'
}

export function showNotification(
  message: ToastContent,
  options: NotificationOptions = {}
): void {
  const { type = 'info', duration, position, ...rest } = options

  const toastOptions: ToastOptions = {
    ...defaultOptions,
    ...(duration && { autoClose: duration }),
    ...(position && { position }),
    ...rest
  }

  switch (type) {
    case 'success':
      toast.success(message, toastOptions)
      break
    case 'error':
      toast.error(message, toastOptions)
      break
    case 'warning':
      toast.warning(message, toastOptions)
      break
    case 'info':
    default:
      toast.info(message, toastOptions)
      break
  }
}

export function showSuccess(message: ToastContent, options?: Omit<NotificationOptions, 'type'>): void {
  showNotification(message, { ...options, type: 'success' })
}

export function showError(message: ToastContent, options?: Omit<NotificationOptions, 'type'>): void {
  showNotification(message, { ...options, type: 'error' })
}

export function showWarning(message: ToastContent, options?: Omit<NotificationOptions, 'type'>): void {
  showNotification(message, { ...options, type: 'warning' })
}

export function showInfo(message: ToastContent, options?: Omit<NotificationOptions, 'type'>): void {
  showNotification(message, { ...options, type: 'info' })
}

export default function Notifications() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      toastClassName="!bg-dark-800 !border !border-dark-700 !text-white"
      progressClassName="!bg-primary-500"
    />
  )
}
