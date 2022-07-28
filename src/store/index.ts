import { defineStore } from 'pinia';
import Tools from '@/utils/Tools';
import moveDecimal from 'move-decimal-point';
import { getIbcChainsAPI, getIbcBaseDenomsAPI } from '@/api/index';
import { API_CODE } from '@/constants/apiCode';
import { getIbcTxsAPI } from '@/api/transfers';
import { IIbcChains, IBaseDenoms } from '@/types/interface/index.interface';
import { IResponseIbcTxc, IIbcTxc } from '@/types/interface/transfers.interface';
import { getIbcDenomsAPI } from '@/api/home';
import { IRequestIbcDenom } from '@/types/interface/home.interface';
import { getDenomKey } from '@/helper/baseDenomHelper';

export const useIbcStatisticsChains = defineStore('global', {
    state: () => {
        return {
            ibcChains: {} as IIbcChains,
            ibcBaseDenoms: [] as IBaseDenoms[],
            ibcDenoms: [] as IRequestIbcDenom[],
            isShowLoading: false,
            ibcTxs: [] as IIbcTxc[]
        };
    },
    actions: {
        async initState() {
            const ibcDenomsStr = sessionStorage.getItem('ibcDenoms');
            const ibcBaseDenomsStr = sessionStorage.getItem('ibcBaseDenoms');
            const allChainsStr = sessionStorage.getItem('allChains');
            const promiseArray = [];
            ibcDenomsStr
                ? (this.ibcChains = JSON.parse(ibcDenomsStr))
                : promiseArray.push(this.getIbcDenomsAction);
            ibcBaseDenomsStr
                ? (this.ibcBaseDenoms = JSON.parse(ibcBaseDenomsStr))
                : promiseArray.push(this.getIbcBaseDenomsAction);
            allChainsStr
                ? (this.ibcChains = JSON.parse(allChainsStr))
                : promiseArray.push(this.getIbcChainsAction);
            await Promise.all(promiseArray.map((item) => item()));
        },
        async getIbcDenomsAction() {
            try {
                const { code, data } = await getIbcDenomsAPI();
                if (code === API_CODE.success && data && data.length > 0) {
                    const ibcDenomsMap: any = {};
                    data.forEach((token: any) => {
                        const key = getDenomKey(token.chain_id, token.denom);
                        ibcDenomsMap[key] = token;
                    });
                    sessionStorage.setItem('ibcDenoms', JSON.stringify(data));
                    sessionStorage.setItem('ibcDenomsMap', JSON.stringify(ibcDenomsMap));
                    this.ibcDenoms = data;
                }
            } catch (error) {
                console.log('getIbcDenomsAPI', error);
            }
        },
        async getIbcBaseDenomsAction() {
            try {
                const { code, data } = await getIbcBaseDenomsAPI();
                if (code == API_CODE.success && data && data.length > 0) {
                    const ibcBaseDenomsMap: any = {};
                    data.forEach((token: any) => {
                        const key = getDenomKey(token.chain_id, token.denom);
                        ibcBaseDenomsMap[key] = token;
                    });
                    sessionStorage.setItem('ibcBaseDenoms', JSON.stringify(data));
                    sessionStorage.setItem('ibcBaseDenomsMap', JSON.stringify(ibcBaseDenomsMap));
                    this.ibcBaseDenoms = data;
                }
            } catch (error) {
                console.log('getIbcBaseDenomsAction', error);
            }
        },
        async getIbcChainsAction() {
            try {
                const { code, data } = await getIbcChainsAPI();
                if (code == API_CODE.success && data) {
                    sessionStorage.setItem('allChains', JSON.stringify(data));
                    this.ibcChains = data;
                }
            } catch (error) {
                console.log('getIbcChains', error);
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
                        const result = (data as IResponseIbcTxc).data;
                        // todo duanjie 待抽离
                        let ibcDenomsMapStr = sessionStorage.getItem('ibcDenomsMap');
                        let ibcDenomsMap: any = {};
                        if (!ibcDenomsMapStr) {
                            await this.getIbcDenomsAction();
                            ibcDenomsMapStr = sessionStorage.getItem('ibcDenomsMap');
                        }
                        ibcDenomsMap = JSON.parse(ibcDenomsMapStr || '{}');

                        if (this.ibcBaseDenoms.length <= 0) {
                            await this.getIbcBaseDenomsAction();
                        }
                        const ibcBaseDenomsMap: any = {};
                        this.ibcBaseDenoms.forEach((token: IBaseDenoms) => {
                            ibcBaseDenomsMap[token.symbol] = token;
                        });
                        const getSymbolInfo = (oldData?: any) => {
                            // oldData 中保留有 列表项展开收起的自定义数据
                            return result.map((item: any, index: number) => {
                                const symbol =
                                    ibcDenomsMap[
                                        getDenomKey(item.sc_chain_id, item.denoms.sc_denom)
                                    ]?.symbol;
                                let symbolNum = item.sc_tx_info?.msg_amount?.amount || 0;
                                let symbolDenom = item.base_denom || '';
                                let symbolIcon = '';
                                if (symbol) {
                                    const baseDenomsObj = ibcBaseDenomsMap[symbol];
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
                                    expanded: oldData?.[index]?.expanded ?? false,
                                    symbolNum,
                                    symbolDenom,
                                    symbolIcon,
                                    parseTime: Tools.formatAge(
                                        Tools.getTimestamp(),
                                        item.tx_time * 1000,
                                        '',
                                        ''
                                    )
                                };
                            });
                        };
                        this.ibcTxs = getSymbolInfo();
                    }
                }
            } catch (error) {
                console.log('getIbcTxsAPI', error);
            }
        }
    }
});
