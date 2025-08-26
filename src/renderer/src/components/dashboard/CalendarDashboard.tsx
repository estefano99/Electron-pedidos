import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "../ui/button"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "../ui/calendar"
import { cn } from "@/lib/utils"
import { formatDateHelper } from "@/lib/functions"
import { es } from "date-fns/locale"

const CalendarDashboard = ({calendarOpen, setCalendarOpen, selectedDate, setSelectedDate}) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? formatDateHelper(selectedDate) : "Seleccionar fecha"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                setSelectedDate(date)
                setCalendarOpen(false)
              }
            }}
            disabled={(date) => date > new Date() || date < new Date("2024-01-01")}
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default CalendarDashboard
