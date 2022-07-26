import { defineStore } from 'pinia';
import { findStatistics } from '@/helper/findStatisticsHelper';
import Tools from '@/utils/Tools';
import moveDecimal from 'move-decimal-point';
import {
    ibcStatisticsChainsDefault,
    ibcStatisticsChannelsDefault,
    ibcStatisticsDenomsDefault,
    ibcStatisticsTxsDefault,
    ageTimerInterval
} from '@/constants/index';
import { getIbcStatistics, getIbcTxs, getIbcDenoms } from '@/service/api';
import { GET_IBCSTATISTICS, GET_IBCTXS, GET_IBCDENOMS } from '@/constants/actionTypes';
import { getBaseDenomKey } from '@/helper/baseDenomHelper';
import { getIbcChainsAPI, getIbcBaseDenomsAPI } from '@/api/index';
import { API_CODE } from '@/constants/apiCode';
import { IIbcChains, IBaseDenoms } from '@/types/interface/baseApi.interface';

export const useIbcStatisticsChains = defineStore('global', {
    state: () => {
        return {
            // 全局共享数据,所有的chain 信息（chain_id、chain_name、icon）
            ibcChains: {} as IIbcChains,
            // 全局共享数据，denoms 币种配置信息
            ibcBaseDenoms: [] as IBaseDenoms[],
            // 全局状态
            isShowLoading: false,
            // 全局状态
            ibcTxs: { value: [] },
            // 页面级别 home  chains 卡片
            ibcStatisticsChains: ibcStatisticsChainsDefault,
            // 页面级别 home  Channel Pairs 卡片
            ibcStatisticsChannels: ibcStatisticsChannelsDefault,
            // 页面级别 home   IBC Tokens 卡片
            ibcStatisticsDenoms: ibcStatisticsDenomsDefault,
            // 页面级别 home  IBC Token Transfer 卡片
            ibcStatisticsTxs: ibcStatisticsTxsDefault,
            // 页面级别 home
            ibcTxsCount: { value: '' },
            // 页面级别 home
            ibcTxsStartTime: { value: 0 },
            // 页面级别 home
            ibcTxTimer: { value: {} },
            // 页面级别 transfers details
            ibcDenoms: { value: [] }
        };
    },
    actions: {
        async initState() {
            const ibcBaseDenomsStr = sessionStorage.getItem('ibcBaseDenoms');
            const allChainsStr = sessionStorage.getItem('allChains');
            const promiseArray = [];
            ibcBaseDenomsStr
                ? (this.ibcBaseDenoms = JSON.parse(ibcBaseDenomsStr))
                : promiseArray.push(this.getIbcBaseDenoms);
            allChainsStr
                ? (this.ibcChains = JSON.parse(allChainsStr))
                : promiseArray.push(this.getIbcChains);
            await Promise.all(promiseArray.map((item) => item()));
        },
        async getIbcBaseDenoms() {
            try {
                const { code, data } = await getIbcBaseDenomsAPI();
                if (code == API_CODE.success && data.length > 0) {
                    sessionStorage.setItem('ibcBaseDenoms', JSON.stringify(data));
                    const ibcBaseDenomsMap: any = {};
                    data.forEach((token: any) => {
                        const key = getBaseDenomKey(token.chain_id, token.denom);
                        ibcBaseDenomsMap[key] = token;
                    });
                    sessionStorage.setItem('ibcBaseDenomsMap', JSON.stringify(ibcBaseDenomsMap));
                    this.ibcBaseDenoms = data;
                }
            } catch (error) {
                console.log('getIbcBaseDenoms', error);
            }
        },
        async getIbcChains() {
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
        async [GET_IBCSTATISTICS]() {
            const res = await getIbcStatistics();
            this.ibcStatisticsChains.chains_24hr = findStatistics(res, 'chains_24hr');
            this.ibcStatisticsChains.chain_all = findStatistics(res, 'chain_all');
            this.ibcStatisticsChannels.channels_24hr = findStatistics(res, 'channels_24hr');
            this.ibcStatisticsChannels.channel_all = findStatistics(res, 'channel_all');
            this.ibcStatisticsChannels.channel_opened = findStatistics(res, 'channel_opened');
            this.ibcStatisticsChannels.channel_closed = findStatistics(res, 'channel_closed');
            this.ibcStatisticsDenoms.denom_all = findStatistics(res, 'denom_all');
            this.ibcStatisticsDenoms.base_denom_all = findStatistics(res, 'base_denom_all');
            this.ibcStatisticsTxs.tx_24hr_all = findStatistics(res, 'tx_24hr_all');
            this.ibcStatisticsTxs.tx_all = findStatistics(res, 'tx_all');
            this.ibcStatisticsTxs.tx_success = findStatistics(res, 'tx_success');
            this.ibcStatisticsTxs.tx_failed = findStatistics(res, 'tx_failed');
        },
        async [GET_IBCDENOMS]() {
            const res = await getIbcDenoms();
            this.ibcDenoms.value = res;
        },
        async [GET_IBCTXS](queryParams: any) {
            if (queryParams?.date_range) {
                queryParams.date_range = queryParams.date_range?.toString();
            }
            if (queryParams?.status) {
                queryParams.status = queryParams.status?.toString();
            }
            const { use_count, start_time } = queryParams;
            const res = await getIbcTxs(queryParams);
            if (res) {
                const result = res.data;
                if (use_count) {
                    if (typeof res !== 'number') {
                        this.ibcTxsCount.value = res.data;
                    } else if (typeof res == 'string') {
                        this.ibcTxsCount.value = res;
                    }
                } else if (start_time) {
                    this.ibcTxsStartTime.value = res;
                } else {
                    const getSymbolInfo = (oldData?: any) => {
                        // oldData 中保留有 列表项展开收起的自定义数据
                        return result.map((item: any, index: number) => {
                            const symbol = Tools.findDenomSymbol(
                                this.ibcDenoms.value,
                                item.denoms.sc_denom,
                                item.sc_chain_id
                            );
                            let symbolNum = item.sc_tx_info?.msg_amount?.amount || 0;
                            let symbolDenom = item.base_denom || '';
                            let symbolIcon = '';
                            if (symbol) {
                                const findSymbol = Tools.findSymbol(this.ibcBaseDenoms, symbol);
                                if (findSymbol) {
                                    symbolNum = moveDecimal(
                                        item.sc_tx_info?.msg_amount?.amount || 0,
                                        0 - findSymbol.scale
                                    );
                                    symbolDenom = findSymbol.symbol;
                                    symbolIcon = findSymbol.icon;
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
                    clearInterval(this.ibcTxTimer.value as any);
                    this.ibcTxs.value = getSymbolInfo();
                    this.ibcTxTimer.value = setInterval(() => {
                        this.ibcTxs.value = getSymbolInfo(this.ibcTxs.value);
                    }, ageTimerInterval);
                }
            }
        }
    }
});
