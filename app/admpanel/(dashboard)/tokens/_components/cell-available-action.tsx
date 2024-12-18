"use client"
import { useBlock } from "@/context/block-context"
import { ProductColumn } from "./columns"
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
  data: ProductColumn
  setData: (updater: (prev: any[]) => any[]) => void
}

const CellAvailableAction = ({ data, setData }: Props) => {
  const { isBlock, setIsBlock } = useBlock()
  const showToast = useCustomToast()
  const folder = useFolderFromPath()
  const { updateAvailableApi } = useApi()
  const [isPending, setIsPending] = useState(false)
  const [value, setValue] = useState(data.isActivated || false)
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
      isActivated: !value,
    })

    if (error) {
      console.error(
        `Token güncelleme işlemi başarısız oldu. Hata: ${error.message}`
      )
      showToast({
        title: "Güncelleme Başarısız",
        description: `Token durumu güncellenirken bir hata oluştu. Hata: ${error.message}`,
        variant: "destructive",
      })
      setIsPending(false)
      return
    }

    setValue(updatedData.isActivated)
    setData((prev) =>
      prev.map((token) =>
        token.id === data.id
          ? {
              ...token,
              isActivated: updatedData.isActivated,
            }
          : token
      )
    )
    mutate(TOKEN_API)

    showToast({
      title: "Token Durumu Güncellendi",
      description: `Token durumu başarıyla güncellendi. Yeni durum: ${
        updatedData.isActivated ? "Aktif" : "Pasif"
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

export default CellAvailableAction
