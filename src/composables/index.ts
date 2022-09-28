import { onMounted, onBeforeUnmount } from 'vue';
import {
    AGE_TIMER_INTERVAL,
    PAGE_PARAMETERS,
    NEED_CUSTOM_COLUMN,
    CHAIN_DEFAULT_ICON,
    SYMBOL
} from '@/constants';
import { useIbcStatisticsChains } from '@/store';
import { DATA_REFRESH_GAP } from '@/constants/home';
import { IBaseDenom } from '@/types/interface/index.interface';

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

// 获取对应 ChainInfo
export const useMatchChainInfo = (chainId: string) => {
    let chainIcon = CHAIN_DEFAULT_ICON;
    let chainName = '';
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
    const { ibcBaseDenoms, ibcBaseDenomsSymbolKeyMapGetter } =
        storeToRefs(ibcStatisticsChainsStore);
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
        ibcBaseDenomsSymbolKeyMapGetter,
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
