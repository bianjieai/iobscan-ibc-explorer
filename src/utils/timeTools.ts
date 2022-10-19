import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import { formatBigNumber } from '../helper/parseStringHelper';
import { ChannelStatus, TChannelStatus } from '@/types/interface/components/table.interface';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const dayjsFormatDate = (time: dayjs.ConfigType, format = 'MM-DD HH:mm:ss') => {
    return dayjs(time).format(format);
};

/**
 *
 * @param time
 * @returns 1m ago / 1h ago / 1d ago
 */
export const formatLastUpdated = (time: string | number) => {
    if (time === 0) return '--';
    const obj = dayjs.duration(dayjs().valueOf() - Number(time) * 1000) as any;
    const { seconds, days, months, years, minutes, hours } = obj.$d;

    let ago = '';
    if (days || years || months) {
        const formatDays = formatBigNumber(days + months * 30 + years * 365, 0);
        ago = `${formatDays} ${formatDays == '1' ? 'day' : 'days'}`;
    } else if (hours) {
        ago = `${hours}h`;
    } else if (minutes) {
        ago = `${minutes}m`;
    } else if (seconds) {
        ago = `${seconds}s`;
    } else {
        ago = '0s';
    }

    return `${ago} ago`;
};

/**
 *
 * @param time seconds
 * @returns duration => xxx Days
 */
export const formatOperatingPeriod = (time: number, status: TChannelStatus) => {
    if (String(status) === ChannelStatus.CLOSED || time == 0) return '--';
    const obj = dayjs.duration(Number(time) * 1000) as any;
    const { days, months, years } = obj.$d;
    let day = days;
    if (!months && !years && time > 0) {
        day = day || 1;
    }
    return `${formatBigNumber(day + months * 30 + years * 365, 0)} days`;
};

/**
 * 根据展示的需求拼接字符串展示成 > xxdxxhxxmxxs ago 或者 xxdxxhxxmxxs ago 或者 xxdxxhxxmxxs
 */
export const formatAge = (
    currentServerTime: number,
    time: number,
    suffix: string,
    prefix: string
) => {
    const dateBegin = new Date(time);
    const dateDiff = currentServerTime - dateBegin.getTime() / 1000;
    if (dateDiff < 0) {
        return '';
    }
    const dayDiff = Math.floor(dateDiff / (24 * 3600));
    const hourLevel = dateDiff % (24 * 3600);
    const hours = Math.floor(hourLevel / 3600);
    const minuteLevel = dateDiff % 3600;
    const minutes = Math.floor(minuteLevel / 60);
    const seconds = dateDiff % 60;

    const str = `${dayDiff ? (dayDiff < 2 ? `${dayDiff} day` : `${dayDiff} days`) : ''} ${
        hours ? (hours < 2 ? `${hours} hr` : `${hours} hrs`) : ''
    } ${dayDiff ? '' : minutes ? (minutes < 2 ? `${minutes} min` : `${minutes} mins`) : ''} ${
        dayDiff || hours ? '' : seconds ? (seconds < 2 ? `${seconds} sec` : `${seconds} secs`) : ''
    }`;

    if (prefix && suffix) {
        return `${prefix} ${str} ${suffix}`;
    }
    if (suffix) {
        return `${str} ${suffix}`;
    }
    return `${str}`;
};

export const getTimestamp = () => {
    return Math.floor(new Date().getTime() / 1000);
};
