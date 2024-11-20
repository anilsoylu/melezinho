import { kyFetcher } from "@/hooks/use-fetcher"
import { SELLER_API } from "@/types/api-list"
import { Seller } from "@prisma/client"
import EditUserForm from "./_components/user-form"
import Loading from "@/components/Loading"

type Props = {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props) {
  const sellerId = params.id
  const sellerApi = `${SELLER_API}/${sellerId}`
  const data = await kyFetcher<Seller>(sellerApi)

  return {
    title: `${data.name} Satıcısını Düzenle`,
    description: `Satıcı düzenleme sayfası. ${data.name} satıcısın düzenleyebilir ve güncelleyebilirsiniz.`,
  }
}

export default async function EditUserPage({ params }: Props) {
  const sellerId = params.id
  const sellerApi = `${SELLER_API}/${sellerId}`
  const sellerData = await kyFetcher<Seller>(sellerApi, undefined, {
    cache: "no-store",
  })

  if (!sellerData) return <Loading />

  return <EditUserForm sellerId={sellerId} sellerData={sellerData} />
}
