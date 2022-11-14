import { BigNumber } from 'bignumber.js';

export const calculatePercentage = (
    numerator: number | string,
    denominator: number | string
): string => {
    if (denominator == 0) return '0';
    const res = BigNumber(numerator).div(denominator).multipliedBy(100).toFixed(0);
    return res;
};
