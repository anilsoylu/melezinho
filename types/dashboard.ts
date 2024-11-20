export const noImages = "/dashboard/placeholder.svg" //"/dashboard/noimages.png"
export const noArrayImages: string[] = ["/dashboard/placeholder.svg"]
export const userNoImages = "/dashboard/admin.png"

export type Available = {
  id: string
  title: string
  isActivated: boolean
}

export type ProductPaid = {
  id: string
  title: string
  isPaid: boolean
}

export type UserAvailable = {
  id: string
  isActivated: boolean
  name: string
}
