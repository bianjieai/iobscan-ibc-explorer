/**
 * @description format tableCell
 */

import { IBaseDenom } from '@/types/interface/index.interface';
import { formatBigNumber } from './parseStringHelper';
import { BigNumber } from 'bignumber.js';
import moveDecimal from 'move-decimal-point';
import { TRANSFER_DETAILS_STATUS } from '@/constants/transfers';
import { DEFAULT_DISPLAY_TEXT } from '@/constants';
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

const getScale = (denomAndChainID?: string, baseDenomData?: IBaseDenom[]) => {
    if (Array.isArray(baseDenomData) && denomAndChainID) {
        const filterData = baseDenomData.filter(
            (item) => item.denom + item.chain_id === denomAndChainID
        );
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
    denomAndChainID?: string,
    baseDenomData?: IBaseDenom[],
    numberOfDecimal = 2
) => {
    if (amount === -1 || amount === '-1' || amount === '') {
        return {
            title: '--',
            popover: '--'
        };
    }
    if (!denomAndChainID && !baseDenomData) {
        return {
            title: formatBigNumber(amount, numberOfDecimal),
            popover: formatBigNumber(amount, numberOfDecimal)
        };
    }
    const scale = getScale(denomAndChainID, baseDenomData);
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
): number => {
    if (transfer_total_txs === 0) return 0;
    const numerator = new BigNumber(transfer_success_txs);
    const denominator = new BigNumber(transfer_total_txs);
    const res = Number(numerator.dividedBy(denominator).multipliedBy(100).toFixed(0));
    return res > 100 ? 100 : res;
};

export const formatTxStatus = (status: number | string) => {
    if (typeof status === 'string') return status;
    switch (status) {
        case TRANSFER_DETAILS_STATUS.SUCCESS.value:
            return TRANSFER_DETAILS_STATUS.SUCCESS.label;
        case TRANSFER_DETAILS_STATUS.FAILED.value:
            return TRANSFER_DETAILS_STATUS.FAILED.label;
        default:
            return DEFAULT_DISPLAY_TEXT;
    }
};

export const changeColor = computed(() => {
    return (value: string | number) => {
        switch (value) {
            case TRANSFER_DETAILS_STATUS.SUCCESS.label:
            case TRANSFER_DETAILS_STATUS.SUCCESS.value:
                return 'success_color';
            case TRANSFER_DETAILS_STATUS.FAILED.label:
            case TRANSFER_DETAILS_STATUS.FAILED.value:
                return 'failed_color';
            default:
                return '';
        }
    };
});
