"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
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
import { CalendarIcon, ListFilter, PlusCircle } from "lucide-react"
import SelectedDeleteRows from "./select-delete"
import { dashboardPrefix } from "@/app/admpanel/(dashboard)/routes"
import { ProductType } from "@/types/product"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  addDays,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  startOfMonth,
  subMonths,
} from "date-fns"
import { tr } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Props = {
  title: string
  description: string
  folder: string
  tokenListData: ProductType[]
  onDeleteProduct(productId: string): void
}

type RowSelectionType = { [key: string]: boolean }

type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

const ProductDataTable = ({
  title,
  description,
  folder,
  tokenListData,
  onDeleteProduct,
}: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionType>({})
  const [deleteIds, setDeleteIds] = useState<string[]>([])
  const [filteredData, setFilteredData] = useState<any[]>(tokenListData)

  const [hideData, setHideData] = useState<any[]>([])
  useEffect(() => {
    setHideData(filteredData)
  }, [filteredData])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  })

  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(subMonths(new Date(), 3)), // Bulunduğumuz tarihten 3 ay önceki ayın ilk günü
    to: endOfMonth(new Date()), // Bulunduğumuz ayın son günü
  })

  useEffect(() => {
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    setDate({
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    })
  }, [searchParams])

  const handleDateChange = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate)

    if (!selectedDate?.from && !selectedDate?.to) {
      setFilteredData(tokenListData) // Tüm veriler
    } else {
      setFilteredData(
        tokenListData.filter((item) => {
          const itemDate = new Date(item.date)
          return (
            (!selectedDate.from || isAfter(itemDate, selectedDate.from)) &&
            (!selectedDate.to ||
              isBefore(itemDate, addDays(selectedDate.to, 1)))
          )
        })
      )
    }
  }

  // Ödeme durumu filtresi
  const handlePaymentFilter = (isPaid: boolean) => {
    setFilteredData(tokenListData.filter((item) => item.isPaid === isPaid))
  }

  const handleActivationFilter = (isActivated: boolean) => {
    setFilteredData(
      tokenListData.filter((item) => item.isActivated === isActivated)
    )
  }

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
    if (!date?.from && !date?.to) {
      setHideData(tokenListData)
    } else {
      setHideData(
        tokenListData.filter((item) => {
          const itemDate = new Date(item.date)
          return (
            (!date.from || isAfter(itemDate, date.from)) &&
            (!date.to || isBefore(itemDate, addDays(date.to, 1))) // Tarih aralığına dahil et
          )
        })
      )
    }
  }, [date, tokenListData])

  useEffect(() => {
    const newDeleteIds = Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((id) => hideData[parseInt(id)].id)
    setDeleteIds(newDeleteIds)
  }, [rowSelection, hideData])

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              id="date"
              variant={"outline"}
              className={cn(
                "w-full lg:w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y", {
                      locale: tr,
                    })}
                    -{" "}
                    {format(date.to, "LLL dd, y", {
                      locale: tr,
                    })}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateChange as any}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-full lg:w-auto gap-1"
            >
              <ListFilter className="h-3.5 w-3.5" />
              <span className="sm:whitespace-nowrap">Ödeme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrelenmiş</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              className="capitalize"
              onCheckedChange={() => handlePaymentFilter(true)} // Ödenmiş kayıtları göster
            >
              Paid (Ödenmiş)
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className="capitalize"
              onCheckedChange={() => handlePaymentFilter(false)} // Ödenmemiş kayıtları göster
            >
              Unpaid (Ödenmemiş)
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              className="capitalize"
              onCheckedChange={() => setFilteredData(tokenListData)} // Tüm verileri göster
            >
              Clear Filter (Filtreyi Temizle)
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 w-full lg:w-auto"
            >
              <ListFilter className="h-3.5 w-3.5" />
              <span className="sm:whitespace-nowrap">Aktif / Pasif</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrelenmiş</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              className="capitalize"
              onCheckedChange={() => handleActivationFilter(true)}
            >
              Active (Aktif)
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className="capitalize"
              onCheckedChange={() => handleActivationFilter(false)}
            >
              Inactive (Pasif)
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              className="capitalize"
              onCheckedChange={() => setFilteredData(tokenListData)}
            >
              Clear Filter (Filtreyi Temizle)
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="ml-auto flex items-center gap-2">
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
