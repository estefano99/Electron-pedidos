import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { es } from 'date-fns/locale';
import { useMemo } from "react";

function roundUpTo15(d: Date) {
  const time = 15 * 60 * 1000
  return new Date(Math.ceil(d.getTime() / time) * time)
}

function startOfDay(date: Date) {
  const startDay = new Date(date)
  startDay.setHours(0, 0, 0, 0)
  return startDay
}

function endOfDay(date: Date) {
  const endDate = new Date(date)
  endDate.setHours(23, 59, 59, 999)
  return endDate
}

function isSameDay(dateSelected: Date, today: Date) {
  return (
    dateSelected.getFullYear() === today.getFullYear() &&
    dateSelected.getMonth() === today.getMonth() &&
    dateSelected.getDate() === today.getDate()
  )
}

const CalendarScheduleTime = ({ scheduledTime, setScheduledTime }) => {

  // redondeado hacia arriba a 15
  const nowRounded = useMemo(() => roundUpTo15(new Date()), [])

  const today = new Date()
  const selectedIsToday = scheduledTime ? isSameDay(scheduledTime, today) : false

  // minTime / maxTime se aplican al DÍA SELECCIONADO
  const minTime = selectedIsToday ? nowRounded : startOfDay(scheduledTime ?? today)
  const maxTime = endOfDay(scheduledTime ?? today)

  return (
    <DatePicker
      selected={scheduledTime ?? nowRounded}// arranca en el siguiente 15'
      onChange={(date) => {
        if (!date) return setScheduledTime(null)
        setScheduledTime(roundUpTo15(date)) // por si el usuario hace click entre intervalos, siempre ajustamos a 15'
      }}
      onCalendarOpen={() => {
        if (!scheduledTime) setScheduledTime(nowRounded) // si estaba vacío, seteamos el default al abrir
      }}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
      dateFormat="dd/MM/yyyy HH:mm"
      locale={es}
      className="w-full text-sm px-3 py-2 rounded-md border border-input bg-background text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      placeholderText="Seleccionar fecha y hora"
      minDate={today}//No permitir fechas pasadas
      // ⛔ Si el día seleccionado es hoy, bloquear horas previas a nowRounded
      minTime={minTime}
      maxTime={maxTime}
      // Extra belt-and-suspenders: filtra cada opción de tiempo
      filterTime={(time: Date) => {
        const n = new Date()
        const nRounded = roundUpTo15(n)
        return time.getTime() >= nRounded.getTime()
      }}
    />
  )
}

export default CalendarScheduleTime
