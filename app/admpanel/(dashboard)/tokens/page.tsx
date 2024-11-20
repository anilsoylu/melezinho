import { Metadata } from "next"
import PageClient from "./page.client"

export const metadata: Metadata = {
  title: "Token Listesi",
  description: "Token listesi",
}

export default function TokensPage() {
  return <PageClient/>
}
