"use client"

import DataError from "@/components/data-error"
import Loading from "@/components/Loading"
import { useBlock } from "@/context/block-context"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useCustomToast } from "@/hooks/use-custom-toast"
import { useFolderFromPath } from "@/hooks/use-folder-path"
import useFetcher from "@/hooks/use-swr"
import Wait from "@/hooks/use-wait"

import { SELLER_API } from "@/types/api-list"
import SellerDataTable from "./_components/data-table"
import { Seller } from "@prisma/client"
import { handleDelete } from "@/lib/apiHelpers"
import { sellerApi } from "@/types/api-folder"
import { mutate } from "swr"

export default function PageClient() {
  const { isBlock, setIsBlock } = useBlock()
  const folder = useFolderFromPath()
  const showToast = useCustomToast()
  const user = useCurrentUser()

  const { data: sellerListData, isError } = useFetcher<Seller[]>(SELLER_API)

  const title = "Satıcı Listesi"
  const description =
    "Satıcı yönetimi. Satıcı üzerinde filtreleme, sıralama ve silme yapabilirsiniz."

  const onDeleteSeller = async (sellerId: string) => {
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
        const [data, error] = await handleDelete(sellerId, sellerApi)

        if (!error) {
          mutate(SELLER_API)
          showToast({
            title: "Silme İşlemi Başarılı",
            description: "Seçilen satıcı başarıyla silindi.",
            variant: "success",
          })
        } else {
          console.error(`Satıcı silme işlemi başarısız oldu. Hata: ${error}`)
          showToast({
            title: "Silme Başarısız",
            description: `Seçilen satıcı silme işlemi başarısız oldu. Hata: ${error}`,
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error(`Satıcı silme işlemi başarısız oldu. Hata: ${error}`)
      showToast({
        title: "Silme Başarısız",
        description: `Seçilen satıcı silme işlemi başarısız oldu. Hata: ${error}`,
        variant: "destructive",
      })
    }
  }

  if (isError)
    return <DataError type="Seller listesi alınırken bir hata oluştu." />
  if (!sellerListData) return <Loading />

  return (
    <div className="max-w-sm md:max-w-full">
      <SellerDataTable
        sellerList={sellerListData}
        title={title}
        folder={folder}
        description={description}
        onDeleteSeller={onDeleteSeller}
      />
    </div>
  )
}
