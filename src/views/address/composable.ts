import { getAddressBaseInfoAPI, getAddressTxsAPI } from '@/api/address';
import { CHAIN_DEFAULT_ICON, DEFAULT_DISPLAY_TEXT, NoDataType, TRANSFER_TYPE } from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import ChainHelper from '@/helper/chainHelper';
import { getTextWidth } from '@/utils/urlTools';
import QRCode from 'qrcodejs2-fix';
import { useWindowSize } from '@vueuse/core';
import type { IPaginationParams } from '@/types/interface/index.interface';
import type {
    IRequestAddressTxs,
    IResponseAddressTxs,
    IResponseAddressTxsData,
    IResponseAddressTxsFormat
} from '@/types/interface/address.interface';
import { dayjsFormatDate } from '@/utils/timeTools';
import { IN_OUT_TAG } from '@/constants/address';
import { formatBigNumber } from '@/helper/parseStringHelper';

export const useGetChainAddress = () => {
    const route = useRoute();
    const currentChain = route.query?.chain as string;
    const currentAddress = (route.params.address as string).toLowerCase();
    return {
        currentChain,
        currentAddress
    };
};

export const useGetBaseInfo = () => {
    const router = useRouter();
    const { currentChain, currentAddress } = useGetChainAddress();
    const addressParams = {
        chain: currentChain,
        address: currentAddress
    };
    const currentChainInfo = reactive({
        chainLogo: CHAIN_DEFAULT_ICON,
        prettyName: DEFAULT_DISPLAY_TEXT,
        isShowTooltip: false
    });
    const baseInfoLoading = ref<boolean>(true);
    const baseInfo = reactive({
        address: currentAddress,
        keyAlgorithm: DEFAULT_DISPLAY_TEXT,
        accountSequence: DEFAULT_DISPLAY_TEXT,
        pubKey: DEFAULT_DISPLAY_TEXT
    });
    const { width: widthClient } = useWindowSize();
    const isShowTooltip = ref<boolean>(false);
    const getAddressBaseInfo = async () => {
        baseInfoLoading.value = true;
        try {
            const { code, message, data } = await getAddressBaseInfoAPI(addressParams);
            if (code === API_CODE.success) {
                if (data) {
                    baseInfo.keyAlgorithm = data.pub_key_algorithm || DEFAULT_DISPLAY_TEXT;
                    baseInfo.accountSequence = data.account_sequence || DEFAULT_DISPLAY_TEXT;
                    baseInfo.pubKey = data.pub_key || DEFAULT_DISPLAY_TEXT;
                } else {
                    console.log(message);
                }
            } else if (code === API_CODE.noMatchAddress) {
                router.push(`/searchResult/${currentAddress}?chain=${currentChain}`);
            } else {
                console.log(message);
            }
            baseInfoLoading.value = false;
        } catch (error) {
            console.log(error);
            baseInfoLoading.value = false;
        }
    };
    const getMatchChainInfo = async () => {
        const chainInfo = await ChainHelper.getChainInfoByKey(currentChain);
        if (chainInfo) {
            currentChainInfo.chainLogo = chainInfo.icon;
            currentChainInfo.prettyName = chainInfo.pretty_name;
        } else {
            currentChainInfo.chainLogo = CHAIN_DEFAULT_ICON;
            currentChainInfo.prettyName = DEFAULT_DISPLAY_TEXT;
        }
    };
    const prettyNameSize = computed(() => {
        return getTextWidth(currentChainInfo.prettyName, '16px GolosUI_Medium');
    });
    watch([prettyNameSize, widthClient], ([newPrettyNameSize, newWidthClient]) => {
        if (newWidthClient > 895) {
            isShowTooltip.value = newPrettyNameSize > 120;
        } else {
            isShowTooltip.value = newPrettyNameSize > 240;
        }
    });
    onMounted(() => {
        if (!currentChain) {
            router.push(`/searchResult/${currentAddress}`);
        } else {
            getAddressBaseInfo();
            getMatchChainInfo();
        }
    });
    return {
        baseInfoLoading,
        baseInfo,
        currentChainInfo,
        isShowTooltip
    };
};

export const useCreateQRCode = () => {
    const { currentAddress } = useGetChainAddress();
    const qrCodeDom = ref<HTMLElement>();
    const qrcode = ref();
    const createQRCode = (currentAddress: string) => {
        const addressQRCode = qrCodeDom.value;
        qrcode.value = new QRCode(addressQRCode, {
            width: 80,
            height: 80,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.L
        });
        qrcode.value.clear();
        qrcode.value.makeCode(currentAddress);
    };
    onMounted(() => {
        createQRCode(currentAddress);
    });
    onBeforeUnmount(() => {
        qrcode.value.clear();
    });
    return {
        qrCodeDom
    };
};

