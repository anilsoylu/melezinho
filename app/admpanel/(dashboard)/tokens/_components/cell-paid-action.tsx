"use client"
import { useBlock } from "@/context/block-context"
import { ProductColumnPaid } from "./columns"
import { useFolderFromPath } from "@/hooks/use-folder-path"
import useApi from "@/hooks/use-api"
import { useState } from "react"
import { useCustomToast } from "@/hooks/use-custom-toast"
import Wait from "@/hooks/use-wait"
import { useCurrentUser } from "@/hooks/use-current-user"

import { Switch } from "@/components/ui/switch"
import { mutate } from "swr"
import { TOKEN_API } from "@/types/api-list"
import { tokenApi } from "@/types/api-folder"

type Props = {
  data: ProductColumnPaid
  setData: (updater: (prev: any[]) => any[]) => void
}

const CellPaidAction = ({ data, setData }: Props) => {
  const { isBlock, setIsBlock } = useBlock()
  const showToast = useCustomToast()
  const folder = useFolderFromPath()
  const { updateAvailableApi } = useApi()
  const [isPending, setIsPending] = useState(false)
  const [value, setValue] = useState(data.isPaid || false)
  const user = useCurrentUser()

  const onChange = async () => {
    Wait().then(() => {
      setIsBlock && setIsBlock(false)
    })
    setIsPending(true)
    setIsBlock && setIsBlock(true)

    if (!user?.isAdmin) {
      showToast({
        title: "Yetkisiz İşlem",
        description: "Bu işlemi yapmaya yetkiniz bulunmamaktadır.",
        variant: "destructive",
      })
      setIsPending(false)
      return
    }

    const [updatedData, error] = await updateAvailableApi(data.id, tokenApi, {
      isPaid: !value,
    })

    if (error) {
      console.error(
        `Token ödeme durumu işlemi başarısız oldu. Hata: ${error.message}`
      )
      showToast({
        title: "Güncelleme Başarısız",
        description: `Token ödeme durumu güncellenirken bir hata oluştu. Hata: ${error.message}`,
        variant: "destructive",
      })
      setIsPending(false)
      return
    }

    setValue(updatedData.isPaid)
    setData((prev) =>
      prev.map((token) =>
        token.id === data.id
          ? {
              ...token,
              isPaid: updatedData.isPaid,
            }
          : token
      )
    )
    mutate(TOKEN_API)

    showToast({
      title: "Token Ödeme Durumu Güncellendi",
      description: `Token ödeme durumu başarıyla güncellendi. Yeni durum: ${
        updatedData.isPaid ? "Aktif" : "Pasif"
      }`,
      variant: "success",
    })

    setIsPending(false)
  }

  return (
    <Switch
      disabled={!user?.isAdmin || isPending || isBlock}
      checked={value}
      onCheckedChange={onChange}
    />
  )
}

export default CellPaidAction
