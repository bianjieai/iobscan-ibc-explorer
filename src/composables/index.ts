import { onMounted, onBeforeUnmount } from 'vue';
import {
    ageTimerInterval,
    PAGE_PARAMETERS,
    NEED_CUSTOM_COLUMN,
    CHAIN_DEFAULT_ICON
} from '@/constants';
import { useIbcStatisticsChains } from '@/store';
import { DATA_REFRESH_GAP } from '@/constants/home';

export const useTimeInterval = (intervalCallBack: Function, interval = ageTimerInterval) => {
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
    }
    return {
        needCustomColumns
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
    const { ibcChains } = storeToRefs(ibcStatisticsChainsStore);
    const getIbcChains = ibcStatisticsChainsStore.getIbcChainsAction;
    let timer: number;
    onMounted(() => {
        getIbcChains();
        if (Number(timerInterval) > 0) {
            timer = setInterval(() => {
                console.log('getIbcChains', timerInterval);
                getIbcChains(false);
            }, timerInterval);
        }
    });
    onBeforeUnmount(() => {
        timer && clearInterval(timer);
    });
    return {
        ibcChains,
        getIbcChains
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

// 获取对应 ChainInfo
export const useMatchChainInfo = (chainId: string) => {
    const chainIcon = ref<string>(CHAIN_DEFAULT_ICON);
    const chainName = ref<string>('--');
    const { ibcChains } = useIbcChains(DATA_REFRESH_GAP);
    const matchChain = ibcChains.value.all.find((item) => item.chain_id === chainId);
    if (matchChain) {
        chainIcon.value = matchChain.icon;
        chainName.value = matchChain.chain_name;
    }
    return {
        chainIcon,
        chainName
    };
};
