"use client"
import { useState } from "react"
import useApi from "@/hooks/use-api"
import { useCustomToast } from "@/hooks/use-custom-toast"
import { useBlock } from "@/context/block-context"
import wait from "@/hooks/use-wait"

import { Button } from "@/components/ui/button"
import { MinusCircle } from "lucide-react"
import { tokenApi } from "@/types/api-folder"

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
  const { isBlock, setIsBlock } = useBlock()
  const showToast = useCustomToast()
  const { deleteMultiIdsApi } = useApi()
  const [isPending, setIsPending] = useState(false)

  const deleteSelectedTokens = async () => {
    wait().then(() => {
      setIsBlock && setIsBlock(false)
    })
    setIsPending(true)
    setIsBlock && setIsBlock(true)

    try {
      if (
        confirm(
          "Seçili tokenları silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        )
      ) {
        const [data, error] = await deleteMultiIdsApi(
          selectedIds.join(","),
          tokenApi
        )
        if (error) {
          throw new Error(
            `Tokenlerı silme işlemi başarısız oldu. Hata: ${error.message}`
          )
        }
        setHideData((prev) =>
          prev.filter((user) => !selectedIds.includes(user.id))
        )
        setRowSelection(() => {
          return {}
        })

        showToast({
          title: `Tokenler başarıyla silindi`,
          description: `Seçili tokenler başarıyla silindi.`,
          variant: "success",
        })
      }
    } catch (error) {
      console.log(`Seçili tokenler silinirken bir hata oluştu. Hata: ${error}`)
      showToast({
        title: `Seçili Tokenler Silinemedi`,
        description: `Seçili tokenler silinirken bir hata oluştu. Hata: ${error}`,
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button
      disabled={isPending || !selectedIds.length}
      onClick={deleteSelectedTokens}
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
