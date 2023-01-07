import { floor } from 'lodash-es';
import { BigNumber } from 'bignumber.js';
import { isString } from '@/utils/objectTools';
import { DEFAULT_DISPLAY_TEXT, THOUSAND_DECIMAL } from '@/constants';

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

export {
    getRestString,
    rmIbcPrefix,
    prefixInteger,
    JSONparse,
    formatNum,
    getLasttyString,
    formatBigNumber
};
