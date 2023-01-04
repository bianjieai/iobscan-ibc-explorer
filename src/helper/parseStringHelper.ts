import { floor } from 'lodash-es';
import { BigNumber } from 'bignumber.js';
import { isString } from '@/utils/objectTools';
import {
    BILLION,
    DEFAULT_DISPLAY_TEXT,
    MILLION,
    THOUNDSAND,
    THOUSAND_DECIMAL,
    TRILLION
} from '@/constants';
import { bigNumberCompared, bigNumberDivide } from '@/utils/calculate';

function getRestString(string: any, left: number, right: number) {
    if (!isString(string)) return;
    if (string.length <= Number(left) + Number(right)) {
        return string;
    }
    return string
        ? `${string.substr(0, left)}...${right > 0 ? string.substr(-right) : ''}`
        : DEFAULT_DISPLAY_TEXT;
}

function rmIbcPrefix(ibcHash = '') {
    return ibcHash.replace(/^ibc\/|IBC\//, '');
}

function getLasttyString(string: string) {
    return string && string.length > 20 ? `${string.substring(0, 10)}...` : string;
}

function prefixInteger(num: any, n: any) {
    return (Array(n).join('0') + num).slice(-n);
}

function JSONparse(val: string) {
    let result = null;
    try {
        result = JSON.parse(val);
    } catch (d) {
        result = {};
    }
    return result;
}

function formatNum(numOrigin: any) {
    const num = Number(numOrigin);
    const trillion = 1000000000000;
    const billion = 1000000000;
    const million = 1000000;
    const thousand = 1000;
    let result: number | string = 0;
    if (num >= trillion) {
        result = `${formatBigNumber(Math.floor(num / trillion), undefined)} T`;
    } else if (num >= billion) {
        result = `${formatBigNumber(Math.floor(num / billion), undefined)} B`;
    } else if (num >= million) {
        result = `${formatBigNumber(Math.floor(num / million), undefined)} M`;
    } else if (num >= thousand) {
        result = formatBigNumber(Math.floor(num), undefined);
    } else if (num < THOUSAND_DECIMAL) {
        result = `< ${THOUSAND_DECIMAL}`;
    } else {
        result = floor(num, 4);
    }
    return result;
}

function formatBigNumber(value: any, num?: number) {
    if (value == 0 || value === DEFAULT_DISPLAY_TEXT) {
        return value;
    }
    return new BigNumber(value).toFormat(num);
}

/**
 * Overview
 * @param dimensionValue 需要格式化的数据
 * @param decimal 需要保留的小数位数，默认 2
 * @returns
 */
function formatDimension(dimensionValue: string | number, decimal = 2) {
    if (dimensionValue === DEFAULT_DISPLAY_TEXT) return dimensionValue;
    const num = Number(dimensionValue);
    let result: number | string = 0;
    if (bigNumberCompared(num, TRILLION) !== '-1') {
        result = `${formatBigNumber(bigNumberDivide(num, TRILLION), decimal)}T`;
    } else if (bigNumberCompared(num, BILLION) !== '-1') {
        result = `${formatBigNumber(bigNumberDivide(num, BILLION), decimal)}B`;
    } else if (bigNumberCompared(num, MILLION) !== '-1') {
        result = `${formatBigNumber(bigNumberDivide(num, MILLION), decimal)}M`;
    } else if (bigNumberCompared(num, THOUNDSAND) !== '-1') {
        result = `${formatBigNumber(bigNumberDivide(num, THOUNDSAND), decimal)}K`;
    } else {
        result = floor(num, decimal);
    }
    return result;
}

export {
    getRestString,
    rmIbcPrefix,
    prefixInteger,
    JSONparse,
    formatNum,
    getLasttyString,
    formatBigNumber,
    formatDimension
};
