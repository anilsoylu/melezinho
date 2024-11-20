"use client"

import { ColumnDef } from "@tanstack/react-table"

import { UserAvailable } from "@/types/dashboard"
import { Checkbox } from "@/components/ui/checkbox"
import SheetSellerId from "./sheet-seller-id"
import CellAvailableAction from "./cell-available-action"

export type UserColumn = UserAvailable

export const getColumns = (
  folder: string,
  setData: (updater: (prev: any[]) => any[]) => void,
  onDeleteSeller: (sellerId: string) => void
): ColumnDef<any, any>[] => [
  {
    id: "select",
    enableResizing: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Hepsini seç"
        className="mx-4"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Satırı seç"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 30,
  },
  {
    id: "actions",
    size: 50,
    header: () => <span className="px-4">Düzenle</span>,
    cell: ({ row }) => {
      const seller = row.original

      return (
        <SheetSellerId
          seller={seller}
          setData={setData}
          onDeleteSeller={onDeleteSeller}
        />
      )
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: () => <span className="px-4">İsmi</span>,
    cell: ({ row }) => <>{row.original.name}</>,
    enableHiding: false,
  },
  {
    accessorKey: "isActivated",
    size: 50,
    header: () => <span className="px-4">Durum</span>,
    cell: ({ row }) => (
      <CellAvailableAction
        setData={setData}
        data={{
          id: row.original.id,
          isActivated: row.original.isActivated,
          name: row.original.name,
        }}
      />
    ),
  },
]
