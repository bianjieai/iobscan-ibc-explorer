import { UNIT_SIGNS } from '@/constants/relayers';
import { formatBigNumber } from '@/helper/parseStringHelper';

export const formatPriceAndTotalValue = (value: string, num = 2) => {
    let format = formatBigNumber(value, num);
    if (format == 0) {
        format = '0';
    }
    return `${UNIT_SIGNS} ${format}`;
};
