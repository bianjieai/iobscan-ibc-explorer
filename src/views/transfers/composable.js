import { ref, reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useIbcStatisticsChains } from '../../store/home/index';
import { GET_IBCSTATISTICS, GET_IBCTXS, GET_IBCBASEDENOMS, GET_IBCCHAINS, GET_IBCDENOMS } from '../../store/action-types';
import { getIbcDenoms, getTxDetailsByTxHash } from '../../service/api';
import { groupBy } from 'lodash-es';
import tokenDefaultImg from '../../assets/token-default.png';
import { transferTableColumn } from '../../constants';

const ibcStatisticsChainsStore = useIbcStatisticsChains();

export const useIbcStatistics = () => {
    const ibcStatisticsTxs = ibcStatisticsChainsStore.ibcStatisticsTxs;
    const getIbcStatistics = ibcStatisticsChainsStore[GET_IBCSTATISTICS];
    return {
        ibcStatisticsTxs,
        getIbcStatistics
    }
}

export const useIbcTxs = () => {
    const tableCount = ibcStatisticsChainsStore.ibcTxsCount;
    const getIbcTxs = ibcStatisticsChainsStore[GET_IBCTXS];
    return {
        tableCount,
        getIbcTxs
    }
}

export const useIbcChains = () => {
    const ibcChains = sessionStorage.getItem('allChains') ? JSON.parse(sessionStorage.getItem('allChains')) : {};
    const getIbcChains = ibcStatisticsChainsStore[GET_IBCCHAINS];
    return {
        ibcChains,
        getIbcChains
    }
}

export const useGetIbcBaseDenoms = () => {
    const ibcBaseDenoms = sessionStorage.getItem('ibcBaseDenoms') ? JSON.parse(sessionStorage.getItem('ibcBaseDenoms')) : ibcStatisticsChainsStore.ibcBaseDenoms;
    const getIbcBaseDenom = ibcStatisticsChainsStore[GET_IBCBASEDENOMS];
    return {
        ibcBaseDenoms,
        getIbcBaseDenom
    }
}

export const useGetTokens = () => {
    const tokens = reactive({ value: [] });
    const ibcDenoms = ibcStatisticsChainsStore.ibcDenoms;
    const getIbcDenomsFn = ibcStatisticsChainsStore[GET_IBCDENOMS];
    getIbcDenoms().then((res) => {
        let tokensObj = groupBy(res, 'symbol');
        const atomObj = {
            'ATOM': tokensObj['ATOM']
        }
        const irisObj = {
            'IRIS': tokensObj['IRIS']
        }
        delete tokensObj['ATOM']
        delete tokensObj['IRIS']

        let newkey = Object?.keys(tokensObj).sort();
        let newObj = {}
        for (let i = 0; i < newkey.length; i++) {
            newObj[newkey[i]] = tokensObj[newkey[i]];
        }
        tokens.value = {
            ...atomObj,
            ...irisObj,
            ...newObj
        }
    }).catch(error => {
        console.log(error)
    });
    return {
        tokens,
        ibcDenoms,
        getIbcDenomsFn
    }
}

export const useSelectedSymbol = () => {
    const selectedSymbol = reactive({ value: 'All Tokens' });
    const isShowSymbolIcon = ref(false);
    const clearInput = { value: 0 };
    const selectedChain = reactive({
        value: {
            chain_name: undefined,
        },
    });
    const isShowChainIcon = ref(false);
    return {
        selectedSymbol,
        isShowSymbolIcon,
        clearInput,
        selectedChain,
        isShowChainIcon
    }
}

export const usePagination = () => {
    const pagination = reactive({
        total: 0,
        current: 1,
        pageSize: 10,
    });
    return {
        pagination
    }
}

export const useFindIcon = (props) => {
    const findSymbolIcon = () => {
        const findSymbolConfig = props.ibcBaseDenoms.value?.find(
            (baseDenom) => baseDenom.symbol === props.selectedSymbol,
        );
        if (findSymbolConfig) {
            return findSymbolConfig.icon || tokenDefaultImg;
        }
        return tokenDefaultImg;
    };
    const findChainIcon = () => {
        const findChainConfig = props?.options?.find(
            (item) => item.chain_id === props.selectedChain.chain_id,
        );
        if (findChainConfig) {
            return findChainConfig.icon || tokenDefaultImg;
        }
        return tokenDefaultImg;
    };
    const isShowSymbol = (key) => {
        const result = {
            symbolDenom: '',
            symbolIcon: '',
        };
        if (props.type === 'token' && Array.isArray(props.ibcBaseDenoms.value)) {
            const findSymbol = props.ibcBaseDenoms.value?.find((baseDenom) => baseDenom.symbol === key);
            result.symbolDenom = findSymbol ? findSymbol.symbol : key;
            result.symbolIcon = findSymbol ? findSymbol.icon : '';
        }
        return result;
    };
    return {
        findSymbolIcon,
        findChainIcon,
        isShowSymbol,
    }
}

