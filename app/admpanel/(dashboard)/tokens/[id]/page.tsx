import { kyFetcher } from "@/hooks/use-fetcher"
import { TOKEN_API } from "@/types/api-list"
import { ProductType } from "@/types/product"
import PageClient from "./page.client"

type Props = {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props) {
  const tokenId = params.id
  const tokenApi = `${TOKEN_API}/${tokenId}`
  const data = await kyFetcher<ProductType>(tokenApi)

  return {
    title: `${data.title} Tokenini Düzenle`,
    description: `Token düzenleme sayfası. ${data.title} tokenini düzenleyebilir ve güncelleyebilirsiniz.`,
  }
}

const EditTokenPage = ({ params }: Props) => {
  const tokenId = params.id

  return <PageClient tokenId={tokenId} />
}

export default EditTokenPage
