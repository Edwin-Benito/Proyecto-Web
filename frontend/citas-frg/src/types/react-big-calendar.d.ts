declare module 'react-big-calendar' {
  import { ComponentType } from 'react'

  export interface Event {
    title: string
    start: Date
    end: Date
    resource?: any
    [key: string]: any
  }

  export interface CalendarProps<TEvent extends Event = Event> {
    localizer: any
    events: TEvent[]
    startAccessor?: string | ((event: TEvent) => Date)
    endAccessor?: string | ((event: TEvent) => Date)
    titleAccessor?: string | ((event: TEvent) => string)
    culture?: string
    messages?: Record<string, string>
    style?: React.CSSProperties
    className?: string
    selectable?: boolean | 'ignoreEvents'
    onSelectSlot?: (slotInfo: { start: Date; end: Date; slots: Date[] }) => void
    onSelectEvent?: (event: TEvent) => void
    eventPropGetter?: (event: TEvent) => { style?: React.CSSProperties; className?: string }
    defaultView?: 'month' | 'week' | 'day' | 'agenda'
    views?: string[] | { month?: boolean; week?: boolean; day?: boolean; agenda?: boolean }
    [key: string]: any
  }

  export const Calendar: ComponentType<CalendarProps>

  export interface Localizer {
    format(value: Date, format: string, culture?: string): string
    parse(value: string, format: string, culture?: string): Date
    startOf(date: Date, unit: string): Date
    endOf(date: Date, unit: string): Date
    range(start: Date, end: Date, unit?: string): Date[]
    [key: string]: any
  }

  export function dateFnsLocalizer(config: {
    format: (date: Date, formatStr: string, options?: any) => string
    parse: (dateStr: string, formatStr: string, referenceDate: Date, options?: any) => Date
    startOfWeek: (date: Date, options?: any) => Date
    getDay: (date: Date) => number
    locales?: Record<string, any>
  }): Localizer

  export default Calendar
}
