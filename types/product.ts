export type SellerType = {
  id: string
  name: string
  isActivated: boolean
}

export type ProductType = {
  id: string
  sellerId: string
  title: string
  date: Date
  price: number
  quantity: number
  isPaid: boolean
  isActivated: boolean
  seller: SellerType
}
