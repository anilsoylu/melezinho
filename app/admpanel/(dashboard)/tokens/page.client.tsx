"use client"

import { mutate } from "swr"
import { memo } from "react"
import { useBlock } from "@/context/block-context"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useCustomToast } from "@/hooks/use-custom-toast"
import { useFolderFromPath } from "@/hooks/use-folder-path"
import useFetcher from "@/hooks/use-swr"
import Wait from "@/hooks/use-wait"

import DataError from "@/components/data-error"
import Loading from "@/components/Loading"
import { TOKEN_API } from "@/types/api-list"
import ProductDataTable from "./_components/data-table"
import { handleDelete } from "@/lib/apiHelpers"
import { tokenApi } from "@/types/api-folder"
import { ProductType } from "@/types/product"

const PageClient = () => {
  const { isBlock, setIsBlock } = useBlock()
  const folder = useFolderFromPath()
  const showToast = useCustomToast()
  const user = useCurrentUser()

  const { data: tokenListData, isError } = useFetcher<ProductType[]>(TOKEN_API)

  const title = "Token Listesi"
  const description =
    "Token yönetimi. Token üzerinde filtreleme, sıralama ve silme yapabilirsiniz."

  const onDeleteProduct = async (productId: string) => {
    Wait().then(() => {
      setIsBlock && setIsBlock(false)
    })

    try {
      if (!user?.isAdmin) {
        showToast({
          title: "Yetkisiz İşlem",
          description: "Bu işlemi yapmaya yetkiniz bulunmamaktadır.",
          variant: "destructive",
        })
      } else {
        const [data, error] = await handleDelete(productId, tokenApi)

        if (!error) {
          mutate(TOKEN_API)
          showToast({
            title: "Silme İşlemi Başarılı",
            description: "Seçilen token başarıyla silindi.",
            variant: "success",
          })
        } else {
          console.error(`Token silme işlemi başarısız oldu. Hata: ${error}`)
          showToast({
            title: "Silme Başarısız",
            description: `Seçilen token silme işlemi başarısız oldu. Hata: ${error}`,
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error(`Token silme işlemi başarısız oldu. Hata: ${error}`)
      showToast({
        title: "Silme Başarısız",
        description: `Seçilen token silme işlemi başarısız oldu. Hata: ${error}`,
        variant: "destructive",
      })
    }
  }

  if (isError)
    return <DataError type="Seller listesi alınırken bir hata oluştu." />
  if (!tokenListData) return <Loading />

  return (
    <div className="max-w-sm md:max-w-full">
      <ProductDataTable
        tokenListData={tokenListData}
        title={title}
        folder={folder}
        description={description}
        onDeleteProduct={onDeleteProduct}
      />
    </div>
  )
}

export default memo(PageClient)
