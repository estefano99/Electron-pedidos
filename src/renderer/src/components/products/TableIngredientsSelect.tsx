import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowDown } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "../ui/checkbox"
import { Ingredient } from "@/types/ingredient"
import { UseFormSetValue } from "react-hook-form"

type IngredientSelected = {
  id: string;
  description: string;
  isMandatory: boolean;
}

type Props = {
  ingredientsSelected: IngredientSelected[]
  setValue: UseFormSetValue<any>; // también el setValue que usás para actualizar
}


const TableIngredientsSelect = ({ ingredientsSelected, setValue }: Props) => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [sortDirections, setSortDirections] = React.useState<Record<string, boolean>>({});

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    ingredientsSelected.forEach((ingredient, index) => {
      if (ingredient.isMandatory) {
        initial[index.toString()] = true // Establecer el valor en true para los ingredientes seleccionados
      }
    })
    return initial
  })

  React.useEffect(() => {
    const selectedIndexes = Object.keys(rowSelection).filter(key => rowSelection[parseInt(key)]) // Obtener los índices seleccionados, ejemplo: ["0", "2"]
    const selectedIds = selectedIndexes.map(index => ingredientsSelected[parseInt(index)].id)// Obtener los IDs seleccionados en base a los índices seleccionados, ejemplo: ["1", "3"]

    setValue(
      "ingredients",
      ingredientsSelected.map((ingredient) => ({ // Mapea los ingredientes seleccionados, ejemplo: [{ id: "1", description: "Ingrediente 1", isMandatory: true }]
        ...ingredient,
        isMandatory: selectedIds.includes(ingredient.id)
      }))
    )
  }, [rowSelection])


  const columns: ColumnDef<Ingredient>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
          Descripcion
          <ArrowDown
            className={`ml-2 h-4 w-4 transition-all ${sortDirections.description ? 'rotate-180' : ''
              }`}
          />
        </Button>
      ),
      filterFn: (row, columnId, filterValue) => {
        const cellValue = row.getValue(columnId);
        return String(cellValue).includes(filterValue); // Filtrado por coincidencia parcial
      },
    }
  ]

  const table = useReactTable({
    data: ingredientsSelected,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
  return (
    <div className="w-11/12 mx-auto">
      <p className="text-sm pb-2 text-yellow-400">Seleccione los ingredientes que serán obligatorios, osea no se podrán sacar del producto.</p>
      <div className="rounded-md border max-h-44 overflow-y-auto">
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
              <TableRow className="h-10">
                <TableCell
                  colSpan={columns.length}
                  className="text-center"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default TableIngredientsSelect
