import { getTxDetailsByTxHashAPI, getTxDetailsViewSourceByTxHashAPI } from '@/api/transfers';
import { useMatchChainInfo } from '@/composables';
import { CHAIN_DEFAULT_ICON, RELAYER_DEFAULT_ICON, TOKEN_DEFAULT_ICON } from '@/constants';
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
import { drawDefaultIcon, getTextWidth } from '@/utils/urlTools';
import moveDecimal from 'move-decimal-point';
import * as djs from 'dayjs';
import { Ref } from 'vue';
import { useRouter } from 'vue-router';
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
    // 是否需要换行
    const isFlexColumn = ref<boolean>(false);

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
    let feeAmount = '';
    let tokenIcon = TOKEN_DEFAULT_ICON;
    let symbol = '';
    const matchBaseDenom = await getBaseDenomByKey(chainId, denom);
    if (matchBaseDenom) {
        feeAmount = `${formatBigNumber(
            moveDecimal(amount || 0, -matchBaseDenom.scale),
            undefined
        )} ${matchBaseDenom.symbol || denom}`;
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
                tokenInfoList.value.value = matchInfo.value?.feeAmount;
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
        return matchInfo.value?.symbol || props.tokenInfo?.base_denom;
    });
    const updateIsShowDetailsInfo = (newIsShow: boolean) => {
        if (!newIsShow) {
            isShowTokenDetailsInfo.value = newIsShow;
        }
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
    const relayerDcInfoList = ref<IInfoList>(RELAYER_INFO);
    const relayerScIcon = ref<string>(RELAYER_DEFAULT_ICON);
    const relayerDcIcon = ref<string>(RELAYER_DEFAULT_ICON);
    const fromAddressInfo = ref<IInfoList>(CHAIN_ADDRESS);
    const toAddressInfo = ref<IInfoList>(CHAIN_ADDRESS);
    watch(
        () => props.relayerInfo,
        (newRelayerInfo) => {
            if (newRelayerInfo) {
                relayerScInfoList.value.value = newRelayerInfo.sc_relayer.relayer_name;
                relayerDcInfoList.value.value = newRelayerInfo.dc_relayer.relayer_name;
                calculateTextLength(relayerScInfoList.value.value, emits, RELAYER_LABEL);
                calculateTextLength(relayerDcInfoList.value.value, emits, RELAYER_LABEL);
                relayerScIcon.value = newRelayerInfo.sc_relayer.icon || RELAYER_DEFAULT_ICON;
                relayerDcIcon.value = newRelayerInfo.dc_relayer.icon || RELAYER_DEFAULT_ICON;

                fromAddressInfo.value = {
                    label: 'Address',
                    value: newRelayerInfo.sc_relayer.relayer_addr
                };
                toAddressInfo.value = {
                    label: 'Address',
                    value: newRelayerInfo.dc_relayer.relayer_addr
                };
            }
        }
    );
    return {
        relayerScInfoList,
        relayerDcInfoList,
        relayerScIcon,
        relayerDcIcon,
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
            sequenceInfo.value.value = newSequence;
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
                ibcTxInfo.value?.refund_tx_info.ack
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
                if (
                    ibcTxInfo.value?.sc_tx_info.status === TRANSFER_DETAILS_STATUS.SUCCESS.value &&
                    ibcTxInfo.value?.dc_tx_info.height === DEFAULT_HEIGHT.default
                ) {
                    leftTxImg.value = IBC_TX_INFO_STATUS.success;
                    rightTxImg.value = IBC_TX_INFO_STATUS.unknown;
                    progressData.value = NO_SECOND;

                    break;
                }
                if (
                    ibcTxInfo.value?.dc_tx_info.status === TRANSFER_DETAILS_STATUS.SUCCESS.value &&
                    ibcTxInfo.value?.dc_tx_info.ack?.includes('error')
                ) {
                    leftTxImg.value = IBC_TX_INFO_STATUS.success;
                    rightTxImg.value = IBC_TX_INFO_STATUS.success;
                    progressData.value = SUCCESS_ARRIVE;
                    break;
                }
                if (
                    ibcTxInfo.value?.dc_tx_info.status === TRANSFER_DETAILS_STATUS.FAILED.value &&
                    ibcTxInfo.value?.dc_tx_info.height > DEFAULT_HEIGHT.default
                ) {
                    leftTxImg.value = IBC_TX_INFO_STATUS.success;
                    rightTxImg.value = IBC_TX_INFO_STATUS.failed;
                    progressData.value = SECOND_ERROR;
                    break;
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
    const searchTxImg = computed(() => {
        if (props.txImg !== '--') {
            return drawDefaultIcon(`../assets/transfers/${props.txImg}.png`);
        }
    });
    const searchTxAdaptorImg = computed(() => {
        if (props.txImg !== '--') {
            return drawDefaultIcon(`../assets/transfers/${props.txImg}_small.png`);
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
            if (item.isFormatStatus) {
                item.value = formatStatus(item.value);
            } else if (item.isFormatFee) {
                item.value = await formatFee(item.value);
            } else if (item.isFormatSigner) {
                item.value = formatSigner(item.value);
            } else if (item.isFormatTimestamp) {
                item.value = formatTimestamp(item.value);
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
                return '--';
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
                    return result.feeAmount;
                }
            case PROGRESS_STEP[2]:
                if (dcInfo.value) {
                    const result = await getMatchBaseDenom(
                        dcInfo.value.chain_id,
                        feeDenom,
                        feeAmount
                    );
                    return result.feeAmount;
                }
            default:
                return '--';
        }
    };
    const formatSigner = (signers: string[] | string) => {
        if (typeof signers === 'string') return signers;
        return signers[0];
    };
    const formatTimestamp = (timestamp: number | string) => {
        if (typeof timestamp === 'string') return timestamp;
        const dayjs = djs?.default || djs;
        const date = ref('');
        if (timestamp > 0) {
            date.value = `${dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')} (${formatAge(
                getTimestamp(),
                timestamp * 1000,
                'ago',
                '>'
            )})`;
            setTimeout(() => {
                date.value = `${dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')} (${formatAge(
                    getTimestamp(),
                    timestamp * 1000,
                    'ago',
                    '>'
                )})`;
            }, 1000);
        } else {
            date.value = '--';
        }
        return date.value;
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
                changeProgressListAll(
                    PROGRESS_LIST,
                    PROGRESS_RECEIVE_LIST,
                    ibcTxInfo.value?.dc_tx_info
                );
                break;
            case PROGRESS_STEP[3]:
                changeProgressListAll(
                    PROGRESS_LIST,
                    PROGRESS_ACKNOWLEDGE_LIST,
                    ibcTxInfo.value?.refund_tx_info
                );
                break;
            case PROGRESS_STEP[4]:
                changeProgressListAll(
                    PROGRESS_LIST,
                    PROGRESS_TIMEOUT_LIST,
                    ibcTxInfo.value?.refund_tx_info
                );
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

    return {
        progressListAll,
        changeColor
    };
};

export const useViewSource = (props: IUseViewSOurce) => {
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const tableExpand = drawDefaultIcon('../assets/transfers/table_expand.png');
    const tablePackUp = drawDefaultIcon('../assets/transfers/table_packup.png');
    const activeKey = ref<string>('1');
    // 根据 chain_id 和 msg_type 发请求获取 JSON 数据；
    let chainId: string | undefined = '--';
    let msgType: string | undefined = '--';
    const JSONSource = ref<IIbcSource | undefined>();
    const sourceCode = ref();
    const { scInfo, dcInfo, ibcTxInfo } = toRefs(props);
    watch(
        () => props.mark,
        async (newMark) => {
            if (newMark && scInfo && dcInfo && ibcTxInfo) {
                switch (newMark.step) {
                    case PROGRESS_STEP[1]:
                        msgType = ibcTxInfo.value?.sc_tx_info.type;
                    case PROGRESS_STEP[3]:
                        msgType = ibcTxInfo.value?.refund_tx_info.type;
                    case PROGRESS_STEP[4]:
                        chainId = scInfo.value?.chain_id;
                        msgType = ibcTxInfo.value?.refund_tx_info.type;
                        break;
                    case PROGRESS_STEP[2]:
                        chainId = dcInfo.value?.chain_id;
                        msgType = ibcTxInfo.value?.dc_tx_info.type;
                        break;
                }
            }
            if (chainId && msgType && ibcTxInfo?.value) {
                switch (newMark.step) {
                    case PROGRESS_STEP[1]:
                        JSONSource.value = await getIbcSource(
                            ibcTxInfo.value.sc_tx_info.tx_hash,
                            chainId,
                            msgType
                        );
                        break;
                    case PROGRESS_STEP[3]:
                    case PROGRESS_STEP[4]:
                        JSONSource.value = await getIbcSource(
                            ibcTxInfo.value.refund_tx_info.tx_hash,
                            chainId,
                            msgType
                        );
                        break;
                    case PROGRESS_STEP[2]:
                        JSONSource.value = await getIbcSource(
                            ibcTxInfo.value.dc_tx_info.tx_hash,
                            chainId,
                            msgType
                        );
                        break;
                }
                return JSONSource;
            }
        }
    );
    const getIbcSource = async (hash: string, chainId: string, msgType: string) => {
        ibcStatisticsChainsStore.isShowLoading = true;
        const params = { chain_id: chainId, msg_type: msgType };

        try {
            const { code, message, data } = await getTxDetailsViewSourceByTxHashAPI(hash, params);
            ibcStatisticsChainsStore.isShowLoading = false;
            if (code === API_CODE.success) {
                return data;
            } else {
                console.error(message);
            }
        } catch (error) {
            console.log(error);
            ibcStatisticsChainsStore.isShowLoading = false;
        }
    };
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
