"use client"
import { useState } from "react"
import useApi from "@/hooks/use-api"
import { useCustomToast } from "@/hooks/use-custom-toast"
import { useFolderFromPath } from "@/hooks/use-folder-path"
import { useBlock } from "@/context/block-context"
import wait from "@/hooks/use-wait"

import { Button } from "@/components/ui/button"
import { MinusCircle } from "lucide-react"
import { useCurrentUser } from "@/hooks/use-current-user"
import { sellerApi } from "@/types/api-folder"

type Props = {
  selectedIds: string[]
  setHideData: (updater: (prev: any[]) => any[]) => void
  setRowSelection: (updater: (prev: any) => any) => void
}

const SelectedDeleteRows = ({
  selectedIds,
  setRowSelection,
  setHideData,
}: Props) => {
  const user = useCurrentUser()
  const { isBlock, setIsBlock } = useBlock()
  const folder = useFolderFromPath()
  const showToast = useCustomToast()
  const { deleteMultiIdsApi } = useApi()
  const [isPending, setIsPending] = useState(false)

  const deleteSelectedUsers = async () => {
    wait().then(() => {
      setIsBlock && setIsBlock(false)
    })
    setIsPending(true)
    setIsBlock && setIsBlock(true)

    try {
      if (
        confirm(
          "Seçili kullanıcıları silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        )
      ) {
        const [data, error] = await deleteMultiIdsApi(
          selectedIds.join(","),
          sellerApi
        )
        if (error) {
          throw new Error(
            `Kullanıcı silme işlemi başarısız oldu. Hata: ${error.message}`
          )
        }
        setHideData((prev) =>
          prev.filter((user) => !selectedIds.includes(user.id))
        )
        setRowSelection(() => {
          return {}
        })

        showToast({
          title: `Kullanıcılar başarıyla silindi`,
          description: `Seçili kullanıcılar başarıyla silindi.`,
          variant: "success",
        })
      }
    } catch (error) {
      console.log(
        `Seçili kullanıcılar silinirken bir hata oluştu. Hata: ${error}`
      )
      showToast({
        title: `Seçili Kullanıcılar Silinemedi`,
        description: `Seçili kullanıcılar silinirken bir hata oluştu. Hata: ${error}`,
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button
      disabled={isPending || !selectedIds.length}
      onClick={deleteSelectedUsers}
      className="bg-destructive hover:bg-red-900/40 text-white h-7 gap-1"
    >
      <MinusCircle className="h-3.5 w-3.5" />
      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
        {`Seçilenleri Sil`}
      </span>
    </Button>
  )
}

export default SelectedDeleteRows
