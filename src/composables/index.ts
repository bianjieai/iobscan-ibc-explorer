import { onMounted, onBeforeUnmount, Ref } from 'vue';
import {
    AGE_TIMER_INTERVAL,
    PAGE_PARAMETERS,
    NEED_CUSTOM_COLUMN,
    CHAIN_DEFAULT_ICON,
    SYMBOL,
    NEED_CUSTOM_HEADER,
    TOKEN_DEFAULT_ICON,
    DEFAULT_DISPLAY_TEXT
} from '@/constants';
import { useIbcStatisticsChains } from '@/store';
import { DATA_REFRESH_GAP } from '@/constants/home';
import { IBaseDenom } from '@/types/interface/index.interface';
import { getBaseDenomByKey } from '@/helper/baseDenomHelper';
import moveDecimal from 'move-decimal-point';
import { handleImgLoadingSussess } from '@/utils/imageTools';

export const useTimeInterval = (intervalCallBack: Function, interval = AGE_TIMER_INTERVAL) => {
    let timer: number | null = null;
    intervalCallBack();
    onMounted(() => {
        if (!timer) {
            timer = setInterval(intervalCallBack, interval);
        }
    });
    onBeforeUnmount(() => {
        if (timer) {
            clearInterval(timer);
        }
    });
    return timer;
};

export const useChangeTitleAndIcon = () => {
    const link: HTMLLinkElement =
        document.querySelector('link[rel *= "icon"]') || document.createElement('link');
    const title: HTMLTitleElement =
        document.querySelector('title') || document.createElement('title');
    link.rel = 'icon';
    link.href = import.meta.env.VITE_FAVICON;
    title.innerHTML = import.meta.env.VITE_TITLE;
    document.getElementsByTagName('head')[0].appendChild(link);
    document.getElementsByTagName('head')[0].appendChild(title);
};

// table 中需要格式化的列
export const useNeedCustomColumns = (whitePage: string) => {
    const needCustomColumns = ref<string[]>([]);
    const needCustomHeaders = ref<string[]>([]);

    switch (whitePage) {
        case PAGE_PARAMETERS.tokens:
            needCustomColumns.value = NEED_CUSTOM_COLUMN.tokens;
            break;
        case PAGE_PARAMETERS.ibcToken:
            needCustomColumns.value = NEED_CUSTOM_COLUMN.ibcToken;
            break;
        case PAGE_PARAMETERS.chains:
            needCustomColumns.value = NEED_CUSTOM_COLUMN.chains;
            break;
        case PAGE_PARAMETERS.channels:
            needCustomColumns.value = NEED_CUSTOM_COLUMN.channels;
            break;
        case PAGE_PARAMETERS.relayers:
            needCustomColumns.value = NEED_CUSTOM_COLUMN.relayers;
            break;
        case PAGE_PARAMETERS.transfers:
            needCustomColumns.value = NEED_CUSTOM_COLUMN.transfers;
            needCustomHeaders.value = NEED_CUSTOM_HEADER.transfers;
            break;
        case PAGE_PARAMETERS.relayerDetails:
            needCustomColumns.value = NEED_CUSTOM_COLUMN.relayerDetails;
    }
    return {
        needCustomColumns,
        needCustomHeaders
    };
};

export const useLoading = () => {
    const loading = ref(false);
    return {
        loading
    };
};

export const useIbcChains = (timerInterval?: number) => {
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const { ibcChains, isDocumentHidden } = storeToRefs(ibcStatisticsChainsStore);
    const getIbcChains = ibcStatisticsChainsStore.getIbcChainsAction;
    let timer: number;
    const intervalIbcChains = () => {
        timer = setInterval(() => {
            console.log('getIbcChains', timerInterval);
            getIbcChains(false);
        }, timerInterval);
    };

    const lifeFunction = () => {
        onMounted(() => {
            getIbcChains();
            if (Number(timerInterval) > 0) {
                intervalIbcChains();
            }
        });
        onBeforeUnmount(() => {
            timer && clearInterval(timer);
        });
        watch(isDocumentHidden, (newDocumentHidden) => {
            newDocumentHidden && timer ? clearInterval(timer) : intervalIbcChains();
        });
    };
    return {
        ibcChains,
        getIbcChains,
        lifeFunction
    };
};

// 重置状态跳转及点击跳转
export const useResetSearch = () => {
    // reset
    const resetSearch = (resetRoute?: string) => {
        location.href = resetRoute || location.href.split('?')[0];
    };
    return {
        resetSearch
    };
};

