"use client"
import { useCallback } from "react"
import { useToast } from "./use-toast"

type ToastVariant = "success" | "destructive"

interface CustomToastOptions {
  title: string
  description: string
  variant: ToastVariant
}

export const useCustomToast = () => {
  const { toast } = useToast()

  const show = useCallback(
    ({ title, description, variant }: CustomToastOptions) => {
      toast({
        title: title,
        description: description,
        variant: variant,
        duration: 2500,
      })
    },
    [toast]
  )

  return show
}
