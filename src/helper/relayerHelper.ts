import { CHART_TOOLTIP, UNIT_SIGNS } from '@/constants/relayers';

export const getChartTooltip = (chooseIndex: number): { key: string; symbol: string } => {
    let key: string;
    let symbol: string;
    if (chooseIndex === 0) {
        key = CHART_TOOLTIP.value;
        symbol = UNIT_SIGNS;
    } else {
        key = CHART_TOOLTIP.txs;
        symbol = '';
    }
    return {
        key,
        symbol
    };
};

export const getTransactionPluralSymbol = (key: string, value: string): string => {
    if (key === CHART_TOOLTIP.txs) {
        return Number(value) > 1 ? 's' : '';
    }
    return '';
};
