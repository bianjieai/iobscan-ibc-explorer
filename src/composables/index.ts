import { onMounted, onBeforeUnmount } from 'vue';
import { ageTimerInterval, PAGE_PARAMETERS, NEED_CUSTOM_COLUMN } from '@/constants';
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
    const link: any =
        document.querySelector('link[rel *= "icon"]') || document.createElement('link');
    const title: any = document.querySelector('title') || document.createElement('title');
    link.rel = 'icon';
    link.href = import.meta.env.VITE_FAVICON;
    title.innerHTML = import.meta.env.VITE_TITLE;
    document.getElementsByTagName('head')[0].appendChild(link);
    document.getElementsByTagName('head')[0].appendChild(title);
};

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
        case PAGE_PARAMETERS.channel:
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
