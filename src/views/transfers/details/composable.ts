import { getTxDetailsByTxHashAPI, getTxDetailsViewSourceByTxHashAPI } from '@/api/transfers';
import { useMatchChainInfo } from '@/composables';
import {
    CHAIN_DEFAULT_ICON,
    DEFAULT_DISPLAY_TEXT,
    RELAYER_DEFAULT_ICON,
    TOKEN_DEFAULT_ICON
} from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import {
    CHAIN_ADDRESS,
    ICON_MARGIN_RIGHT_WIDTH,
    CHAIN_ID_LABEL,
    CHAIN_INFO_LIST,
    CHAIN_INFO_LIST_EXPAND,
    DEFAULT_HEIGHT,
    IBC_TX_INFO_STATUS,
    IBC_TX_STATUS,
    MAX_ALLOW_WIDTH,
    RELAYER_INFO,
    RELAYER_LABEL,
    SEQUENCE_INFO,
    TOKEN_INFO_LIST,
    TOKEN_INFO_LIST_EXPAND,
    SUCCESS_ARRIVE,
    SUCCESS_NO_ACK,
    PROCCESSING_FIRST_ERROR,
    NO_SECOND,
    SECOND_ERROR,
    PROGRESS_LIST,
    PROGRESS_STEP,
    PROGRESS_TRANSFER_LIST,
    PROGRESS_RECEIVE_LIST,
    PROGRESS_ACKNOWLEDGE_LIST,
    PROGRESS_TIMEOUT_LIST,
    TRANSFER_DETAILS_STATUS
} from '@/constants/transfers';
import { getBaseDenomByKey } from '@/helper/baseDenomHelper';
import { formatBigNumber } from '@/helper/parseStringHelper';
import { useIbcStatisticsChains } from '@/store';
import type { IAmountDenom } from '@/types/interface/index.interface';
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
    IUseTxImg,
    IProgress,
    IIbcTxSourceInfo,
    IUseViewSOurce,
    IUseProgressList,
    IIbcSource
} from '@/types/interface/transfers.interface';
import { formatAge, getTimestamp } from '@/utils/timeTools';
import { getTextWidth } from '@/utils/urlTools';
import moveDecimal from 'move-decimal-point';
import * as djs from 'dayjs';
import { Ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getJSONData } from '@/helper/jsonHelper';

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
    const route = useRoute();
    // 界面所需数据
    const ibcTxStatus = ref<number>(IBC_TX_STATUS.default);
    const errorLog = ref<string>('No error message feedback.');
    const tokenInfo = ref<ITokenInfo>();
    const scInfo = ref<ITxInfo>();
    const dcInfo = ref<ITxInfo>();
    const relayerInfo = ref<IRelayerInfo>();
    const sequence = ref<string>(DEFAULT_DISPLAY_TEXT);
    const ibcTxInfo = ref<IIbcTxInfo>();
    // 是否需要换行
    const isFlexColumn = ref<boolean>(false);

    const getTransferDetails = async () => {
        ibcStatisticsChainsStore.isShowLoading = true;
        const hash: string = (route?.query?.hash || '') as string;
        try {
            const { code, data, message } = await getTxDetailsByTxHashAPI(hash);
            ibcStatisticsChainsStore.isShowLoading = false;
            if (code === API_CODE.success) {
                if (data) {
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
                    router.replace(`/searchResult?${hash}`);
                }
            } else {
                console.error(message);
            }
        } catch (error) {
            ibcStatisticsChainsStore.isShowLoading = false;
            console.log(error);
        }
    };
    watch(route, (newValue) => {
        if (newValue?.query?.hash) {
            getTransferDetails();
        }
    });
    onMounted(() => {
        getTransferDetails();
    });
    const updateIsFlexColumn = (newIsFlexCoumn: boolean) => {
        isFlexColumn.value = newIsFlexCoumn;
    };
    return {
        getTransferDetails,
        ibcTxStatus,
        errorLog,
        tokenInfo,
        scInfo,
        dcInfo,
        relayerInfo,
        sequence,
        ibcTxInfo,
        isFlexColumn,
        updateIsFlexColumn
    };
};
const handleTransferDetails = (item: any, infoList: any, callback?: Function) => {
    let result: any = infoList;
    if (item?.dataKey?.includes('.')) {
        const keys = item.dataKey.split('.');
        if (keys?.length) {
            keys.forEach((key: string) => {
                result = result[key] || result[key] === 0 ? result[key] : DEFAULT_DISPLAY_TEXT;
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

const calculateTextLength = (
    text: string,
    emits: (e: 'updateIsFlexColumn', newIsFlexColumn: boolean) => void,
    label?: string
) => {
    let textLength = getTextWidth(text);
    if (textLength) {
        if (label) {
            if (label === CHAIN_ID_LABEL) {
                textLength += ICON_MARGIN_RIGHT_WIDTH;
            }
            if (label === RELAYER_LABEL) {
                textLength += ICON_MARGIN_RIGHT_WIDTH;
            }
        }
        if (textLength > MAX_ALLOW_WIDTH) {
            emits('updateIsFlexColumn', true);
        }
    }
};

const getMatchBaseDenom = async (chainId: string, denom: string, amount: string) => {
    let feeAmount = amount;
    let tokenIcon = TOKEN_DEFAULT_ICON;
    let symbol = denom;
    const matchBaseDenom = await getBaseDenomByKey(chainId, denom);
    if (matchBaseDenom) {
        feeAmount = `${formatBigNumber(
            moveDecimal(amount || 0, -matchBaseDenom.scale),
            undefined
        )}`;
        tokenIcon = matchBaseDenom.icon;
        symbol = matchBaseDenom.symbol;
    }
    return {
        feeAmount,
        tokenIcon,
        symbol
    };
};
// token_info
export const useTokenInfo = (props: Readonly<IUseTokenInfo>) => {
    const tokenInfoList = ref<IInfoList>(TOKEN_INFO_LIST);
    const tokenInfoListExpand = ref<IInfoList[]>(TOKEN_INFO_LIST_EXPAND);
    // 是否展示 Token 缩略
    const isShowTokenDetailsInfo = ref<boolean>(false);
    const matchInfo = ref();
    watch(
        () => props.tokenInfo,
        async (newTokenInfo) => {
            if (newTokenInfo) {
                matchInfo.value = await getMatchBaseDenom(
                    newTokenInfo.base_denom_chain_id,
                    newTokenInfo.base_denom,
                    newTokenInfo.amount
                );
                tokenInfoList.value.value =
                    `${matchInfo.value.feeAmount} ${matchInfo.value.symbol}` ||
                    DEFAULT_DISPLAY_TEXT;
                tokenInfoListExpand.value.forEach((item) => {
                    handleTransferDetails(item, newTokenInfo);
                });
            }
        }
    );
    const tokenLogo = computed(() => {
        return matchInfo.value?.tokenIcon || TOKEN_DEFAULT_ICON;
    });
    const tokenName = computed(() => {
        return matchInfo.value?.symbol || props.tokenInfo?.base_denom || DEFAULT_DISPLAY_TEXT;
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
export const useChainInfo = (
    props: Readonly<IUseChainIfo>,
    emits: (e: 'updateIsFlexColumn', newIsFlexColumn: boolean) => void
) => {
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
                    value: newChainInfo.address || DEFAULT_DISPLAY_TEXT
                };
                chainInfoList.value = {
                    label: 'Chain ID',
                    value: newChainInfo.chain_id || DEFAULT_DISPLAY_TEXT
                };
                chainInfoListExpand.value = [
                    {
                        label: 'Port',
                        value: newChainInfo.port_id || DEFAULT_DISPLAY_TEXT
                    },
                    {
                        label: 'Channel ID',
                        value: newChainInfo.channel_id || DEFAULT_DISPLAY_TEXT
                    },
                    {
                        label: 'Connection ID',
                        value: newChainInfo.connection_id || DEFAULT_DISPLAY_TEXT
                    },
                    {
                        label: 'Client ID',
                        value: newChainInfo.client_id || DEFAULT_DISPLAY_TEXT
                    }
                ];
                const { chainIcon } = useMatchChainInfo(chainInfoList.value.value);
                searchChainIcon.value = chainIcon;
                calculateTextLength(chainInfoList.value.value, emits, CHAIN_ID_LABEL);
                chainInfoListExpand.value.forEach((item) => {
                    calculateTextLength(item.value, emits);
                });
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

export const useRelayerInfo = (
    props: Readonly<IUseRelayer>,
    emits: (e: 'updateIsFlexColumn', newIsFlexColumn: boolean) => void
) => {
    const relayerScInfoList = ref<IInfoList>(RELAYER_INFO);
    const relayerScIcon = ref<string>(RELAYER_DEFAULT_ICON);
    const fromAddressInfo = ref<IInfoList>(CHAIN_ADDRESS);
    const toAddressInfo = ref<IInfoList>(CHAIN_ADDRESS);
    watch(
        () => props.relayerInfo,
        (newRelayerInfo) => {
            if (newRelayerInfo) {
                relayerScInfoList.value.value =
                    newRelayerInfo.sc_relayer.relayer_name || DEFAULT_DISPLAY_TEXT;
                calculateTextLength(relayerScInfoList.value.value, emits, RELAYER_LABEL);
                relayerScIcon.value = newRelayerInfo.sc_relayer.icon || RELAYER_DEFAULT_ICON;

                fromAddressInfo.value = {
                    label: 'Address',
                    value: newRelayerInfo.sc_relayer.relayer_addr || DEFAULT_DISPLAY_TEXT
                };
                toAddressInfo.value = {
                    label: 'Address',
                    value: newRelayerInfo.dc_relayer.relayer_addr || DEFAULT_DISPLAY_TEXT
                };
            }
        }
    );
    return {
        relayerScInfoList,
        relayerScIcon,
        fromAddressInfo,
        toAddressInfo
    };
};

export const useSequenceInfo = (
    props: Readonly<IUseSequence>,
    emits: (e: 'updateIsFlexColumn', newIsFlexColumn: boolean) => void
) => {
    const sequenceInfo = ref<IInfoList>(SEQUENCE_INFO);
    watch(
        () => props.sequence,
        (newSequence) => {
            sequenceInfo.value.value = newSequence || DEFAULT_DISPLAY_TEXT;
            calculateTextLength(sequenceInfo.value.value, emits);
        }
    );
    return {
        sequenceInfo
    };
};

export const useChainName = (fromChainId: string, toChainId: string) => {
    const fromChainName = computed(() => {
        const { chainName } = useMatchChainInfo(fromChainId);
        return chainName;
    });
    const toChainName = computed(() => {
        const { chainName } = useMatchChainInfo(toChainId);
        return chainName;
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
    const progressData = ref<IProgress[]>(SUCCESS_ARRIVE);
    const currentProgress = ref<number>(0);
    watch(ibcTxStatus, (newIbcTxStatus) => {
        switch (newIbcTxStatus) {
            case IBC_TX_STATUS.success:
                leftTxImg.value = IBC_TX_INFO_STATUS.success;
                rightTxImg.value = IBC_TX_INFO_STATUS.success;
                ibcTxInfo.value?.refund_tx_info?.ack
                    ? (progressData.value = SUCCESS_ARRIVE)
                    : (progressData.value = SUCCESS_NO_ACK);
                break;
            case IBC_TX_STATUS.processing:
                leftTxImg.value = IBC_TX_INFO_STATUS.success;
                rightTxImg.value = IBC_TX_INFO_STATUS.proccessing;
                progressData.value = PROCCESSING_FIRST_ERROR;
                break;
            case IBC_TX_STATUS.failed:
                leftTxImg.value = IBC_TX_INFO_STATUS.failed;
                rightTxImg.value = IBC_TX_INFO_STATUS.unknown;
                progressData.value = PROCCESSING_FIRST_ERROR;
                break;
            case IBC_TX_STATUS.refund:
                if (ibcTxInfo.value?.sc_tx_info && ibcTxInfo.value?.dc_tx_info) {
                    if (
                        ibcTxInfo.value.sc_tx_info.status ===
                            TRANSFER_DETAILS_STATUS.SUCCESS.value &&
                        ibcTxInfo.value.dc_tx_info.height === DEFAULT_HEIGHT.default
                    ) {
                        leftTxImg.value = IBC_TX_INFO_STATUS.success;
                        rightTxImg.value = IBC_TX_INFO_STATUS.unknown;
                        progressData.value = NO_SECOND;
                        break;
                    }
                }
                if (ibcTxInfo.value?.dc_tx_info) {
                    if (
                        ibcTxInfo.value.dc_tx_info.status ===
                            TRANSFER_DETAILS_STATUS.SUCCESS.value &&
                        ibcTxInfo.value.dc_tx_info.ack?.includes('error')
                    ) {
                        leftTxImg.value = IBC_TX_INFO_STATUS.success;
                        rightTxImg.value = IBC_TX_INFO_STATUS.success;
                        progressData.value = SUCCESS_ARRIVE;
                        break;
                    }
                    if (
                        ibcTxInfo.value.dc_tx_info.status ===
                            TRANSFER_DETAILS_STATUS.FAILED.value &&
                        ibcTxInfo.value.dc_tx_info.height > DEFAULT_HEIGHT.default
                    ) {
                        leftTxImg.value = IBC_TX_INFO_STATUS.success;
                        rightTxImg.value = IBC_TX_INFO_STATUS.failed;
                        progressData.value = SECOND_ERROR;
                        break;
                    }
                }
                break;
        }
        currentProgress.value = progressData.value.length - 1;
    });
    const changeCurrent = (index: number) => {
        currentProgress.value = index;
    };
    return {
        leftTxImg,
        rightTxImg,
        progressData,
        currentProgress,
        changeCurrent
    };
};

// progress
export const useTxImg = (props: Readonly<IUseTxImg>) => {
    const successImg = new URL('../../../assets/transfers/success.png', import.meta.url).href;
    const successSmallImg = new URL('../../../assets/transfers/success_small.png', import.meta.url)
        .href;
    const proccessingImg = new URL('../../../assets/transfers/proccessing.png', import.meta.url)
        .href;
    const proccessingSmallImg = new URL(
        '../../../assets/transfers/proccessing_small.png',
        import.meta.url
    ).href;
    const failedImg = new URL('../../../assets/transfers/failed.png', import.meta.url).href;
    const failedSmallImg = new URL('../../../assets/transfers/failed_small.png', import.meta.url)
        .href;
    const unknownImg = new URL('../../../assets/transfers/unknown.png', import.meta.url).href;
    const unknownSmallImg = new URL('../../../assets/transfers/unknown_small.png', import.meta.url)
        .href;
    const searchTxImg = computed(() => {
        if (props.txImg !== DEFAULT_DISPLAY_TEXT) {
            switch (props.txImg) {
                case IBC_TX_INFO_STATUS.success:
                    return successImg;
                case IBC_TX_INFO_STATUS.proccessing:
                    return proccessingImg;
                case IBC_TX_INFO_STATUS.failed:
                    return failedImg;
                case IBC_TX_INFO_STATUS.unknown:
                    return unknownImg;
            }
        }
    });
    const searchTxAdaptorImg = computed(() => {
        if (props.txImg !== DEFAULT_DISPLAY_TEXT) {
            if (props.txImg !== DEFAULT_DISPLAY_TEXT) {
                switch (props.txImg) {
                    case IBC_TX_INFO_STATUS.success:
                        return successSmallImg;
                    case IBC_TX_INFO_STATUS.proccessing:
                        return proccessingSmallImg;
                    case IBC_TX_INFO_STATUS.failed:
                        return failedSmallImg;
                    case IBC_TX_INFO_STATUS.unknown:
                        return unknownSmallImg;
                }
            }
        }
    });
    return {
        searchTxImg,
        searchTxAdaptorImg
    };
};

// progress list
export const useProgressList = (props: Readonly<IUseProgressList>) => {
    const { ibcTxInfo, mark, scInfo, dcInfo } = toRefs(props);
    const progressListAll = ref<IInfoList[]>([]);
    const progressList = ref<IInfoList[]>([]);
    let timestampTimer: number;
    let timeoutstampTimer: number;
    const clearTimestampTimer = (timer: number) => {
        timer && clearInterval(timer);
    };
    const changeProgressListAll = (
        scProgressList: IInfoList[],
        differenceFileds: IInfoList[],
        sourceInfo: IIbcTxSourceInfo | undefined
    ) => {
        progressList.value = [...scProgressList, ...differenceFileds];
        progressList.value.forEach((item) => {
            handleTransferDetails(item, sourceInfo);
        });
        progressList.value.forEach(async (item) => {
            if (item.value !== '' && item.value !== DEFAULT_DISPLAY_TEXT) {
                if (item.isFormatStatus) {
                    item.value = formatStatus(item.value);
                } else if (item.isFormatFee) {
                    item.value = await formatFee(item.value);
                } else if (item.isFormatSigner) {
                    item.value = formatSigner(item.value);
                } else if (item.isFormatTimestamp) {
                    const saveTimestamp = item.value;
                    item.value = formatTimestamp(item.value);
                    clearTimestampTimer(timestampTimer);
                    timestampTimer = setInterval(() => {
                        item.value = formatTimestamp(saveTimestamp);
                    }, 1000);
                } else if (item.isFormatTimeoutTimestamp) {
                    const saveTimestamp = item.value;
                    item.value = formatTimeoutTimestamp(item.value);
                    clearTimestampTimer(timeoutstampTimer);
                    timeoutstampTimer = setInterval(() => {
                        item.value = formatTimeoutTimestamp(saveTimestamp);
                    }, 1000);
                }
            } else {
                item.value = DEFAULT_DISPLAY_TEXT;
            }
        });
        progressListAll.value = progressList.value;
    };
    const formatStatus = (status: number | string) => {
        if (typeof status === 'string') return status;
        switch (status) {
            case TRANSFER_DETAILS_STATUS.SUCCESS.value:
                return TRANSFER_DETAILS_STATUS.SUCCESS.label;
            case TRANSFER_DETAILS_STATUS.FAILED.value:
                return TRANSFER_DETAILS_STATUS.FAILED.label;
            default:
                return DEFAULT_DISPLAY_TEXT;
        }
    };
    const formatFee = async (amount: IAmountDenom[] | string) => {
        if (typeof amount === 'string') return amount;
        const feeAmount = amount[0].amount;
        const feeDenom = amount[0].denom;
        switch (mark.value.step) {
            case PROGRESS_STEP[1]:
            case PROGRESS_STEP[3]:
            case PROGRESS_STEP[4]:
                if (scInfo.value) {
                    const result = await getMatchBaseDenom(
                        scInfo.value.chain_id,
                        feeDenom,
                        feeAmount
                    );
                    return `${result.feeAmount} ${result.symbol}`;
                }
            case PROGRESS_STEP[2]:
                if (dcInfo.value) {
                    const result = await getMatchBaseDenom(
                        dcInfo.value.chain_id,
                        feeDenom,
                        feeAmount
                    );
                    return `${result.feeAmount} ${result.symbol}`;
                }
            default:
                return DEFAULT_DISPLAY_TEXT;
        }
    };
    const formatSigner = (signers: string[] | string) => {
        if (typeof signers === 'string') return signers;
        return (signers && signers[0]) || DEFAULT_DISPLAY_TEXT;
    };
    const formatTimestamp = (timestamp: number | string) => {
        const dayjs = djs?.default || djs;
        let date = '';
        const time = Number(timestamp);
        if (timestamp > 0) {
            if (time * 1000 > Date.now()) {
                date = `${dayjs(time * 1000).format('YYYY-MM-DD HH:mm:ss')}`;
            } else {
                date = `${dayjs(time * 1000).format('YYYY-MM-DD HH:mm:ss')} (${formatAge(
                    getTimestamp(),
                    time * 1000,
                    'ago',
                    '>'
                )})`;
            }
        } else {
            date = DEFAULT_DISPLAY_TEXT;
        }
        return date;
    };
    const formatTimeoutTimestamp = (timeoutStamp: number | string) => {
        if (typeof timeoutStamp === 'string') return timeoutStamp;
        const formatTimeoutStamp = (timeoutStamp / 1000000000).toFixed();
        return formatTimestamp(formatTimeoutStamp);
    };
    watch(mark, (newMark) => {
        switch (newMark.step) {
            case PROGRESS_STEP[1]:
                changeProgressListAll(
                    PROGRESS_LIST,
                    PROGRESS_TRANSFER_LIST,
                    ibcTxInfo.value?.sc_tx_info
                );
                break;
            case PROGRESS_STEP[2]:
                if (ibcTxInfo.value?.dc_tx_info) {
                    changeProgressListAll(
                        PROGRESS_LIST,
                        PROGRESS_RECEIVE_LIST,
                        ibcTxInfo.value.dc_tx_info
                    );
                }
                break;
            case PROGRESS_STEP[3]:
                if (ibcTxInfo.value?.refund_tx_info) {
                    changeProgressListAll(
                        PROGRESS_LIST,
                        PROGRESS_ACKNOWLEDGE_LIST,
                        ibcTxInfo.value.refund_tx_info
                    );
                }
                break;
            case PROGRESS_STEP[4]:
                if (ibcTxInfo.value?.refund_tx_info) {
                    changeProgressListAll(
                        PROGRESS_LIST,
                        PROGRESS_TIMEOUT_LIST,
                        ibcTxInfo.value.refund_tx_info
                    );
                }
                break;
        }
    });
    const changeColor = computed(() => {
        return (value: string) => {
            switch (value) {
                case 'Success':
                    return 'progress_list__success';
                case 'Failed':
                    return 'progress_list__failed';
                default:
                    return '';
            }
        };
    });
    onBeforeUnmount(() => {
        timestampTimer && clearTimestampTimer(timestampTimer);
        timeoutstampTimer && clearTimestampTimer(timeoutstampTimer);
    });

    return {
        progressListAll,
        changeColor,
        formatTimestamp,
        formatTimeoutTimestamp
    };
};

export const useViewSource = (props: IUseViewSOurce, loading: Ref<boolean>) => {
    const tableExpand = new URL('../../../assets/transfers/table_expand.png', import.meta.url).href;
    const tablePackUp = new URL('../../../assets/transfers/table_packup.png', import.meta.url).href;
    const activeKey = ref<string>('1');
    const JSONSource = ref<IIbcSource | undefined>();
    const sourceCode = ref();
    const { scInfo, dcInfo, ibcTxInfo, mark } = toRefs(props);
    const getIbcSource = async (hash: string, chainId: string, msgType: string) => {
        loading && (loading.value = true);
        const params = { chain_id: chainId, msg_type: msgType };
        try {
            const { code, message, data } = await getTxDetailsViewSourceByTxHashAPI(hash, params);
            loading && (loading.value = false);
            if (code === API_CODE.success) {
                return data;
            } else {
                console.error(message);
            }
        } catch (error) {
            console.log(error);
            loading && (loading.value = false);
        }
    };
    watch(
        () => mark,
        async (newMark) => {
            if (newMark && scInfo?.value && dcInfo?.value && ibcTxInfo?.value) {
                switch (newMark.value.step) {
                    case PROGRESS_STEP[1]:
                        JSONSource.value = await getIbcSource(
                            ibcTxInfo.value.sc_tx_info.tx_hash,
                            scInfo.value.chain_id,
                            ibcTxInfo.value.sc_tx_info.type
                        );
                        break;
                    case PROGRESS_STEP[2]:
                        if (ibcTxInfo.value.dc_tx_info) {
                            JSONSource.value = await getIbcSource(
                                ibcTxInfo.value.dc_tx_info.tx_hash,
                                dcInfo.value.chain_id,
                                ibcTxInfo.value.dc_tx_info.type
                            );
                        }
                        break;
                    case PROGRESS_STEP[3]:
                        if (ibcTxInfo.value.refund_tx_info) {
                            JSONSource.value = await getIbcSource(
                                ibcTxInfo.value.refund_tx_info.tx_hash,
                                scInfo.value.chain_id,
                                ibcTxInfo.value.refund_tx_info.type
                            );
                        }
                        break;
                    case PROGRESS_STEP[4]:
                        if (ibcTxInfo.value.refund_tx_info) {
                            JSONSource.value = await getIbcSource(
                                ibcTxInfo.value.refund_tx_info.tx_hash,
                                scInfo.value.chain_id,
                                ibcTxInfo.value.refund_tx_info.type
                            );
                        }
                        break;
                }
            }
        },
        { immediate: true, deep: true }
    );

    watch(JSONSource, (newJSONSource) => {
        if (newJSONSource) {
            sourceCode.value = getJSONData(newJSONSource);
        }
    });

    return {
        activeKey,
        JSONSource,
        sourceCode,
        tableExpand,
        tablePackUp
    };
};
