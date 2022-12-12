import { UNIT_SIGNS } from '@/constants/relayers';
import { formatBigNumber } from '@/helper/parseStringHelper';

export const formatPriceAndTotalValue = (value: string, num = 2) => {
    return `${UNIT_SIGNS} ${formatBigNumber(value, num)}`;
};
