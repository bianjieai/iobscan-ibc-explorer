import { formatBigNumber } from '@/helper/parseStringHelper';
import { IHeatmapTotalInfoItem } from '@/types/interface/overview.interface';
import { BILLION, DEFAULT_DISPLAY_TEXT, MILLION, THOUNDSAND, TRILLION } from '@/constants';
import { bigNumberCompared, bigNumberDivide } from '@/utils/calculate';
// import moveDecimal from 'move-decimal-point';

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
    // todo shan  量纲转换有问题  999999 => 1000k 应该是1M
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
    const num = dimensionValue;
    let isDimension = false;
    let result = '0';
    if (bigNumberCompared(num, TRILLION) !== '-1') {
        isDimension = true;
        result = `${formatBigNumber(bigNumberDivide(num, TRILLION), decimal)}T`;
    } else if (bigNumberCompared(num, BILLION) !== '-1') {
        isDimension = true;
        result = `${formatBigNumber(bigNumberDivide(num, BILLION), decimal)}B`;
    } else if (bigNumberCompared(num, MILLION) !== '-1') {
        isDimension = true;
        result = `${formatBigNumber(bigNumberDivide(num, MILLION), decimal)}M`;
    } else if (bigNumberCompared(num, THOUNDSAND) !== '-1') {
        isDimension = true;
        result = `${formatBigNumber(bigNumberDivide(num, THOUNDSAND), decimal)}K`;
    } else {
        result = formatBigNumber(num, decimal);
    }
    return getResult(result, isDimension);
};
