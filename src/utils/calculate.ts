import { BigNumber } from 'bignumber.js';

export const calculatePercentage = (
    numerator: number | string,
    denominator: number | string,
    decimal = 0
): string => {
    if (denominator == 0) return '0';
    const res = new BigNumber(numerator).div(denominator).multipliedBy(100).toFixed(decimal);
    if (res.split('.')[0] === '100') return '100';
    return res;
};

export const getRoundingOffBigNumber = (value: string | number, num = 0) => {
    if (value == 0) {
        return value;
    }
    return new BigNumber(value).toFixed(num);
};

// bigNumber的加减乘除
export const bigNumberAdd = (num1: string | number, num2: string | number): string => {
    return new BigNumber(num1).plus(num2).toString();
};

export const bigNumberSubtract = (num1: string | number, num2: string | number): string => {
    return new BigNumber(num1).minus(num2).toString();
};

export const bigNumberMultiply = (num1: string | number, num2: string | number): string => {
    if (isNaN(new BigNumber(num1).multipliedBy(num2).toNumber())) {
        return '0';
    } else {
        return new BigNumber(num1).multipliedBy(num2).toString();
    }
};

export const bigNumberDivide = (num1: string | number, num2: string | number): string => {
    return new BigNumber(num1).div(num2).toString();
};

export const bigNumberSqrt = (num: string | number): string => {
    return new BigNumber(num).sqrt().toString();
};

export const bigNumberCompared = (num1: string | number, num2: string | number): string => {
    return new BigNumber(num1).comparedTo(num2).toString();
};
