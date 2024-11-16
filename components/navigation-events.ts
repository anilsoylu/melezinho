"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = `${pathname}?${searchParams}`
    console.log(`Navigated to: ${url}`)
  }, [pathname, searchParams])

  return null
}