export const useFindIbcChainIcon = () => {
    const findIbcChainIcon = (chainId) => {
        if (ibcChains.value && ibcChains.value.all) {
            const result = ibcChains.value.all.find((item) => item.chain_id === chainId);
            if (result) {
                return result.icon || tokenDefaultImg;
            }
        }
        return tokenDefaultImg;
    };
    return {
        findIbcChainIcon
    }
}

export const useGetTableColumns = () => {
    const tableColumns = reactive(transferTableColumn);
    const isShowTransferLoading = computed({
        get() {
            return ibcStatisticsChainsStore.isShowTransferLoading;
        },
        set(newValue) {
            ibcStatisticsChainsStore.isShowTransferLoading = newValue;
        }
    })
    // const tableDatas = {value: []};
    const tableDatas = ibcStatisticsChainsStore.ibcTxs;
    return {
        tableColumns,
        isShowTransferLoading,
        tableDatas
    }
}
export const useIsVisible = () => {
    const isVisible = ref(false);
    const visibleChange = (visible) => {
        isVisible.value = visible;
    };
    return {
        isVisible,
        visibleChange
    }
}

// transfers details
export const useTransfersDetailsInfo = () => {
    const route = useRoute();
    const router = useRouter();
    let ibcTransferOutTxHash = ref('--')
    let ibcTransferInTxHash = ref('--')
    let ibcTxStatus = ref('default')
    let outTxStatus = ref('default')
    let inTxStatus = ref('default')
    let sequence = ref('--')
    let baseDenom = ref('')
    const transferOutDetails = reactive([
        {
            label: 'MsgType:',
            value: 'IBC Transfer Out',
        },
        {
            label: 'Chain ID:',
            value: '--',
            dataKey: 'sc_chain_id',
            isFormatChainID: true
        },
        {
            label: 'Port:',
            value: '--',
            dataKey: 'sc_port',
        },
        {
            label: 'Channel ID:',
            value: '--',
            dataKey: 'sc_channel',
            isChannelID: true
        },
        {
            label: 'Send Token:',
            value: '--',
            dataKey: 'sc_tx_info.msg_amount',
            isFormatToken: true
        },
        {
            label: 'IBC Out Address:',
            value: '--',
            dataKey: 'sc_tx_info.msg.msg.sender',
            isAddress: true
        },
        {
            label: 'Block:',
            value: '--',
            dataKey: 'sc_tx_info.height',
        },
        {
            label: 'Status:',
            value: '--',
            dataKey: 'sc_tx_info.status',
            isFormatStatus: true
        },
        {
            label: 'Timestamp:',
            value: '--',
            dataKey: 'tx_time',
            isFormatDate: true
        },
        {
            label: 'Fee:',
            value: '--',
            dataKey: 'sc_tx_info.fee.amount',
            isFormatFee: true
        },
        {
            label: 'Signer:',
            value: '--',
            dataKey: 'sc_signers',
            isAddress: true
        },

    ])
    const transferOutExpandDetails = reactive([
        {
            label: 'Connection:',
            value: '--',
            dataKey: 'sc_connect',
            isExpand: false,
        },
        {
            label: 'Time Out Height:',
            value: '--',
            dataKey: 'sc_tx_info.msg.msg.timeout_height',
            isExpand: false,
            isFormatHeight: true,
        },
        {
            label: 'Time Out Timestamp:',
            value: '--',
            dataKey: 'sc_tx_info.msg.msg.timeout_timestamp',
            isExpand: false,
        }
    ])
    const transferInDetails = reactive([
        {
            label: 'MsgType:',
            value: 'IBC Transfer In',
        },
        {
            label: 'Chain ID:',
            value: '--',
            dataKey: 'dc_chain_id',
            isFormatChainID: true
        },
        {
            label: 'Port:',
            value: '--',
            dataKey: 'dc_port',
        },
        {
            label: 'Channel ID:',
            value: '--',
            dataKey: 'dc_channel',
        },
        {
            label: 'Received Token:',
            value: '--',
            dataKey: 'dc_tx_info.msg.msg.packet.data',
            isFormatToken: true
        },
        {
            label: 'IBC In Address:',
            value: '--',
            dataKey: 'sc_tx_info.msg.msg.receiver',
            isAddress: true
        },
        {
            label: 'Block:',
            value: '--',
            dataKey: 'dc_tx_info.height',
        },
        {
            label: 'Status:',
            value: '--',
            dataKey: 'dc_tx_info.status',
            isFormatStatus: true
        },
        {
            label: 'Timestamp:',
            value: '--',
            dataKey: 'dc_tx_info.time',
            isFormatDate: true
        },
        {
            label: 'Fee:',
            value: '--',
            dataKey: 'dc_tx_info.fee.amount',
            isFormatFee: true
        },
        {
            label: 'Signer:',
            value: '--',
            dataKey: 'dc_signers',
            isAddress: true,
        },

    ])
    const transferInExpandDetails = [
        {
            label: 'Connection:',
            value: '--',
            dataKey: 'dc_connect',
            isExpand: true,
        },
        {
            label: 'Packet Ack:',
            value: '--',
            dataKey: 'dc_tx_info.ack',
            isExpand: true,
            isAck: true
        },
        {
            label: 'Proof Height:',
            value: '--',
            dataKey: 'dc_tx_info.msg.msg.proof_height',
            isExpand: true,
            isFormatHeight: true,
        }
    ]

    const isShowLoading = reactive({
        value: true
    })
    watch(route, (newValue, oldValue) => {
        if (newValue?.query?.hash) {
            getTxDetails(newValue.query.hash)
        }
    })
    const getTxDetails = (txHash) => {
        isShowLoading.value = true
        getTxDetailsByTxHash(route.query.hash).then(result => {
            isShowLoading.value = false
            if (result?.length === 1) {
                const res = result[0]
                if (res?.sc_tx_info?.hash) {
                    ibcTransferOutTxHash.value = res.sc_tx_info.hash

                }
                if (res?.sc_tx_info?.status >= 0) {
                    outTxStatus.value = res.sc_tx_info.status
                }
                if (res?.dc_tx_info?.hash) {
                    ibcTransferInTxHash.value = res.dc_tx_info.hash
                }
                if (res?.dc_tx_info?.status >= 0) {
                    inTxStatus.value = res.dc_tx_info.status
                }
                if (res?.sequence) {
                    sequence.value = res.sequence
                }
                if (res?.status) {
                    ibcTxStatus.value = res.status
                }
                if (res?.base_denom) {
                    baseDenom.value = res.base_denom
                }
                transferOutDetails.forEach(item => {
                    if (item?.dataKey?.includes('.')) {
                        const keys = item.dataKey.split('.')
                        if (keys?.length) {
                            let result = res
                            keys.forEach(key => {
                                result = result[key] || result[key] === 0 ? result[key] : ''
                                item.value = result

                            })
                        }
                    } else {
                        if (item.dataKey) {
                            item.value = res[item.dataKey]
                        }
                    }
                })
                transferOutExpandDetails.forEach(item => {
                    if (item?.dataKey?.includes('.')) {
                        const keys = item.dataKey.split('.')
                        if (keys?.length) {
                            let result = res
                            keys.forEach(key => {
                                result = result[key] || result[key] === 0 ? result[key] : ''
                                item.value = result

                            })
                        }
                    } else {
                        if (item.dataKey) {
                            item.value = res[item.dataKey]
                        }
                    }
                })
                transferInDetails.forEach(item => {
                    if (item?.dataKey?.includes('.')) {

                        const keys = item.dataKey.split('.')
                        if (keys?.length) {
                            let result = res
                            keys.forEach(key => {
                                result = result[key] || result[key] === 0 ? result[key] : ''
                                item.value = result

                            })
                        }
                        if (item.label === 'Received Token:' && res?.denoms?.dc_denom) {
                            item.value.denom = res.denoms.dc_denom
                        }
                    } else {
                        if (item.dataKey) {
                            item.value = res[item.dataKey]
                        }
                    }
                })
                transferInExpandDetails.forEach(item => {
                    if (item?.dataKey?.includes('.')) {
                        const keys = item.dataKey.split('.')
                        if (keys?.length) {
                            let result = res
                            keys.forEach(key => {
                                result = result[key] || result[key] === 0 ? result[key] : ''
                                item.value = result

                            })
                        }
                    } else {
                        if (item.dataKey) {
                            item.value = res[item.dataKey]
                        }
                    }
                })
            } else {
                router.push(`/searchResult?${route.query.hash}`)
            }

        }).catch(error => {
            isShowLoading.value = false
            console.error(error)
        })
    }
    if (route?.query?.hash) {
        getTxDetails(route?.query?.hash)
    }
    return {
        ibcTransferOutTxHash,
        ibcTransferInTxHash,
        ibcTxStatus,
        outTxStatus,
        inTxStatus,
        sequence,
        baseDenom,
        transferOutDetails,
        transferOutExpandDetails,
        transferInDetails,
        transferInExpandDetails,
        isShowLoading
    }
}

// noresult
export const useNoResult = () => {
    const route = useRoute();
    const router = useRouter()
    watch(route, (newValue, oldValue) => {
        if (newValue?.query) {
            searchInputValue.value = Object.keys(route.query)
        }
    })
    let searchInputValue = reactive({
        value: ['']
    })
    if (route?.query) {
        if (/^[A-F0-9]{64}$/.test(Object.keys(route.query))) {
            getTxDetailsByTxHash(Object.keys(route.query)).then(result => {
                if (result.length === 1) {
                    router.push(`/transfers/details?hash=${Object.keys(route.query)}`)
                }
            })
        } else {
            router.push(`/searchResult?${Object.keys(route.query)}`)
        }
        searchInputValue.value = Object.keys(route.query)
    }
    const toHome = () => {
        router.push(`/home`)
    }
    return {
        searchInputValue,
        toHome
    }
}