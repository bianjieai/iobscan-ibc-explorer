import { floor } from 'lodash-es';
import { BigNumber } from 'bignumber.js';
import { isString } from '@/utils/objectTools';

function getRestString(string: any, left: number, right: number) {
    if (!isString(string)) return;
    if (string.length <= Number(left) + Number(right)) {
        return string;
    }
    return string ? `${string.substr(0, left)}...${right > 0 ? string.substr(-right) : ''}` : '';
}

function rmIbcPrefix(ibcHash = '') {
    return ibcHash.replace(/^ibc\/|IBC\//, '');
}

function getLasttyString(string: string) {
    return string && string.length > 20 ? `${string.substring(0, 10)}...` : string;
}

function formatLongTitleString(string: any) {
    if (!isString(string)) return string;
    return string.length > 15 ? getRestString(string, 3, 8) : string;
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
    const thousandDecimal = 0.0001;
    let result: number | string = 0;
    if (num >= trillion) {
        result = `${formatBigNumber(Math.floor(num / trillion), undefined)} T`;
    } else if (num >= billion) {
        result = `${formatBigNumber(Math.floor(num / billion), undefined)} B`;
    } else if (num >= million) {
        result = `${formatBigNumber(Math.floor(num / million), undefined)} M`;
    } else if (num >= thousand) {
        result = formatBigNumber(Math.floor(num), undefined);
    } else if (num < thousandDecimal) {
        result = `< ${thousandDecimal}`;
    } else {
        result = floor(num, 4);
    }
    return result;
}

function formatBigNumber(value: any, num: number | undefined) {
    if (value == 0) {
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
    formatBigNumber,
    formatLongTitleString
};
