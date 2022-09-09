import { getTxDetailsByTxHashAPI } from '@/api/transfers';
import { TOKEN_DEFAULT_ICON } from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import { IBC_TX_STATUS, TOKEN_INFO_LIST, TOKEN_INFO_LIST_EXPAND } from '@/constants/transfers';
import { getBaseDenomByKey } from '@/helper/baseDenomHelper';
import { formatBigNumber } from '@/helper/parseStringHelper';
import { useIbcStatisticsChains } from '@/store';
import type { IBaseDenom } from '@/types/interface/index.interface';
import type { ITokenInfo, ITokenInfoList, ITxStatus } from '@/types/interface/transfers.interface';
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
        tokenInfo
    };
};

// token_info
interface IProps {
    tokenInfo: ITokenInfo | undefined;
}
export const useTokenInfo = (props: Readonly<IProps>) => {
    const tokenInfoList = ref<ITokenInfoList[]>(TOKEN_INFO_LIST);
    const tokenInfoListExpand = ref<ITokenInfoList[]>(TOKEN_INFO_LIST_EXPAND);
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
                    tokenInfoList.value[0].value = `${formatBigNumber(
                        moveDecimal(newTokenInfo.amount, -matchBaseDenom.value.scale),
                        undefined
                    )} ${matchBaseDenom.value.symbol || newTokenInfo.base_denom}`;
                }
                const handleTransferDetails = (item: any, callback?: Function) => {
                    let result: any = newTokenInfo;
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
                tokenInfoListExpand.value.forEach((item) => {
                    handleTransferDetails(item);
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

    const expandInfo = () => {
        isShowTokenDetailsInfo.value = !isShowTokenDetailsInfo.value;
    };

    return {
        tokenLogo,
        tokenName,
        tokenInfoList,
        tokenInfoListExpand,
        isShowTokenDetailsInfo,
        expandInfo
    };
};
