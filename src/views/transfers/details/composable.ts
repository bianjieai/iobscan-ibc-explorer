import { getTxDetailsByTxHashAPI } from '@/api/transfers';
import { useMatchChainInfo } from '@/composables';
import { CHAIN_DEFAULT_ICON, RELAYER_DEFAULT_ICON, TOKEN_DEFAULT_ICON } from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import {
    CHAIN_ADDRESS,
    CHAIN_INFO_LIST,
    CHAIN_INFO_LIST_EXPAND,
    DEFAULT_HEIGHT,
    IBC_TX_INFO_STATUS,
    IBC_TX_STATUS,
    RELAYER_INFO,
    SEQUENCE_INFO,
    TOKEN_INFO_LIST,
    TOKEN_INFO_LIST_EXPAND
} from '@/constants/transfers';
import { getBaseDenomByKey } from '@/helper/baseDenomHelper';
import { formatBigNumber } from '@/helper/parseStringHelper';
import { useIbcStatisticsChains } from '@/store';
import type { IBaseDenom } from '@/types/interface/index.interface';
import type {
    ITxInfo,
    ITokenInfo,
    IInfoList,
    IRelayerInfo,
    IUseTokenInfo,
    IUseChainIfo,
    IUseSequence,
    ITxStatus,
    IUseRelayer,
    IIbcTxInfo,
    IUseTxImg
} from '@/types/interface/transfers.interface';
import moveDecimal from 'move-decimal-point';
import { Ref } from 'vue';
import { useRouter } from 'vue-router';

export const useJudgeStatus = (props: Readonly<ITxStatus>) => {
    const isShowSuccess = computed(() => {
        return props.status === IBC_TX_STATUS.success;
    });
    const isShowProcessing = computed(() => {
        return props.status === IBC_TX_STATUS.processing;
    });
    const isShowFailed = computed(() => {
        return props.status === IBC_TX_STATUS.failed || props.status === IBC_TX_STATUS.refund;
    });
    return {
        isShowSuccess,
        isShowProcessing,
        isShowFailed
    };
};

