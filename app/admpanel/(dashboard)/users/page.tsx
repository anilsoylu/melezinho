import { Metadata } from "next"
import PageClient from "./page.client"
import { memo } from "react"

export const metadata: Metadata = {
  title: "Satıcı Listesi",
  description: "Satıcı listesi",
}

const DashboardSelllerPage = () => {
  return <PageClient />
}

export default memo(DashboardSelllerPage)
