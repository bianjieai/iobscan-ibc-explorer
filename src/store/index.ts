import { removeSpaceAndToLowerCase } from '@/utils/stringTools';
import { getRelayersNameListAPI } from '@/api/relayers';
import type { IIbcchain, IPrefixChain } from '@/types/interface/index.interface';
import { getTxSearchCondition } from '@/api/transfers';
import { defineStore } from 'pinia';
import { formatAge, getTimestamp } from '@/utils/timeTools';
import moveDecimal from 'move-decimal-point';
import { getIbcChainsAPI, getIbcBaseDenomsAPI } from '@/api/index';
import { API_CODE } from '@/constants/apiCode';
import { getIbcTxsAPI } from '@/api/transfers';
import { getDenomKey } from '@/helper/baseDenomHelper';
import type { GlobalState } from '@/types/interface/store.interface';
import type { IBaseDenom, IResponsePagingData } from '@/types/interface/index.interface';
import type { IIbcTx } from '@/types/interface/transfers.interface';
import { axiosCancel } from '@/utils/axios';
// import { getIbcDenomsAPI } from '@/api/home';
// import { IResponseIbcDenom } from '@/types/interface/home.interface';

export const useIbcStatisticsChains = defineStore('global', {
    state: (): GlobalState => {
        return {
            ibcChains: {
                all: [],
                active: [],
                inactive: []
            },
            ibcBaseDenoms: [],
            // ibcDenoms: [],
            isShowLoading: false,
            isShow500: false,
            ibcTxs: [],
            isDocumentHidden: false,
            relayerNames: [],
            txSearchTimeMin: 0
        };
    },
    getters: {
        ibcBaseDenomsUniqueKeyMapGetter(): { [key: string]: IBaseDenom } {
            const ibcBaseDenomsUniqueKeyMap: { [key: string]: IBaseDenom } = {};
            this.ibcBaseDenoms.forEach((token: IBaseDenom) => {
                const key = getDenomKey(token.chain, token.denom);
                ibcBaseDenomsUniqueKeyMap[key] = token;
            });
            return ibcBaseDenomsUniqueKeyMap;
        },
        ibcChainsUniqueKeyMapGetter(): { [key: string]: IIbcchain } {
            const ibcChainUniqueKeyMap: { [key: string]: IIbcchain } = {};
            this.ibcChains.all.forEach((chain: IIbcchain) => {
                ibcChainUniqueKeyMap[chain.chain_name] = chain;
            });
            return ibcChainUniqueKeyMap;
        },
        ibcChainsPrettyNameKeyMapGetter(): { [key: string]: IIbcchain } {
            const ibcChainPrettyNameKeyMap: { [key: string]: IIbcchain } = {};
            this.ibcChains.all.forEach((chain: IIbcchain) => {
                ibcChainPrettyNameKeyMap[chain.pretty_name] = chain;
            });
            return ibcChainPrettyNameKeyMap;
        },
        ibcChainsPrefixMapGetter(): { [key: string]: IPrefixChain[] } {
            const ibcChainAddrPrefixMap: { [key: string]: IPrefixChain[] } = {};
            this.ibcChains.all.forEach((chain: IIbcchain) => {
                const chainInfo = {
                    chain_name: chain.chain_name,
                    pretty_name: chain.pretty_name
                };
                chain.addr_prefix.forEach((prefix: string) => {
                    if (ibcChainAddrPrefixMap[prefix]) {
                        ibcChainAddrPrefixMap[prefix].push(chainInfo);
                    } else {
                        ibcChainAddrPrefixMap[prefix] = [chainInfo];
                    }
                });
            });
            return ibcChainAddrPrefixMap;
        }
        // ibcDenomsMapGetter(): { [key: string]: IResponseIbcDenom } {
        //     const ibcDenomsMap: { [key: string]: IResponseIbcDenom } = {};
        //     this.ibcDenoms.forEach((token: IResponseIbcDenom) => {
        //         const key = getDenomKey(token.chain, token.denom);
        //         ibcDenomsMap[key] = token;
        //     });
        //     return ibcDenomsMap;
        // }
    },
    actions: {
        async initStateAction() {
            const localTxSearchTimeMin = localStorage.getItem('txSearchTimeMin');
            if (localTxSearchTimeMin) {
                this.txSearchTimeMin = Number(localTxSearchTimeMin) || 0;
            }
            const promiseArray = [];
            if (this.ibcBaseDenoms.length <= 0) {
                promiseArray.push(this.getIbcBaseDenomsAction);
            }
            if (this.ibcChains.all.length <= 0) {
                promiseArray.push(this.getIbcChainsAction);
            }
            if (this.relayerNames.length <= 0) {
                promiseArray.push(this.getIbcRelayerNamesAction);
            }
            promiseArray.push(this.getIbcTxSearchCondition);
            await Promise.all(promiseArray.map((item) => item()));
        },
        async getIbcBaseDenomsAction(isNeedJudgeShow500 = true) {
            try {
                const { code, data } = await getIbcBaseDenomsAPI();
                if (code == API_CODE.success && data && data.items && data.items.length > 0) {
                    this.ibcBaseDenoms = data.items;
                } else {
                    if (isNeedJudgeShow500 === true) {
                        this.isShow500 = true;
                    }
                }
            } catch (error) {
                if (isNeedJudgeShow500 === true) {
                    this.isShow500 = true;
                }
                console.log('getIbcBaseDenomsAction', error);
            }
        },
        async getIbcChainsAction(isNeedJudgeShow500 = true) {
            try {
                const { code, data } = await getIbcChainsAPI();
                if (code == API_CODE.success && data && data.items && data.items.length > 0) {
                    this.ibcChains = data.items[0];
                } else {
                    if (isNeedJudgeShow500 === true) {
                        this.isShow500 = true;
                    }
                }
            } catch (error) {
                if (isNeedJudgeShow500 === true) {
                    this.isShow500 = true;
                }
                console.log('getIbcChains', error);
            }
        },
        async getIbcTxSearchCondition() {
            try {
                const { code, data } = await getTxSearchCondition();
                if (code == API_CODE.success) {
                    this.txSearchTimeMin = data.tx_time_min;
                    localStorage.setItem('txSearchTimeMin', data.tx_time_min?.toString());
                }
            } catch (error) {
                console.log('getIbcTxSearchCondition', error);
            }
        },
        // async getIbcDenomsAction() {
        //     try {
        //         const { code, data } = await getIbcDenomsAPI();
        //         if (code === API_CODE.success && data && data.items && data.items.length > 0) {
        //             this.ibcDenoms = data.items;
        //         }
        //     } catch (error) {
        //         console.log('getIbcDenomsAPI', error);
        //     }
        // },
        async getIbcRelayerNamesAction() {
            try {
                const { code, data } = await getRelayersNameListAPI();
                if (code == API_CODE.success) {
                    if (data && data.length > 0) {
                        this.relayerNames = data.map((name) => {
                            return {
                                source: name,
                                matching: removeSpaceAndToLowerCase(name)
                            };
                        });
                    } else {
                        this.relayerNames = [];
                    }
                }
            } catch (error) {
                console.log('getIbcRelayerNames', error);
            }
        },
        async getIbcTxsAction(queryParams: any, isNeedJudgeShow500 = true) {
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
                        const result = (data as IResponsePagingData<IIbcTx[]>).items;
                        if (this.ibcBaseDenoms.length <= 0) {
                            console.log('getIbcTxsAction-execute: getIbcBaseDenomsAction');
                            try {
                                await this.getIbcBaseDenomsAction();
                            } catch (error) {
                                console.log('getIbcTxsAction update ibcBaseDenoms error', error);
                            }
                        }
                        const getSymbolInfo = (data: IIbcTx[]) => {
                            return data.map((item: IIbcTx) => {
                                const unikey = getDenomKey(item.base_denom_chain, item.base_denom);
                                const baseDenomsObj = this.ibcBaseDenomsUniqueKeyMapGetter[unikey];
                                let symbolNum = item.sc_tx_info?.msg_amount?.amount || 0;
                                let symbolDenom = item.base_denom || '';
                                let symbolIcon = '';
                                if (baseDenomsObj) {
                                    symbolNum = moveDecimal(
                                        item.sc_tx_info?.msg_amount?.amount || 0,
                                        0 - baseDenomsObj.scale
                                    );
                                    symbolDenom = baseDenomsObj.symbol;
                                    symbolIcon = baseDenomsObj.icon;
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
                        return getSymbolInfo(result);
                    }
                }
            } catch (error) {
                if (!axiosCancel(error)) {
                    if (isNeedJudgeShow500 === true) {
                        this.isShow500 = true;
                    }
                }
                console.log('getIbcTxsAPI', error);
                throw error;
            }
        }
    }
});
