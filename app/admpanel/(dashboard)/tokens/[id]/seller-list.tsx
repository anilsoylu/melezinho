"use client"
import { FormControl } from "@/components/ui/form"
import { Dispatch, SetStateAction, useCallback } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SellerType } from "@/types/product"

type Props = {
  field: any
  sellerId: string
  setSellerId: Dispatch<SetStateAction<string>>
  disabled?: boolean
  sellerData: SellerType[]
}

const SellersList = ({
  field,
  sellerData,
  sellerId,
  setSellerId,
  disabled,
}: Props) => {
  const handleValueChange = useCallback(
    (value: string) => {
      setSellerId(value)
      if (typeof field.onChange === "function") {
        field.onChange(value)
      } else {
        console.error("field.onChange is not a function")
      }
    },
    [field, setSellerId]
  )

  return (
    <Select
      disabled={disabled}
      onValueChange={handleValueChange}
      defaultValue={field.value}
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="Satıcı Seçiniz" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {sellerData.map((seller) => (
          <SelectItem key={seller.id} value={seller.id}>
            {seller.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SellersList
