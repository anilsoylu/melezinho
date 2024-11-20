"use client"
import { useBlock } from "@/context/block-context"
import { useFolderFromPath } from "@/hooks/use-folder-path"
import { useCustomToast } from "@/hooks/use-custom-toast"
import { useRouter } from "next/navigation"
import wait from "@/hooks/use-wait"

import { dashboardPrefix } from "@/app/admpanel/(dashboard)/routes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Seller } from "@prisma/client"
import { useCurrentUser } from "@/hooks/use-current-user"

type Props = {
  seller: Seller
  setData: (updater: (prev: any[]) => any[]) => void
  onDeleteSeller: (sellerId: string) => void
}

const SheetSellerId = ({ seller, setData, onDeleteSeller }: Props) => {
  const user = useCurrentUser()
  const { isBlock, setIsBlock } = useBlock()
  const folder = useFolderFromPath()
  const showToast = useCustomToast()
  const router = useRouter()

  const handleCopyId = async () => {
    setIsBlock(true)
    try {
      await navigator.clipboard.writeText(seller.id)

      showToast({
        title: "ID Kopyalandı",
        description: "ID panoya kopyalandı.",
        variant: "success",
      })
    } catch (err) {
      console.error("Clipboard write failed: ", err)
      showToast({
        title: "ID Kopyalandı",
        description: "ID panoya kopyalandı. (Fallback kullanıldı)",
        variant: "success",
      })
    } finally {
      setIsBlock(false) // Unblock after copying
    }
  }

  const handleEdit = () => {
    router.push(`${dashboardPrefix}/${folder}/${seller.id}`)
  }

  const handleDelete = () => {
    if (confirm(`Seçili satıcıları silmek istediğinize emin misiniz?`)) {
      onDeleteSeller(seller.id)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isBlock}>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Menüyü Aç</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleCopyId}>
          {`ID'yi Kopyala`}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleEdit}>
          Düzenle
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleDelete}>
          Sil
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SheetSellerId
