"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getColumns } from "./columns"
import { ListFilter, PlusCircle } from "lucide-react"
import SelectedDeleteRows from "./select-delete"
import { dashboardPrefix } from "@/app/admpanel/(dashboard)/routes"
import { Product } from "@prisma/client"

type Props = {
  title: string
  description: string
  folder: string
  tokenListData: Product[]
  onDeleteProduct(productId: string): void
}

type RowSelectionType = { [key: string]: boolean }

const ProductDataTable = ({
  title,
  description,
  folder,
  tokenListData,
  onDeleteProduct,
}: Props) => {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionType>({})
  const [deleteIds, setDeleteIds] = useState<string[]>([])

  const [hideData, setHideData] = useState<any[]>([])
  useEffect(() => {
    setHideData(tokenListData)
  }, [tokenListData])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  })

  const columns: ColumnDef<any, any>[] = getColumns(
    folder,
    setHideData,
    onDeleteProduct
  )

  const table = useReactTable({
    data: hideData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination,
    },
  })

  useEffect(() => {
    const newDeleteIds = Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((id) => hideData[parseInt(id)].id)
    setDeleteIds(newDeleteIds)
  }, [rowSelection, hideData])

  return (
    <div className="space-y-5">
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Token filtrele"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-7 gap-1 max-w-sm"
        />
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filtrele
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrelenmiş</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <SelectedDeleteRows
            selectedIds={deleteIds}
            setHideData={setHideData}
            setRowSelection={setRowSelection}
          />
          <Button
            size="sm"
            className="h-7 gap-1"
            onClick={() => router.push(`${dashboardPrefix}/${folder}/create`)}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              {`Ekle`}
            </span>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          width:
                            header.getSize() !== 150
                              ? header.getSize()
                              : undefined,
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        <div className="px-4">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {`Sonuç bulunamadı`}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {table.getFilteredRowModel().rows.length > 0 && (
          <CardFooter className="w-full">
            <div className="flex w-full items-center justify-between space-x-2 py-4">
              <div className="text-xs text-muted-foreground">
                {`Gösterilen`}{" "}
                <strong>
                  {table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    1}
                </strong>{" "}
                {`ile`}{" "}
                <strong>
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) *
                      table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length
                  )}
                </strong>{" "}
                {`toplam`}{" "}
                <strong>{table.getFilteredRowModel().rows.length}</strong>{" "}
                {`Kayıtlı Token`}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    table.previousPage()
                    setPagination({
                      pageIndex: table.getState().pagination.pageIndex - 1,
                      pageSize: table.getState().pagination.pageSize,
                    })
                  }}
                  disabled={!table.getCanPreviousPage()}
                >
                  {`Önceki`}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    table.nextPage()
                    setPagination({
                      pageIndex: table.getState().pagination.pageIndex + 1,
                      pageSize: table.getState().pagination.pageSize,
                    })
                  }}
                  disabled={!table.getCanNextPage()}
                >
                  {`Sonraki`}
                </Button>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

export default ProductDataTable
