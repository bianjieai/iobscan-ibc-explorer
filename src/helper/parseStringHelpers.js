import { floor } from 'lodash-es';
import { BigNumber } from 'bignumber.js';
import { isString } from '../utils/objectTools';

function getRestString(string, left, right) {
    if (!isString(string)) return;
    if (string.length < Number(left) + Number(right)) {
        return string;
    }
    return string ? `${string.substr(0, left)}...${right > 0 ? string.substr(-right) : ''}` : '';
}

function rmIbcPrefix(ibcHash = '') {
    return ibcHash.replace(/^ibc\/|IBC\//, '');
}

function getLasttyString(string) {
    return string && string.length > 20 ? `${string.substr(0, 10)}...` : string;
}

function getRestString2(string, length) {
    if (!isString(string) || String(string).length <= length) return string;
    return `${string.substr(0, length)}...`;
}

function formatLongTitleString(string) {
    if (!isString(string)) return string;
    return string.length > 15 ? getRestString(string, 3, 8) : string;
}

function prefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}

function JSONparse(val) {
    let result = null;
    try {
        result = JSON.parse(val);
    } catch (d) {
        result = {};
    }
    return result;
}

function formatNum(numOrigin) {
    const num = Number(numOrigin);
    const trillion = 1000000000000;
    const billion = 1000000000;
    const million = 1000000;
    const thousand = 1000;
    const thousandDecimal = 0.0001;
    let result = 0;
    if (num >= trillion) {
        result = `${formatBigNumber(Math.floor(num / trillion))} T`;
    } else if (num >= billion) {
        result = `${formatBigNumber(Math.floor(num / billion))} B`;
    } else if (num >= million) {
        result = `${formatBigNumber(Math.floor(num / million))} M`;
    } else if (num >= thousand) {
        result = formatBigNumber(Math.floor(num));
    } else if (num <= thousandDecimal) {
        result = `< ${thousandDecimal}`;
    } else {
        result = floor(num, 4);
    }
    return result;
}

function formatBigNumber(value, num) {
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
    getRestString2,
    formatLongTitleString
};
