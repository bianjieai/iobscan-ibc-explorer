/**
 * @description format tableCell
 */

import { IBaseDenom } from '@/types/interface/index.interface';
import { formatBigNumber } from './parseStringHelper';
import moveDecimal from 'move-decimal-point';
/**
 *
 * @param price 价格 不超过10w
 * @param numberOfDecimal 4位小数
 * @returns $ xxx
 */

export const formatPrice = (price: number | string, numberOfDecimal: number | undefined = 4) => {
    if (price === -1 || price === '-1') {
        return '--';
    }
    return `${formatBigNumber(Number(price), numberOfDecimal)}`;
};

const getScale = (denom?: string, baseDenomData?: IBaseDenom[]) => {
    if (Array.isArray(baseDenomData) && denom) {
        const filterData = baseDenomData.filter((item) => item.denom === denom);
        if (filterData.length > 0) {
            return filterData[0].scale ?? 0;
        } else {
            return 0;
        }
    } else {
        return 0;
    }
};

export const formatSupply = (
    supply: number | string,
    denom: string,
    baseDenomData: IBaseDenom[],
    numberOfDecimal = 2,
    isformat = true
) => {
    if ((supply === -1 || supply === '-1') && isformat) {
        return '--';
    }
    const scale = getScale(denom, baseDenomData);
    let result = '';

    if (scale > 0) {
        // result = Number(supply) / Math.pow(10, scale)
        result = moveDecimal(supply.toString(), -scale);
    } else {
        result = supply.toString();
    }
    return isformat ? formatBigNumber(result, numberOfDecimal) : result;
};

export const formatAmount = (
    amount: number | string,
    denom?: string,
    baseDenomData?: IBaseDenom[],
    numberOfDecimal = 2
) => {
    if (amount === -1 || amount === '-1' || amount === '') {
        return {
            title: '--',
            popover: '--'
        };
    }
    if (!denom && !baseDenomData) {
        return {
            title: formatBigNumber(amount, numberOfDecimal),
            popover: formatBigNumber(amount, numberOfDecimal)
        };
    }
    const scale = getScale(denom, baseDenomData);
    let result = 0;

    if (scale > 0) {
        result = Number(amount) / Math.pow(10, scale);
    } else {
        result = Number(amount);
    }
    return {
        popover: formatBigNumber(result, undefined),
        title: formatBigNumber(result, numberOfDecimal)
    };
};

export const formatTransfer_success_txs = (
    transfer_success_txs: number,
    transfer_total_txs: number
) => {
    if (transfer_total_txs === 0) return 0;
    return ((transfer_success_txs / transfer_total_txs) * 100).toFixed(0);
};
