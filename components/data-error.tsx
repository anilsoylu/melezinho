"use client"
import { AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

type Props = {
  type: string
}

const DataError = ({ type }: Props) => {
  const router = useRouter()
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-full  bg-destructive p-4 rounded-md text-white">
      <AlertTriangle size={48} />
      <h1 className="max-w-sm text-center">{`${type} verileri yüklenirken bir hata oluştu. Lütfen yöneticinizle iletişime geçin.`}</h1>
      <Button
        onClick={() => router.back()}
        className="underline font-semibold text-lg"
        variant="link"
      >
        {`Geri Dön`}
      </Button>
    </div>
  )
}

export default DataError
