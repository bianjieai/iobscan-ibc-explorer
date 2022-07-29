import { ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useIbcStatisticsChains } from '../../store/index';
import { getTxDetailsByTxHash } from '@/service/api';
import { groupBy } from 'lodash-es';
import tokenDefaultImg from '../../assets/token-default.png';
import { transferTableColumn, defaultTitle } from '../../constants';
import Tools from '../../utils/Tools';
import { storeToRefs } from 'pinia';

const ibcStatisticsChainsStore = useIbcStatisticsChains();

export const useIbcTxs = () => {
    const tableCount = ref(0);
    const getIbcTxs = ibcStatisticsChainsStore.getIbcTxsAction;
    return {
        tableCount,
        getIbcTxs
    };
};

export const useIbcChains = () => {
    const { ibcChains } = storeToRefs(ibcStatisticsChainsStore);
    const getIbcChains = ibcStatisticsChainsStore.getIbcChainsAction;
    return {
        ibcChains,
        getIbcChains
    };
};

export const useGetIbcBaseDenoms = () => {
    const { ibcBaseDenoms } = storeToRefs(ibcStatisticsChainsStore);
    const getIbcBaseDenom = ibcStatisticsChainsStore.getIbcBaseDenomsAction;
    return {
        ibcBaseDenoms,
        getIbcBaseDenom
    };
};

export const useGetTokens = () => {
    const tokens = ref([]);
    const { ibcDenoms } = storeToRefs(ibcStatisticsChainsStore);
    const tokensObj = groupBy(ibcDenoms, 'symbol');
    const atomObj = {
        ATOM: tokensObj['ATOM']
    };
    const irisObj = {
        IRIS: tokensObj['IRIS']
    };
    delete tokensObj['ATOM'];
    delete tokensObj['IRIS'];

    const newkey = Object?.keys(tokensObj).sort();
    const newObj: any = {};
    for (let i = 0; i < newkey.length; i++) {
        newObj[newkey[i]] = tokensObj[newkey[i]];
    }
    tokens.value = {
        ...atomObj,
        ...irisObj,
        ...newObj
    };
    return {
        tokens,
        ibcDenoms
    };
};

export const useSelectedSymbol = () => {
    const selectedSymbol = reactive({ value: defaultTitle.defaultTokens });
    const isShowSymbolIcon = ref(false);
    const clearInput = { value: 0 };
    const selectedChain = reactive({
        value: {
            chain_name: undefined
        }
    });
    const isShowChainIcon = ref(false);
    return {
        selectedSymbol,
        isShowSymbolIcon,
        clearInput,
        selectedChain,
        isShowChainIcon
    };
};

export const usePagination = () => {
    const pagination = reactive({
        total: 0,
        current: 1,
        pageSize: 10
    });
    return {
        pagination
    };
};

export const useFindIcon = (props: any) => {
    const findSymbolIcon = () => {
        const findSymbolConfig = props.ibcBaseDenoms?.find(
            (baseDenom: any) => baseDenom.symbol === props.selectedSymbol
        );
        if (findSymbolConfig) {
            return findSymbolConfig.icon || tokenDefaultImg;
        }
        return tokenDefaultImg;
    };
    const findChainIcon = () => {
        const findChainConfig = props?.options?.find(
            (item: any) => item.chain_id === props.selectedChain.chain_id
        );
        if (findChainConfig) {
            return findChainConfig.icon || tokenDefaultImg;
        }
        return tokenDefaultImg;
    };
    const isShowSymbol = (key: any) => {
        const result = {
            symbolDenom: '',
            symbolIcon: ''
        };
        if (Array.isArray(props.ibcBaseDenoms)) {
            const findSymbol = Tools.findSymbol(props.ibcBaseDenoms, key);
            result.symbolDenom = findSymbol ? findSymbol.symbol : key;
            result.symbolIcon = findSymbol ? findSymbol.icon : '';
        }
        return result;
    };
    return {
        findSymbolIcon,
        findChainIcon,
        isShowSymbol
    };
};

export const useGetTableColumns = () => {
    const tableColumns = reactive(transferTableColumn);
    const showTransferLoading = ref(true);
    const { ibcTxs: tableDatas } = storeToRefs(ibcStatisticsChainsStore);
    return {
        tableColumns,
        showTransferLoading,
        tableDatas
    };
};
export const useIsVisible = () => {
    const isVisible = ref(false);
    const visibleChange = (visible: boolean) => {
        isVisible.value = visible;
    };
    return {
        isVisible,
        visibleChange
    };
};

