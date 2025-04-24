import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, BetweenVerticalStart, CircleEllipsis, Delete, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import FormEditar from "./FormEditar"
import { ProductWithIngredients } from "@/types/product"
import FormAlta from "./FormAlta"
import { formatPrice } from "@/lib/functions"

type Props = {
  products: ProductWithIngredients[];
}

export function ProductTable({ products }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isEdit, setIsEdit] = React.useState(false);
  const [productEdit, setProductEdit] = React.useState<ProductWithIngredients | null>(null);

  const handleEdit = (product: ProductWithIngredients) => {
    setIsEdit(true);
    setProductEdit(product);
  };

  const columns: ColumnDef<ProductWithIngredients>[] = [

    // Nombre
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
      filterFn: (row, columnId, filterValue) =>
        String(row.getValue(columnId)).toLowerCase().includes(String(filterValue).toLowerCase()),
    },

    // Descripción
    {
      accessorKey: "description",
      header: () => <span className="text-sm">Descripción</span>,
      cell: ({ row }) => (
        <span className="text-xs line-clamp-2">{row.getValue("description")}</span>
      ),
    },

    // Precio unitario
    {
      accessorKey: "unitaryPrice",
      header: () => <div className="text-center text-sm">Precio</div>,
      cell: ({ row }) => {
        const price: number = row.getValue("unitaryPrice")
        return (
          <div className="text-center">
            {formatPrice(price)}
          </div>
        )
      },
    },

    // Activo / Inactivo
    {
      accessorKey: "isActive",
      header: () => <span className="text-sm">Estado</span>,
      cell: ({ row }) => (
        <span
          className={
            row.getValue("isActive")
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }
        >
          {row.getValue("isActive") ? "Activo" : "Inactivo"}
        </span>
      ),
      filterFn: (row, columnId, filterValue) =>
        String(row.getValue(columnId)) === String(filterValue),
    },

    // Categoría
    {
      id: "category",
      accessorFn: row => row.category.description,
      header: () => <span className="text-sm">Categoría</span>,
      cell: ({ row }) => <span className="lowercase">{row.getValue("category")}</span>,
    },

    // Acciones
    {
      id: "actions",
      header: () => <span className="text-sm">Acciones</span>,
      cell: ({ row }) => {
        const product = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <CircleEllipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-center">Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => handleEdit(product)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="focus:bg-red-500/30 flex items-center gap-2"
              >
                <Delete product={product} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: products,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: { pagination: { pageSize: 10 } },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-11/12 mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 items-center py-4 gap-5">
        <Input
          placeholder="Filtrar por nombre..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="w-full text-xs 2xl:text-sm"
        />
        <Input
          placeholder="Filtrar por categoria..."
          value={(table.getColumn("category")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("category")?.setFilterValue(event.target.value)
          }
          className="w-full text-xs 2xl:text-sm"
        />
        {isEdit && productEdit && (
          <FormEditar
            product={productEdit}
            setIsEdit={setIsEdit}
            isEdit={isEdit}
            setProductEdit={setProductEdit}
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="h-8.5 2xl:h-10">
            <Button variant="outline" className="ml-auto">
              <BetweenVerticalStart className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
        <FormAlta />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                    <TableCell className="py-[5px]" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableHeader className="h-10">
                <TableCell
                  colSpan={columns.length}
                  className="text-center"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableHeader>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} filas seleccionadas.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-xs 2xl:text-sm h-7"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="text-xs 2xl:text-sm h-7"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
