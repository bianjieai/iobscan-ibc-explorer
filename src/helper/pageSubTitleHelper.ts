import { TOTAL_BOUND } from '@/constants';
import { formatBigNumber } from './parseStringHelper';

export const formatSubTitle = (
    isHaveParams: boolean,
    total: number,
    conditionCount: number,
    unit: string
) => {
    if (total <= TOTAL_BOUND) {
        if (!isHaveParams) {
            return `A total of ${formatBigNumber(total, 0)} ${unit} found`;
        }
        return `${formatBigNumber(conditionCount, 0)} of the ${formatBigNumber(
            total,
            0
        )} ${unit} found`;
    } else {
        if (!isHaveParams) {
            return `Last 500k ${unit} found`;
        } else {
            if (conditionCount === TOTAL_BOUND) {
                return `Last 500k ${unit} found`;
            }
            return `${formatBigNumber(conditionCount, 0)} of the last 500k ${unit} found`;
        }
    }
};