export const useTransfersDetailsInfo = () => {
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const router = useRouter();
    // const route = useRoute();
    // 界面所需数据
    const ibcTxStatus = ref<number>(IBC_TX_STATUS.default);
    const errorLog = ref<string>('No error message feedback.');
    const tokenInfo = ref<ITokenInfo>();
    const scInfo = ref<ITxInfo>();
    const dcInfo = ref<ITxInfo>();
    const relayerInfo = ref<IRelayerInfo>();
    const sequence = ref<string>('--');
    const ibcTxInfo = ref<IIbcTxInfo>();

    const getTransferDetails = async () => {
        ibcStatisticsChainsStore.isShowLoading = true;
        // todo shan 需要切换到正确的参数及请求
        // const hash: string = (route?.query?.hash || '') as string;
        try {
            const { code, data, message } = await getTxDetailsByTxHashAPI('%7Bhash%7D?a=1');
            // const {code, data, message} = await getTxDetailsByTxHashAPI(hash);
            ibcStatisticsChainsStore.isShowLoading = false;
            if (code === API_CODE.success) {
                if (!data.is_list) {
                    ibcTxStatus.value = data.status;
                    data.error_log && (errorLog.value = data.error_log);
                    tokenInfo.value = data.token_info;
                    scInfo.value = data.sc_info;
                    dcInfo.value = data.dc_info;
                    relayerInfo.value = data.relayer_info;
                    sequence.value = data.sequence;
                    ibcTxInfo.value = data.ibc_tx_info;
                } else {
                    router.push('/transfers');
                }
            } else {
                console.error(message);
            }
        } catch (error) {
            ibcStatisticsChainsStore.isShowLoading = false;
            console.log(error);
        }
    };

    onMounted(() => {
        getTransferDetails();
    });
    return {
        getTransferDetails,
        ibcTxStatus,
        errorLog,
        tokenInfo,
        scInfo,
        dcInfo,
        relayerInfo,
        sequence,
        ibcTxInfo
    };
};
const handleTransferDetails = (item: any, infoList: any, callback?: Function) => {
    let result: any = infoList;
    if (item?.dataKey?.includes('.')) {
        const keys = item.dataKey.split('.');
        if (keys?.length) {
            keys.forEach((key: string) => {
                result = result[key] || result[key] === 0 ? result[key] : '';
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
// token_info
export const useTokenInfo = (props: Readonly<IUseTokenInfo>) => {
    const tokenInfoList = ref<IInfoList>(TOKEN_INFO_LIST);
    const tokenInfoListExpand = ref<IInfoList[]>(TOKEN_INFO_LIST_EXPAND);
    // 是否展示 Token 缩略
    const isShowTokenDetailsInfo = ref<boolean>(false);
    const getMatchBaseDenom = async (chain_id: string, base_denom: string) => {
        const matchBaseDenom = await getBaseDenomByKey(chain_id, base_denom);
        return matchBaseDenom;
    };
    const matchBaseDenom = ref<IBaseDenom | undefined>();
    watch(
        () => props.tokenInfo,
        async (newTokenInfo) => {
            if (newTokenInfo !== undefined) {
                matchBaseDenom.value = await getMatchBaseDenom(
                    newTokenInfo.base_denom_chain_id,
                    newTokenInfo.base_denom
                );

                if (matchBaseDenom.value) {
                    tokenInfoList.value.value = `${formatBigNumber(
                        moveDecimal(newTokenInfo.amount, -matchBaseDenom.value.scale),
                        undefined
                    )} ${matchBaseDenom.value.symbol || newTokenInfo.base_denom}`;
                }

                tokenInfoListExpand.value.forEach((item) => {
                    handleTransferDetails(item, newTokenInfo);
                });
            }
        }
    );
    const tokenLogo = computed(() => {
        return matchBaseDenom.value?.icon || TOKEN_DEFAULT_ICON;
    });
    const tokenName = computed(() => {
        return matchBaseDenom.value?.symbol || props.tokenInfo?.base_denom;
    });
    const updateIsShowDetailsInfo = (newIsShow: boolean) => {
        isShowTokenDetailsInfo.value = newIsShow;
    };

    return {
        tokenLogo,
        tokenName,
        tokenInfoList,
        tokenInfoListExpand,
        isShowTokenDetailsInfo,
        updateIsShowDetailsInfo
    };
};

// sc_info dc_info
export const useChainInfo = (props: Readonly<IUseChainIfo>) => {
    const chainAddress = ref<IInfoList>(CHAIN_ADDRESS);
    const chainInfoList = ref<IInfoList>(CHAIN_INFO_LIST);
    const chainInfoListExpand = ref<IInfoList[]>(CHAIN_INFO_LIST_EXPAND);
    const searchChainIcon = ref<string>(CHAIN_DEFAULT_ICON);
    // 是否展示 Token 缩略
    const isShowChainDetailsInfo = ref<boolean>(false);
    watch(
        () => props.chainInfo,
        (newChainInfo) => {
            if (newChainInfo) {
                chainAddress.value = {
                    label: 'Address',
                    value: newChainInfo.address
                };
                chainInfoList.value = {
                    label: 'Chain ID',
                    value: newChainInfo.chain_id
                };
                chainInfoListExpand.value = [
                    {
                        label: 'Port',
                        value: newChainInfo.port_id
                    },
                    {
                        label: 'Channel ID',
                        value: newChainInfo.channel_id
                    },
                    {
                        label: 'Connection ID',
                        value: newChainInfo.connection_id
                    },
                    {
                        label: 'Client ID',
                        value: newChainInfo.client_id
                    }
                ];
                const { chainIcon } = useMatchChainInfo(chainInfoList.value.value);
                searchChainIcon.value = chainIcon.value;
            }
        }
    );
    const updateIsShowDetailsInfo = (newIsShow: boolean) => {
        isShowChainDetailsInfo.value = newIsShow;
    };

    return {
        chainAddress,
        chainInfoList,
        chainInfoListExpand,
        isShowChainDetailsInfo,
        searchChainIcon,
        updateIsShowDetailsInfo
    };
};

export const useRequenceInfo = (props: Readonly<IUseRelayer>) => {
    const relayerInfoList = ref<IInfoList>(RELAYER_INFO);
    const relayerIcon = ref<string>(RELAYER_DEFAULT_ICON);
    const fromAddressInfo = ref<IInfoList>(CHAIN_ADDRESS);
    const toAddressInfo = ref<IInfoList>(CHAIN_ADDRESS);
    watch(
        () => props.relayerInfo,
        (newRelayerInfo) => {
            if (newRelayerInfo) {
                relayerInfoList.value.value = newRelayerInfo.relayer_name;
                if (newRelayerInfo.icon) {
                    relayerIcon.value = newRelayerInfo.icon;
                }
                fromAddressInfo.value = {
                    label: 'Address',
                    value: newRelayerInfo.sc_relayer_addr
                };
                toAddressInfo.value = {
                    label: 'Address',
                    value: newRelayerInfo.dc_relayer_addr
                };
            }
        }
    );
    return {
        relayerInfoList,
        relayerIcon,
        fromAddressInfo,
        toAddressInfo
    };
};

export const useSequenceInfo = (props: Readonly<IUseSequence>) => {
    const sequenceInfo = ref<IInfoList>(SEQUENCE_INFO);
    watch(
        () => props.sequence,
        (newSequence) => {
            sequenceInfo.value.value = newSequence;
        }
    );
    return {
        sequenceInfo
    };
};

export const useChainName = (fromChainId: string, toChainId: string) => {
    const fromChainName = computed(() => {
        const { chainName } = useMatchChainInfo(fromChainId);
        return chainName.value;
    });
    const toChainName = computed(() => {
        const { chainName } = useMatchChainInfo(toChainId);
        return chainName.value;
    });
    return {
        fromChainName,
        toChainName
    };
};

// ibc_tx_info
export const useIbcTxInfo = (ibcTxStatus: Ref<number>, ibcTxInfo: Ref<IIbcTxInfo | undefined>) => {
    const leftTxImg = ref<string>(IBC_TX_INFO_STATUS.unknown);
    const rightTxImg = ref<string>(IBC_TX_INFO_STATUS.unknown);
    watch(ibcTxStatus, (newIbcTxStatus) => {
        console.log(newIbcTxStatus, 'newVal');
        switch (newIbcTxStatus) {
            case IBC_TX_STATUS.success:
                leftTxImg.value = IBC_TX_INFO_STATUS.success;
                rightTxImg.value = IBC_TX_INFO_STATUS.success;
                break;
            case IBC_TX_STATUS.processing:
                leftTxImg.value = IBC_TX_INFO_STATUS.success;
                rightTxImg.value = IBC_TX_INFO_STATUS.proccessing;
                break;
            case IBC_TX_STATUS.failed:
                leftTxImg.value = IBC_TX_INFO_STATUS.failed;
                rightTxImg.value = IBC_TX_INFO_STATUS.unknown;
                break;
            case IBC_TX_STATUS.refund:
                if (ibcTxInfo.value?.dc_tx_info.height === DEFAULT_HEIGHT.default) {
                    leftTxImg.value = IBC_TX_INFO_STATUS.success;
                    rightTxImg.value = IBC_TX_INFO_STATUS.unknown;
                    break;
                }
                if (ibcTxInfo.value?.dc_tx_info.status === IBC_TX_STATUS.success) {
                    leftTxImg.value = IBC_TX_INFO_STATUS.success;
                    rightTxImg.value = IBC_TX_INFO_STATUS.success;
                    break;
                }
                if (
                    ibcTxInfo.value?.dc_tx_info.status === IBC_TX_STATUS.failed &&
                    ibcTxInfo.value?.dc_tx_info.height > DEFAULT_HEIGHT.default
                ) {
                    leftTxImg.value = IBC_TX_INFO_STATUS.success;
                    rightTxImg.value = IBC_TX_INFO_STATUS.failed;
                    break;
                }
                break;
        }
    });
    return {
        leftTxImg,
        rightTxImg
    };
};

// progress
export const useTxImg = (props: Readonly<IUseTxImg>) => {
    const searchTxImg = computed(() => {
        if (props.txImg !== '--') {
            return new URL(`../../../assets/transfers/${props.txImg}.png`, import.meta.url).href;
        }
    });
    const searchTxAdaptorImg = computed(() => {
        if (props.txImg !== '--') {
            return new URL(`../../../assets/transfers/${props.txImg}_small.png`, import.meta.url)
                .href;
        }
    });
    return {
        searchTxImg,
        searchTxAdaptorImg
    };
};