// 判断是否滚动到底部或是最上面
export const useBoundary = (ele: HTMLElement) => {
    const res = ref({
        top: false,
        bottom: false
    });

    const handle = () => {
        res.value.top = ele.scrollTop === 0;

        if (ele.scrollHeight === ele.scrollTop + ele.offsetHeight) {
            res.value.bottom = true;
        } else {
            res.value.bottom = false;
        }
    };

    onMounted(() => {
        ele.addEventListener('scroll', handle);
    });

    onBeforeUnmount(() => {
        ele.removeEventListener('scroll', handle);
    });

    return res;
};

// 获取对应 ChainInfo，Todo 考虑 ibcChains 会存在情况
export const useMatchChainInfo = (chainId: string) => {
    let chainIcon = CHAIN_DEFAULT_ICON;
    let chainName = DEFAULT_DISPLAY_TEXT;
    const { ibcChains } = useIbcChains(DATA_REFRESH_GAP);
    const matchChain = ibcChains.value.all.find((item) => item.chain_id === chainId);
    if (matchChain) {
        chainIcon = matchChain.icon;
        chainName = matchChain.chain_name;
    }
    return {
        chainIcon,
        chainName
    };
};

export const useMatchBaseDenom = async (chainId: string, denom: string, amount: string) => {
    let feeAmount = amount;
    let tokenIcon = TOKEN_DEFAULT_ICON;
    let symbol = denom;
    const matchBaseDenom = await getBaseDenomByKey(chainId, denom);
    if (matchBaseDenom) {
        feeAmount = `${moveDecimal(Number(amount) || 0, -matchBaseDenom.scale)}`;
        tokenIcon = matchBaseDenom.icon || TOKEN_DEFAULT_ICON;
        symbol = matchBaseDenom.symbol;
    }
    return {
        feeAmount,
        tokenIcon,
        symbol
    };
};

export const useOnPressEnter = () => {
    const onPressEnter = (val: any) => {
        console.log(val);
    };
    return {
        onPressEnter
    };
};

export const useGetIbcDenoms = () => {
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const { ibcBaseDenoms } = storeToRefs(ibcStatisticsChainsStore);
    const getIbcBaseDenom = ibcStatisticsChainsStore.getIbcBaseDenomsAction;
    const getBaseDenomInfoByDenom = (denom: string, chainId: string) => {
        return ibcBaseDenoms.value.find((item) => item.denom == denom && item.chain_id == chainId);
    };
    const ibcBaseDenomsSorted = computed(() => {
        const tokens: IBaseDenom[] = [];
        const customs = ibcBaseDenoms.value.filter((item) => {
            return item.symbol == SYMBOL.ATOM || item.symbol == SYMBOL.IRIS;
        });
        customs.sort((a, b) => a.symbol.localeCompare(b.symbol));
        ibcBaseDenoms.value
            .sort((a, b) => a.symbol.localeCompare(b.symbol))
            .forEach((item) => {
                if (item.symbol != SYMBOL.ATOM && item.symbol != SYMBOL.IRIS) {
                    tokens.push(item);
                }
            });
        return [...customs, ...tokens];
    });
    return {
        ibcBaseDenoms,
        ibcBaseDenomsSorted,
        getIbcBaseDenom,
        getBaseDenomInfoByDenom
    };
};

export const useDocumentVisibility = () => {
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    // 判断是否聚焦到本页签
    const watchDocument = () => {
        ibcStatisticsChainsStore.isDocumentHidden = document.hidden;
    };
    document.addEventListener('visibilitychange', watchDocument);
    onBeforeUnmount(() => {
        document.removeEventListener('visibilitychange', watchDocument);
    });
};

export const usePickerPlaceholder = () => {
    const pickerPlaceholderColor = ref('var(--bj-text-second)');
    const onOpenChangeRangePicker = (open: boolean) => {
        pickerPlaceholderColor.value = open ? 'var(--bj-text-third)' : 'var(--bj-text-second)';
    };
    return {
        pickerPlaceholderColor,
        onOpenChangeRangePicker
    };
};

// 根据图片加载状态展示对应的图片
export const useImageLoadStatus = (image: Ref<string>) => {
    const isSuccessLoadingImg = ref<boolean>(false);
    watch(
        image,
        (newImage) => {
            handleImgLoadingSussess(newImage, isSuccessLoadingImg);
        },
        { immediate: true }
    );
    return {
        isSuccessLoadingImg
    };
};
