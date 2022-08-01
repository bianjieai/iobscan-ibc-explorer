import { defineStore } from 'pinia';
import { formatAge, getTimestamp } from '@/utils/timeTools';
import moveDecimal from 'move-decimal-point';
import { getIbcChainsAPI, getIbcBaseDenomsAPI } from '@/api/index';
import { API_CODE } from '@/constants/apiCode';
import { getIbcTxsAPI } from '@/api/transfers';
import { getIbcDenomsAPI } from '@/api/home';
import { getDenomKey } from '@/helper/baseDenomHelper';
import { GlobalState } from '@/types/interface/store.interface';
import { IBaseDenom, Paging } from '@/types/interface/index.interface';
import { IIbcTx } from '@/types/interface/transfers.interface';
import { IResponseIbcDenom } from '@/types/interface/home.interface';

export const useIbcStatisticsChains = defineStore('global', {
    state: (): GlobalState => {
        return {
            ibcChains: {},
            ibcBaseDenoms: [],
            ibcBaseDenomsUniqueKeyMap: {},
            ibcBaseDenomsSymbolKeyMap: {},
            ibcDenoms: [],
            ibcDenomsMap: {},
            isShowLoading: false,
            ibcTxs: []
        };
    },
    actions: {
        async initState() {
            const promiseArray = [];
            if (this.ibcBaseDenoms.length <= 0) {
                promiseArray.push(this.getIbcBaseDenomsAction);
            }
            if (Object.keys(this.ibcChains).length <= 0) {
                promiseArray.push(this.getIbcChainsAction);
            }
            await Promise.all(promiseArray.map((item) => item()));
        },
        async getIbcBaseDenomsAction() {
            try {
                const { code, data } = await getIbcBaseDenomsAPI();
                if (code == API_CODE.success && data && data.length > 0) {
                    const ibcBaseDenomsUniqueKeyMap: { [key: string]: IBaseDenom } = {};
                    const ibcBaseDenomsSymbolKeyMap: { [key: string]: IBaseDenom } = {};
                    data.forEach((token: IBaseDenom) => {
                        const key = getDenomKey(token.chain_id, token.denom);
                        ibcBaseDenomsUniqueKeyMap[key] = token;
                        ibcBaseDenomsSymbolKeyMap[token.symbol] = token;
                    });
                    this.ibcBaseDenoms = data;
                    this.ibcBaseDenomsUniqueKeyMap = ibcBaseDenomsUniqueKeyMap;
                    this.ibcBaseDenomsSymbolKeyMap = ibcBaseDenomsSymbolKeyMap;
                }
            } catch (error) {
                console.log('getIbcBaseDenomsAction', error);
            }
        },
        async getIbcChainsAction() {
            try {
                const { code, data } = await getIbcChainsAPI();
                if (code == API_CODE.success && data) {
                    this.ibcChains = data;
                }
            } catch (error) {
                console.log('getIbcChains', error);
            }
        },
        async getIbcDenomsAction() {
            try {
                const { code, data } = await getIbcDenomsAPI();
                if (code === API_CODE.success && data && data.length > 0) {
                    const ibcDenomsMap: { [key: string]: IResponseIbcDenom } = {};
                    data.forEach((token: IResponseIbcDenom) => {
                        const key = getDenomKey(token.chain_id, token.denom);
                        ibcDenomsMap[key] = token;
                    });
                    this.ibcDenoms = data;
                    this.ibcDenomsMap = ibcDenomsMap;
                }
            } catch (error) {
                console.log('getIbcDenomsAPI', error);
            }
        },
        async getIbcTxsAction(queryParams: any) {
            if (queryParams?.date_range) {
                queryParams.date_range = queryParams.date_range?.toString();
            }
            if (queryParams?.status) {
                queryParams.status = queryParams.status?.toString();
            }
            const { use_count } = queryParams;
            try {
                const { code, data } = await getIbcTxsAPI(queryParams);
                if (code === API_CODE.success) {
                    if (use_count) {
                        return data;
                    } else {
                        const result = (data as Paging<IIbcTx[]>).data;
                        const promiseArray = [];
                        if (this.ibcDenoms.length <= 0) {
                            console.log('getIbcTxsAction-execute: getIbcDenomsAction');
                            promiseArray.push(this.getIbcDenomsAction);
                        }
                        if (this.ibcBaseDenoms.length <= 0) {
                            console.log('getIbcTxsAction-execute: getIbcBaseDenomsAction');
                            promiseArray.push(this.getIbcBaseDenomsAction);
                        }
                        try {
                            await Promise.all(promiseArray.map((item) => item()));
                        } catch (error) {
                            console.log(
                                'getIbcTxsAction update ibcDenoms or ibcBaseDenoms error',
                                error
                            );
                        }
                        const getSymbolInfo = (data: IIbcTx[]) => {
                            return data.map((item: IIbcTx) => {
                                const symbol =
                                    this.ibcDenomsMap[
                                        getDenomKey(item.sc_chain_id, item.denoms.sc_denom)
                                    ]?.symbol;
                                let symbolNum = item.sc_tx_info?.msg_amount?.amount || 0;
                                let symbolDenom = item.base_denom || '';
                                let symbolIcon = '';
                                if (symbol) {
                                    const baseDenomsObj = this.ibcBaseDenomsSymbolKeyMap[symbol];
                                    if (baseDenomsObj) {
                                        symbolNum = moveDecimal(
                                            item.sc_tx_info?.msg_amount?.amount || 0,
                                            0 - baseDenomsObj.scale
                                        );
                                        symbolDenom = baseDenomsObj.symbol;
                                        symbolIcon = baseDenomsObj.icon;
                                    }
                                }
                                return {
                                    ...item,
                                    expanded: false,
                                    symbolNum,
                                    symbolDenom,
                                    symbolIcon,
                                    parseTime: formatAge(
                                        getTimestamp(),
                                        item.tx_time * 1000,
                                        '',
                                        ''
                                    )
                                };
                            });
                        };
                        this.ibcTxs = getSymbolInfo(result);
                    }
                }
            } catch (error) {
                console.log('getIbcTxsAPI', error);
            }
        }
    }
});
