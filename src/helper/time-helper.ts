import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import { formatBigNumber } from './parseString.js'
import { ChannelStatus, TChannelStatus } from "@/components/responsive/component.interface.js";

dayjs.extend(duration)
dayjs.extend(relativeTime)


/**
 * 
 * @param time 
 * @returns 1m ago / 1h ago / 1d ago
 */
export const formatLastUpdated = (time: string | number) => {
  if (time === 0) return '--'
  const obj = dayjs.duration(dayjs().valueOf() - Number(time) * 1000) as any
  const { seconds, days, months, years, minutes, hours } = obj.$d

  let ago = ''
  if (days) {
    ago = `${formatBigNumber(days + months * 30 + years * 365, 0)}days`
  } else if (hours) {
    ago = `${hours}h`
  } else if (minutes) {
    ago = `${minutes}m`
  } else if (seconds) {
    ago = `${seconds}s`
  } else {
    ago = '0s'
  }

  return `${ago} ago`
}


/**
 * 
 * @param time seconds
 * @returns duration => xxx Days
 */
export const formatOperatingPeriod = (time: number, status: TChannelStatus) => {
  if (String(status) === ChannelStatus.CLOSED) return '--'
  const obj = dayjs.duration(Number(time) * 1000) as any
  const { days, months, years } = obj.$d
  return `${formatBigNumber(days + months * 30 + years * 365, 0)} Days`
}