"use client"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

type Props = {
  type: string
  link: string
  buttonName: string
}

const Unauthorized = ({ type, link, buttonName }: Props) => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-full  bg-destructive p-4 rounded-md text-white">
      <AlertTriangle size={48} />
      <h1 className="max-w-sm text-center">
        {`Bu sayfayı ${type} yetkiniz yok. Lütfen yöneticinizle iletişime geçin.`}
      </h1>
      <Link href={link} className="underline font-semibold text-lg">
        {`${buttonName} dön`}
      </Link>
    </div>
  )
}

export default Unauthorized
