"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Available, ProductPaid } from "@/types/dashboard"
import { Checkbox } from "@/components/ui/checkbox"
import SheetProductId from "./sheet-product-id"
import CellAvailableAction from "./cell-available-action"
import CellPaidAction from "./cell-paid-action"

export type ProductColumn = Available
export type ProductColumnPaid = ProductPaid

export const getColumns = (
  folder: string,
  setData: (updater: (prev: any[]) => any[]) => void,
  onDeleteProduct: (productId: string) => void
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
      const product = row.original

      return (
        <SheetProductId
          data={product}
          setData={setData}
          onDeleteProduct={onDeleteProduct}
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
    accessorKey: "isPaid",
    size: 50,
    header: () => <span className="px-4">Ödeme</span>,
    cell: ({ row }) => (
      <CellPaidAction
        setData={setData}
        data={{
          id: row.original.id,
          isPaid: row.original.isPaid,
          title: row.original.title,
        }}
      />
    ),
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
          title: row.original.title,
        }}
      />
    ),
  },
]
