import { BigNumber } from 'bignumber.js';
import { formatBigNumber } from '@/helper/parseStringHelper';
import { IHeatmapTotalInfoItem } from '@/types/interface/overview.interface';
import { BIG_UNIT, DEFAULT_DISPLAY_TEXT } from '@/constants';
import { bigNumberCompared, bigNumberDivide } from '@/utils/calculate';

/**
 * 此处四舍五入
 * @param dimensionValue 需要格式化的数据
 * @param decimal 需要保留的小数位数，默认 2
 * @returns
 */
export const formatDimension = (
    dimensionValue: string | number,
    decimal = 2,
    isNeedDimension = false
): IHeatmapTotalInfoItem | string => {
    const getResult = (
        dimensionValue: string | number,
        isDimension: boolean
    ): IHeatmapTotalInfoItem | string => {
        if (isNeedDimension) {
            return {
                result: String(dimensionValue),
                isDimension: isDimension
            };
        } else {
            return String(dimensionValue);
        }
    };
    if (dimensionValue === DEFAULT_DISPLAY_TEXT) return getResult(dimensionValue, false);
    let isDimension = false;
    const handleResult = (value: string, decimal: number) => {
        let moveLength;
        // todo dj 待优化
        if (bigNumberCompared(value, BIG_UNIT.decillion.value) !== '-1') {
            moveLength = BIG_UNIT.decillion.moveLength;
        } else if (bigNumberCompared(value, BIG_UNIT.nonillion.value) !== '-1') {
            moveLength = BIG_UNIT.nonillion.moveLength;
        } else if (bigNumberCompared(value, BIG_UNIT.octillion.value) !== '-1') {
            moveLength = BIG_UNIT.octillion.moveLength;
        } else if (bigNumberCompared(value, BIG_UNIT.septillion.value) !== '-1') {
            moveLength = BIG_UNIT.septillion.moveLength;
        } else if (bigNumberCompared(value, BIG_UNIT.sextillion.value) !== '-1') {
            moveLength = BIG_UNIT.sextillion.moveLength;
        } else if (bigNumberCompared(value, BIG_UNIT.quintillion.value) !== '-1') {
            moveLength = BIG_UNIT.quintillion.moveLength;
        } else if (bigNumberCompared(value, BIG_UNIT.quadrillion.value) !== '-1') {
            moveLength = BIG_UNIT.quadrillion.moveLength;
        } else if (bigNumberCompared(value, BIG_UNIT.trullion.value) !== '-1') {
            moveLength = BIG_UNIT.trullion.moveLength;
        } else if (bigNumberCompared(value, BIG_UNIT.billion.value) !== '-1') {
            moveLength = BIG_UNIT.billion.moveLength;
        } else if (bigNumberCompared(value, BIG_UNIT.million.value) !== '-1') {
            moveLength = BIG_UNIT.million.moveLength;
        } else if (bigNumberCompared(value, BIG_UNIT.thoundsand.value) !== '-1') {
            moveLength = BIG_UNIT.thoundsand.moveLength;
        } else {
            moveLength = 0;
        }
        const temp = new BigNumber(value).shiftedBy(-moveLength).toFixed(decimal);
        const result = new BigNumber(temp).shiftedBy(moveLength).toString();
        return result;
    };
    const value = handleResult(String(dimensionValue), decimal);
    let result;
    // todo dj 待优化
    if (bigNumberCompared(value, BIG_UNIT.decillion.value) !== '-1') {
        isDimension = true;
        result = `${formatBigNumber(bigNumberDivide(value, BIG_UNIT.decillion.value), decimal)}${
            BIG_UNIT.decillion.unit
        }`;
    } else if (bigNumberCompared(value, BIG_UNIT.nonillion.value) !== '-1') {
        isDimension = true;
        result = `${formatBigNumber(bigNumberDivide(value, BIG_UNIT.nonillion.value), decimal)}${
            BIG_UNIT.nonillion.unit
        }`;
    } else if (bigNumberCompared(value, BIG_UNIT.octillion.value) !== '-1') {
        isDimension = true;
        result = `${formatBigNumber(bigNumberDivide(value, BIG_UNIT.octillion.value), decimal)}${
            BIG_UNIT.octillion.unit
        }`;
    } else if (bigNumberCompared(value, BIG_UNIT.septillion.value) !== '-1') {
        isDimension = true;
        result = `${formatBigNumber(bigNumberDivide(value, BIG_UNIT.septillion.value), decimal)}${
            BIG_UNIT.septillion.unit
        }`;
    } else if (bigNumberCompared(value, BIG_UNIT.sextillion.value) !== '-1') {
        isDimension = true;
        result = `${formatBigNumber(bigNumberDivide(value, BIG_UNIT.sextillion.value), decimal)}${
            BIG_UNIT.sextillion.unit
        }`;
    } else if (bigNumberCompared(value, BIG_UNIT.quintillion.value) !== '-1') {
        isDimension = true;
        result = `${formatBigNumber(bigNumberDivide(value, BIG_UNIT.quintillion.value), decimal)}${
            BIG_UNIT.quintillion.unit
        }`;
    } else if (bigNumberCompared(value, BIG_UNIT.quadrillion.value) !== '-1') {
        isDimension = true;
        result = `${formatBigNumber(bigNumberDivide(value, BIG_UNIT.quadrillion.value), decimal)}${
            BIG_UNIT.quadrillion.unit
        }`;
    } else if (bigNumberCompared(value, BIG_UNIT.trullion.value) !== '-1') {
        isDimension = true;
        result = `${formatBigNumber(bigNumberDivide(value, BIG_UNIT.trullion.value), decimal)}${
            BIG_UNIT.trullion.unit
        }`;
    } else if (bigNumberCompared(value, BIG_UNIT.billion.value) !== '-1') {
        isDimension = true;
        result = `${formatBigNumber(bigNumberDivide(value, BIG_UNIT.billion.value), decimal)}${
            BIG_UNIT.billion.unit
        }`;
    } else if (bigNumberCompared(value, BIG_UNIT.million.value) !== '-1') {
        isDimension = true;
        result = `${formatBigNumber(bigNumberDivide(value, BIG_UNIT.million.value), decimal)}${
            BIG_UNIT.million.unit
        }`;
    } else if (bigNumberCompared(value, BIG_UNIT.thoundsand.value) !== '-1') {
        isDimension = true;
        result = `${formatBigNumber(bigNumberDivide(value, BIG_UNIT.thoundsand.value), decimal)}${
            BIG_UNIT.thoundsand.unit
        }`;
    } else {
        result = formatBigNumber(value, decimal);
    }
    return getResult(result, isDimension);
};
