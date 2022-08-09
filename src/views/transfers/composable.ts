import { API_CODE } from '@/constants/apiCode';
import { getTxDetailsByTxHashAPI } from '@/api/transfers';
import { useIbcStatisticsChains } from '@/store/index';
import tokenDefaultImg from '@/assets/token-default.png';
import { transferTableColumn, defaultTitle } from '@/constants';
import {
    IBC_TX_STATUS,
    IBC_SC_AND_DC_TX_STATUS,
    TRANSFERS_OUT_DETAILS,
    TRANSFERS_OUT_EXPAND_DETAILS,
    TRANSFERS_IN_DETAILS,
    TRANSFERS_IN_EXPAND_DETAILS
} from '@/constants/transfers';
import { ITransfersDetails, ITransfersExpandDetails } from '@/types/interface/transfers.interface';

export const useIbcDenoms = () => {
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const { ibcDenoms } = storeToRefs(ibcStatisticsChainsStore);
    onMounted(() => {
        ibcStatisticsChainsStore.getIbcDenomsAction();
    });
    return {
        ibcDenoms
    };
};

export const useSelectedSymbol = () => {
    const selectedSymbol = ref(defaultTitle.defaultTokens);
    const isShowSymbolIcon = ref(false);
    const clearInput = ref(0);
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
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const { ibcBaseDenomsSymbolKeyMapGetter } = storeToRefs(ibcStatisticsChainsStore);
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
    const isShowSymbol = (key: string) => {
        const result = {
            symbolDenom: '',
            symbolIcon: ''
        };
        if (Array.isArray(props.ibcBaseDenoms)) {
            const findSymbol = ibcBaseDenomsSymbolKeyMapGetter.value[key];
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
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const tableColumns = reactive(transferTableColumn);
    const showTransferLoading = ref(true);
    const ibcTxs = ibcStatisticsChainsStore.ibcTxs;
    const tableDatas = ref([...ibcTxs]);
    const tableCount = ref(0);
    const getIbcTxs = ibcStatisticsChainsStore.getIbcTxsAction;
    watch(
        () => tableDatas.value,
        () => {
            setIbcTxs();
        }
    );
    const setIbcTxs = (limitNumber = 10) => {
        ibcStatisticsChainsStore.ibcTxs = tableDatas.value.slice(0, limitNumber);
    };
    return {
        tableColumns,
        showTransferLoading,
        tableDatas,
        tableCount,
        getIbcTxs
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
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const route = useRoute();
    const router = useRouter();
    const ibcTransferOutTxHash = ref('--');
    const ibcTransferInTxHash = ref('--');
    const ibcTxStatus = ref(IBC_TX_STATUS.default);
    const outTxStatus = ref(IBC_SC_AND_DC_TX_STATUS.default);
    const inTxStatus = ref(IBC_SC_AND_DC_TX_STATUS.default);
    const sequence = ref('--');
    const baseDenom = ref('');
    const scChainId = ref('');
    const dcChainId = ref('');
    const transferOutDetails = reactive<ITransfersDetails[]>(TRANSFERS_OUT_DETAILS);
    const transferOutExpandDetails = reactive<ITransfersExpandDetails[]>(
        TRANSFERS_OUT_EXPAND_DETAILS
    );
    const transferInDetails = reactive<ITransfersDetails[]>(TRANSFERS_IN_DETAILS);
    const transferInExpandDetails = reactive<ITransfersExpandDetails[]>(
        TRANSFERS_IN_EXPAND_DETAILS
    );
    watch(route, (newValue) => {
        if (newValue?.query?.hash) {
            getTxDetails();
        }
    });
    const getTxDetails = () => {
        ibcStatisticsChainsStore.isShowLoading = true;
        const hash: string = (route?.query?.hash || '') as string;
        getTxDetailsByTxHashAPI(hash)
            .then((result) => {
                ibcStatisticsChainsStore.isShowLoading = false;
                const { code, data } = result;
                if (code === API_CODE.success) {
                    if (data?.length === 1) {
                        const res = data[0];
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
                        if (Number(res?.dc_tx_info?.status) >= 0) {
                            inTxStatus.value = res.dc_tx_info.status as number;
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
                        const handleTransferDetails = (item: any, callback?: Function) => {
                            let result: any = res;
                            if (item?.dataKey?.includes('.')) {
                                const keys = item.dataKey.split('.');
                                if (keys?.length) {
                                    keys.forEach((key: string) => {
                                        result =
                                            result[key] || result[key] === 0 ? result[key] : '';
                                        item.value = result;
                                    });
                                }
                                callback && callback(item);
                            } else {
                                if (item.dataKey) {
                                    item.value = result[item.dataKey];
                                }
                            }
                        };
                        transferOutDetails.forEach((item) => {
                            handleTransferDetails(item);
                        });
                        transferOutExpandDetails.forEach((item) => {
                            handleTransferDetails(item);
                        });
                        transferInDetails.forEach((item) => {
                            handleTransferDetails(item, (item: any) => {
                                if (item.label === 'Received Token:' && res?.denoms?.dc_denom) {
                                    item.value = res.denoms.dc_denom;
                                }
                            });
                        });
                        transferInExpandDetails.forEach((item) => {
                            handleTransferDetails(item);
                        });
                    } else {
                        router.replace(`/searchResult?${route.query.hash}`);
                    }
                }
            })
            .catch((error) => {
                ibcStatisticsChainsStore.isShowLoading = false;
                console.error('getTxDetailsByTxHashAPI', error);
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
            getTxDetailsByTxHashAPI(Object.keys(route.query).join(''))
                .then((result) => {
                    const { code, data } = result;
                    if (code === API_CODE.success) {
                        if (data.length === 1) {
                            router.push(
                                `/transfers/details?hash=${Object.keys(route.query).join('')}`
                            );
                        }
                    }
                })
                .catch((error) => {
                    console.log('getTxDetailsByTxHashAPI', error);
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
