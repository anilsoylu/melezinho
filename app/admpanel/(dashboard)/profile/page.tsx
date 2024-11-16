import dynamic from "next/dynamic"
import DataError from "@/components/data-error"

const ProfileForm = dynamic(
  () => import("@/app/admpanel/(dashboard)/profile/_components/profile-form"),
  { ssr: false }
)

export const metadata = {
  title: "Profil",
  description: "Profil",
}

const DashboardProfilPage = async () => {
  try {
    return <ProfileForm />
  } catch (error) {
    console.error("Kullanıcı verisi alınırken hata oluştu:", error)
    return <DataError type="Kullanıcı verisi" />
  }
}

export default DashboardProfilPage
