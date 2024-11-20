export const noImages = "/dashboard/placeholder.svg" //"/dashboard/noimages.png"
export const noArrayImages: string[] = ["/dashboard/placeholder.svg"]
export const userNoImages = "/dashboard/admin.png"

export type Available = {
  id: string
  title: string
  isAvailable: boolean
}

export type UserAvailable = {
  id: string
  isActivated: boolean
  name: string
}
