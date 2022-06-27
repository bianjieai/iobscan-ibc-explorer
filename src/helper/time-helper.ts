import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import { formatBigNumber } from './parseString.js'

dayjs.extend(duration)
dayjs.extend(relativeTime)


/**
 * 
 * @param time 
 * @returns 1m ago / 1h ago / 1d ago
 */
export const formatLastUpdated = (time: string | number) => {
  const obj = dayjs.duration(dayjs().valueOf() - Number(time)) as any
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
    ago = 'unknown time'
  }

  return `${ago} ago`
}


/**
 * 
 * @param time seconds
 * @returns duration => xxx Days
 */
export const formatOperatingPeriod = (time: number) => {
  const obj = dayjs.duration(Number(time) * 1000) as any
  const { days, months, years } = obj.$d
  return `${days + months * 30 + years * 365} Days`
}