"use client"
import { usePathname } from "next/navigation"

export function useFolderFromPath() {
  const pathname = usePathname()
  const folder = pathname.split("/")[2]
  return folder
}

export function useFolderSubFromPath() {
  const pathname = usePathname()
  const folder = pathname.split("/")[3]
  return folder
}
