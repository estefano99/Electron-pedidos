"use client"

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
import { ArrowDown, BetweenVerticalStart, CircleEllipsis, Pencil } from "lucide-react"

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
import FormAlta from "./FormAlta"
import Delete from "./Delete"
import { Ingredient } from "@/types/ingredient"

type props = {
  ingredients: Ingredient[]
}

export function IngredientTable({ ingredients }: props) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isEdit, setIsEdit] = React.useState(false);
  const [ingredientEdit, setIngredientEdit] = React.useState<Ingredient | null>(null);
  const [sortDirections, setSortDirections] = React.useState<Record<string, boolean>>({});

  const handleEdit = (ingredient: Ingredient) => {
    setIsEdit(true);
    setIngredientEdit(ingredient);
  };

  const columns: ColumnDef<Ingredient>[] = [
    {
      accessorKey: "description",
      header: ({ column }) => (
        <Button
          className="text-xs 2xl:text-sm"
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
            setSortDirections(prev => ({
              ...prev,
              description: !prev.description
            }));
          }}
        >
          Descripción
          <ArrowDown
            className={`ml-2 h-4 w-4 transition-all ${sortDirections.description ? 'rotate-180' : ''
              }`}
          />
        </Button>
      ),
    },
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
    {
      id: "actions",
      enableHiding: false,
      header: () => "Acciones",
      cell: ({ row }) => {
        const ingredient = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="ml-3 h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <CircleEllipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-center select-none">Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="focus:bg-blue-500/30 flex items-center gap-2 cursor-pointer"
                onClick={() => handleEdit(ingredient)}
              >
                <Pencil className="w-5 h-5" />
                Editar ingrediente
              </DropdownMenuItem>
              <DropdownMenuItem
                className="focus:bg-red-500/30 flex items-center gap-2"
              >
                <Delete ingredient={ingredient} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: ingredients,
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
      <div className="grid grid-cols-2 md:grid-cols-3 items-center py-4 gap-5">
        <Input
          placeholder="Filtrar por descripcion..."
          value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("description")?.setFilterValue(event.target.value)
          }
          className="w-full text-xs 2xl:text-sm"
        />
        {isEdit && ingredientEdit && (
          <FormEditar
            ingredient={ingredientEdit}
            setIsEdit={setIsEdit}
            isEdit={isEdit}
            setIngredientEdit={setIngredientEdit}
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
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-2">
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