// transfers details
export const useTransfersDetailsInfo = () => {
    const route = useRoute();
    const router = useRouter();
    const ibcTransferOutTxHash = ref('--');
    const ibcTransferInTxHash = ref('--');
    const ibcTxStatus = ref('default');
    const outTxStatus = ref('default');
    const inTxStatus = ref('default');
    const sequence = ref('--');
    const baseDenom = ref('');
    const scChainId = ref('');
    const dcChainId = ref('');
    const transferOutDetails = reactive([
        {
            label: 'MsgType:',
            value: 'IBC Transfer Out'
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
            dataKey: 'sc_port'
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
            label: 'From Address:',
            value: '--',
            dataKey: 'sc_tx_info.msg.msg.sender',
            isAddress: true
        },
        {
            label: 'Block:',
            value: '--',
            dataKey: 'sc_tx_info.height'
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
            isAddress: true,
            isNotLink: true
        }
    ]);
    const transferOutExpandDetails = reactive([
        {
            label: 'Connection:',
            value: '--',
            dataKey: 'sc_connect',
            isExpand: false
        },
        {
            label: 'Time Out Height:',
            value: '--',
            dataKey: 'sc_tx_info.msg.msg.timeout_height',
            isExpand: false,
            isFormatHeight: true
        },
        {
            label: 'Time Out Timestamp:',
            value: '--',
            dataKey: 'sc_tx_info.msg.msg.timeout_timestamp',
            isExpand: false
        }
    ]);
    const transferInDetails = reactive([
        {
            label: 'MsgType:',
            value: 'IBC Transfer In'
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
            dataKey: 'dc_port'
        },
        {
            label: 'Channel ID:',
            value: '--',
            dataKey: 'dc_channel',
            isChannelID: true
        },
        {
            label: 'Received Token:',
            value: '--',
            dataKey: 'dc_tx_info.msg.msg.packet.data',
            isFormatToken: true
        },
        {
            label: 'To Address:',
            value: '--',
            dataKey: 'sc_tx_info.msg.msg.receiver',
            isAddress: true
        },
        {
            label: 'Block:',
            value: '--',
            dataKey: 'dc_tx_info.height'
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
            isAddress: true
        }
    ]);
    const transferInExpandDetails = [
        {
            label: 'Connection:',
            value: '--',
            dataKey: 'dc_connect',
            isExpand: true
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
            isFormatHeight: true
        }
    ];

    watch(route, (newValue) => {
        if (newValue?.query?.hash) {
            getTxDetails();
        }
    });
    const getTxDetails = () => {
        ibcStatisticsChainsStore.isShowLoading = true;
        getTxDetailsByTxHash(route.query.hash)
            .then((result) => {
                ibcStatisticsChainsStore.isShowLoading = false;
                if (result?.length === 1) {
                    const res = result[0];
                    scChainId.value = res?.sc_chain_id;
                    dcChainId.value = res?.dc_chain_id;
                    if (res?.sc_tx_info?.hash) {
                        ibcTransferOutTxHash.value = res.sc_tx_info.hash;
                    }
                    if (res?.sc_tx_info?.status >= 0) {
                        outTxStatus.value = res.sc_tx_info.status;
                    }
                    if (res?.dc_tx_info?.hash) {
                        ibcTransferInTxHash.value = res.dc_tx_info.hash;
                    }
                    if (res?.dc_tx_info?.status >= 0) {
                        inTxStatus.value = res.dc_tx_info.status;
                    }
                    if (res?.sequence) {
                        sequence.value = res.sequence;
                    }
                    if (res?.status) {
                        ibcTxStatus.value = res.status;
                    }
                    if (res?.base_denom) {
                        baseDenom.value = res.base_denom;
                    }
                    transferOutDetails.forEach((item) => {
                        if (item?.dataKey?.includes('.')) {
                            const keys = item.dataKey.split('.');
                            if (keys?.length) {
                                let result = res;
                                keys.forEach((key) => {
                                    result = result[key] || result[key] === 0 ? result[key] : '';
                                    item.value = result;
                                });
                            }
                        } else {
                            if (item.dataKey) {
                                item.value = res[item.dataKey];
                            }
                        }
                    });
                    transferOutExpandDetails.forEach((item) => {
                        if (item?.dataKey?.includes('.')) {
                            const keys = item.dataKey.split('.');
                            if (keys?.length) {
                                let result = res;
                                keys.forEach((key) => {
                                    result = result[key] || result[key] === 0 ? result[key] : '';
                                    item.value = result;
                                });
                            }
                        } else {
                            if (item.dataKey) {
                                item.value = res[item.dataKey];
                            }
                        }
                    });
                    transferInDetails.forEach((item) => {
                        if (item?.dataKey?.includes('.')) {
                            const keys = item.dataKey.split('.');
                            if (keys?.length) {
                                let result = res;
                                keys.forEach((key) => {
                                    result = result[key] || result[key] === 0 ? result[key] : '';
                                    item.value = result;
                                });
                            }
                            if (item.label === 'Received Token:' && res?.denoms?.dc_denom) {
                                // item.value.denom = res.denoms.dc_denom;
                                item.value = res.denoms.dc_denom;
                            }
                        } else {
                            if (item.dataKey) {
                                item.value = res[item.dataKey];
                            }
                        }
                    });
                    transferInExpandDetails.forEach((item) => {
                        if (item?.dataKey?.includes('.')) {
                            const keys = item.dataKey.split('.');
                            if (keys?.length) {
                                let result = res;
                                keys.forEach((key) => {
                                    result = result[key] || result[key] === 0 ? result[key] : '';
                                    item.value = result;
                                });
                            }
                        } else {
                            if (item.dataKey) {
                                item.value = res[item.dataKey];
                            }
                        }
                    });
                } else {
                    router.push(`/searchResult?${route.query.hash}`);
                }
            })
            .catch((error) => {
                ibcStatisticsChainsStore.isShowLoading = false;
                console.error(error);
            });
    };
    if (route?.query?.hash) {
        getTxDetails();
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
        scChainId,
        dcChainId
    };
};

// noresult
export const useNoResult = () => {
    const route = useRoute();
    const router = useRouter();
    watch(route, (newValue) => {
        if (newValue?.query) {
            searchInputValue.value = Object.keys(route.query);
        }
    });
    const searchInputValue = reactive({
        value: ['']
    });
    if (route?.query) {
        if (/^[A-F0-9]{64}$/.test(Object.keys(route.query).join(''))) {
            getTxDetailsByTxHash(Object.keys(route.query).join('')).then((result) => {
                if (result.length === 1) {
                    router.push(`/transfers/details?hash=${Object.keys(route.query).join('')}`);
                }
            });
        } else {
            router.push(`/searchResult?${Object.keys(route.query).join('')}`);
        }
        searchInputValue.value = Object.keys(route.query);
    }
    const toHome = () => {
        router.push('/home');
    };
    return {
        searchInputValue,
        toHome
    };
};
