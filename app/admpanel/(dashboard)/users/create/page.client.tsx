"use client"
import Unauthorized from "@/components/unauthorized"
import { useCurrentUser } from "@/hooks/use-current-user"
import { dashboardPrefix } from "../../routes"
import UserForm from "./_components/user-form"

const PageClient = () => {
  const user = useCurrentUser()

  if (!user?.isAdmin) {
    return (
      <Unauthorized
        type="Yeni Satıcı Ekleme"
        link={dashboardPrefix}
        buttonName="Geri Dön"
      />
    )
  }

  return <UserForm />
}

export default PageClient
