import { getAddressBaseInfoAPI } from '@/api/address';
import { CHAIN_DEFAULT_ICON, DEFAULT_DISPLAY_TEXT } from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import ChainHelper from '@/helper/chainHelper';
import { getTextWidth } from '@/utils/urlTools';
import QRCode from 'qrcodejs2-fix';
import { useWindowSize } from '@vueuse/core';

export const useGetBaseInfo = () => {
    const router = useRouter();
    const route = useRoute();
    const currentChain = route.query?.chain as string;
    const currentAddress = route.params.address as string;
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
                router.push(`/searchResult/${route.params.address}?chain=${currentChain}`);
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
    const route = useRoute();
    const currentAddress = route.params.address as string;
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
