import { defineStore } from "pinia";
import {findStatistics} from '../../helper/findStatistics';
import Tools from '../../utils/Tools';
import moveDecimal from 'move-decimal-point';
import {
    ibcStatisticsChainsDefault,
    ibcStatisticsChannelsDefault,
    ibcStatisticsDenomsDefault,
    ibcStatisticsTxsDefault,
    ageTimerInterval
} from '../../constants';
import {
    getIbcStatistics,
    getIbcChains,
    getIbcTxs,
    getIbcDenoms,
    getIbcBaseDenoms,
} from '../../service/api';
import {
    GET_IBCSTATISTICS,
    GET_IBCCHAINS,
    GET_IBCTXS,
    GET_IBCDENOMS,
    GET_IBCBASEDENOMS,
    GET_IBCCONFIGS,
} from '../action-types';
import { getBaseDenomKey } from '@/helper/baseDenomHelpers';

export const useIbcStatisticsChains = defineStore('home', {
    state: () => {
        return {
            ibcStatisticsChains: ibcStatisticsChainsDefault,
            ibcChains: JSON.parse(sessionStorage.getItem('allChains')?.length ? sessionStorage.getItem('allChains') : '{}'),
            ibcStatisticsChannels: ibcStatisticsChannelsDefault,
            ibcStatisticsDenoms: ibcStatisticsDenomsDefault,
            ibcStatisticsTxs: ibcStatisticsTxsDefault,
            ibcTxs: {value: []},
            ibcTxsCount: {value: ''},
            ibcTxsStartTime: {value: 0},
            ibcTxTimer: {value: {}},
            ibcDenoms: {value: []},
            ibcBaseDenoms: JSON.parse(sessionStorage.getItem('ibcBaseDenoms')?.length ? sessionStorage.getItem('ibcBaseDenoms') : '{"value":[]}'),
            isShowTransferLoading: false
        }
    },
    actions: {
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
        async [GET_IBCCHAINS]() {
            const res = await getIbcChains();
            this.ibcChains = res;
            sessionStorage.setItem('allChains', JSON.stringify(res));
        },
        async [GET_IBCDENOMS]() {
            const res = await getIbcDenoms();
            this.ibcDenoms.value = res;
        },
        async [GET_IBCBASEDENOMS]() {
            const res = await getIbcBaseDenoms();
            sessionStorage.setItem('ibcBaseDenoms', JSON.stringify({
                value: res || []
            }));
            const ibcBaseDenomsMap = {};
            (res || []).forEach(token => {
                const key = getBaseDenomKey(token.chain_id,token.denom);
                ibcBaseDenomsMap[key] = token;
            });
            sessionStorage.setItem('ibcBaseDenomsMap', JSON.stringify(ibcBaseDenomsMap));
            this.ibcBaseDenoms.value = res;
        },
        async [GET_IBCTXS](queryParams) {
            if(queryParams?.date_range){
                queryParams.date_range =queryParams.date_range?.toString()
            }
            if(queryParams?.status){
                queryParams.status = queryParams.status?.toString()
            }
            const {use_count, start_time} = queryParams;
            const res = await getIbcTxs(queryParams);
            if(res) {
                const result = res.data;
                if(use_count) {
                    if(typeof res !== 'number') {
                        this.ibcTxsCount.value = res.data;
                    } else {
                        this.ibcTxsCount.value = res;
                    }
                } else if(start_time){
                    this.ibcTxsStartTime.value = res;
                } else {
                    const getSymbolInfo = (oldData) => {
                        // oldData 中保留有 列表项展开收起的自定义数据
                        return result.map((item, index) => {
                            const symbol = Tools.findDenomSymbol(
                                this.ibcDenoms.value,
                                item.denoms.sc_denom,
                                item.sc_chain_id,
                            );
                            let symbolNum = item.sc_tx_info?.msg_amount?.amount || 0;
                            let symbolDenom = item.base_denom || '';
                            let symbolIcon = '';
                            if (symbol) {
                                const findSymbol = Tools.findSymbol(
                                    this.ibcBaseDenoms.value,
                                    symbol,
                                );
                                if (findSymbol) {
                                    symbolNum = moveDecimal(item.sc_tx_info?.msg_amount?.amount || 0, 0 - findSymbol.scale);
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
                                parseTime: Tools.formatAge(Tools.getTimestamp(), item.tx_time * 1000, '', ''),
                            };
                        });
                    }
                    clearInterval(this.ibcTxTimer.value);
                    this.ibcTxs.value = getSymbolInfo();
                    this.ibcTxTimer.value = setInterval(() => {
                        this.ibcTxs.value = getSymbolInfo(this.ibcTxs.value);
                    }, ageTimerInterval)
                }
            } else {
                this.isShowTransferLoading = false;
            }
        }
    }
})

