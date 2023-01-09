import { BigNumber } from 'bignumber.js';
import { formatBigNumber } from '@/helper/parseStringHelper';
import { IHeatmapTotalInfoItem } from '@/types/interface/overview.interface';
import { BILLION, DEFAULT_DISPLAY_TEXT, MILLION, THOUNDSAND, TRILLION } from '@/constants';
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
        if (bigNumberCompared(value, TRILLION) !== '-1') {
            moveLength = 12;
        } else if (bigNumberCompared(value, BILLION) !== '-1') {
            moveLength = 9;
        } else if (bigNumberCompared(value, MILLION) !== '-1') {
            moveLength = 6;
        } else if (bigNumberCompared(value, THOUNDSAND) !== '-1') {
            moveLength = 3;
        } else {
            moveLength = 0;
        }
        const temp = new BigNumber(value).shiftedBy(-moveLength).toFixed(decimal);
        const result = new BigNumber(temp).shiftedBy(moveLength).toString();
        return result;
    };
    const value = handleResult(String(dimensionValue), decimal);
    let result;
    if (bigNumberCompared(value, TRILLION) !== '-1') {
        isDimension = true;
        result = `${formatBigNumber(bigNumberDivide(value, TRILLION), decimal)}T`;
    } else if (bigNumberCompared(value, BILLION) !== '-1') {
        isDimension = true;
        result = `${formatBigNumber(bigNumberDivide(value, BILLION), decimal)}B`;
    } else if (bigNumberCompared(value, MILLION) !== '-1') {
        isDimension = true;
        result = `${formatBigNumber(bigNumberDivide(value, MILLION), decimal)}M`;
    } else if (bigNumberCompared(value, THOUNDSAND) !== '-1') {
        isDimension = true;
        result = `${formatBigNumber(bigNumberDivide(value, THOUNDSAND), decimal)}K`;
    } else {
        result = formatBigNumber(value, decimal);
    }
    return getResult(result, isDimension);
};