export const useGetAddressTxs = (pagination: IPaginationParams) => {
    const { currentAddress, currentChain } = useGetChainAddress();
    const addressTxsLoading = ref<boolean>(true);
    const addressPageisDisabled = ref<boolean>(true);
    const loadingCondition = ref<NoDataType>();
    const addressTxsList = ref<IResponseAddressTxsFormat[]>([]);
    const showSubTitle = ref<boolean>(true);
    const showDefaultTotal = ref<boolean>(true);
    const formatData = (dateData: IResponseAddressTxs[]) => {
        const formatDateData = dateData.map((item) => {
            let tag: string;
            if (
                item.tx_type === TRANSFER_TYPE.acknowledge.type ||
                item.tx_type === TRANSFER_TYPE.timeout.type
            ) {
                item.sender = DEFAULT_DISPLAY_TEXT;
                item.receiver = DEFAULT_DISPLAY_TEXT;
                tag = '';
            } else if (item.tx_type === TRANSFER_TYPE.receive.type) {
                tag = IN_OUT_TAG.in;
            } else if (item.tx_type === TRANSFER_TYPE.transfer.type) {
                tag = IN_OUT_TAG.out;
            } else {
                tag = '';
            }
            const format_tx_time = dayjsFormatDate(item.tx_time * 1000, 'YY-MM-DD HH:mm:ss');
            return {
                ...item,
                format_tx_time,
                tag
            };
        });
        return formatDateData;
    };
    // 发请求获取表格数据
    const getAddressTxs = async (params: IRequestAddressTxs) => {
        if (params.use_count) {
            addressPageisDisabled.value = true;
            showDefaultTotal.value = true;
        } else {
            addressTxsLoading.value = true;
            showDefaultTotal.value = false;
        }
        loadingCondition.value = undefined;
        showSubTitle.value = true;
        try {
            const { code, message, data } = await getAddressTxsAPI({ ...params });
            if (code === API_CODE.success) {
                if (data) {
                    if (params.use_count) {
                        pagination.total = data as number;
                        showDefaultTotal.value = false;
                        addressPageisDisabled.value = false;
                    } else {
                        addressTxsList.value = formatData((data as IResponseAddressTxsData).txs);
                        addressTxsLoading.value = false;
                    }
                } else {
                    addressTxsLoading.value = false;
                    addressPageisDisabled.value = false;
                    loadingCondition.value = NoDataType.noData;
                    console.log(message);
                }
            } else if (code === API_CODE.noMatchAddress) {
                // todo shan 确定此处的展示情况：chain 和 address 未找到对应匹配情况
            } else {
                addressTxsLoading.value = false;
                addressPageisDisabled.value = false;
                loadingCondition.value = NoDataType.loadFailed;
                showSubTitle.value = false;
                console.log(message);
            }
        } catch (error) {
            addressTxsLoading.value = false;
            addressPageisDisabled.value = false;
            loadingCondition.value = NoDataType.loadFailed;
            showSubTitle.value = false;
            console.log(error);
        }
    };
    const onPaginationChange = (current: number, pageSize: number) => {
        pagination.current = current;
        getAddressTxs({
            chain: currentChain,
            address: currentAddress,
            page_num: pagination.current,
            page_size: pageSize,
            use_count: false
        });
    };
    const getTxsSubtitle = (showDefault: boolean, total: number) => {
        // todo shan 检查出现的问题 total 有关？
        const displayTotal = !showDefault ? formatBigNumber(total || '0', 0) : DEFAULT_DISPLAY_TEXT;
        return `A total of ${displayTotal} IBC Transactions found`;
    };
    const subTitle = computed(() => {
        return showSubTitle ? getTxsSubtitle(showDefaultTotal.value, pagination.total) : '';
    });
    onMounted(() => {
        getAddressTxs({
            chain: currentChain,
            address: currentAddress,
            page_num: 1,
            page_size: 5,
            use_count: true
        });
        getAddressTxs({
            chain: currentChain,
            address: currentAddress,
            page_num: pagination.current,
            page_size: pagination.pageSize,
            use_count: false
        });
    });
    return {
        currentChain,
        currentAddress,
        addressTxsLoading,
        addressPageisDisabled,
        // loadingCondition,
        addressTxsList,
        onPaginationChange,
        subTitle
    };
};
