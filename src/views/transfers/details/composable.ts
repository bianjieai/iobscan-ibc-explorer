import { getTxDetailsByTxHashAPI } from '@/api/transfers';
import { TOKEN_DEFAULT_ICON } from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import {
    CHAIN_ADDRESS,
    CHAIN_INFO_LIST,
    CHAIN_INFO_LIST_EXPAND,
    IBC_TX_STATUS,
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
    IUseChainIfo
} from '@/types/interface/transfers.interface';
import moveDecimal from 'move-decimal-point';
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
        sequence
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
    // 是否展示 Token 缩略
    const isShowChainDetailsInfo = ref<boolean>(false);
    watch(
        () => props.chainInfo,
        (newChainInfo) => {
            if (newChainInfo) {
                chainAddress.value.value = newChainInfo.address;
                chainInfoList.value.value = newChainInfo.chain_id;
                chainInfoListExpand.value.forEach((item) => {
                    handleTransferDetails(item, newChainInfo);
                });
            }
        }
    );

    return {
        chainAddress,
        chainInfoList,
        chainInfoListExpand,
        isShowChainDetailsInfo
    };
};
