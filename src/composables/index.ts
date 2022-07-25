import { onMounted, onBeforeUnmount } from 'vue';
import { ageTimerInterval } from '@/constants';
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
    if (import.meta.env.MODE === 'staging') {
        const link: any = document.querySelector('link[rel *= "icon"]') || document.createElement('link');
        const title: any = document.querySelector('title') || document.createElement('title');
        link.rel = 'icon';
        link.href = import.meta.env.VITE_FAVICON;
        title.innerHTML = import.meta.env.VITE_TITLE;
        document.getElementsByTagName('head')[0].appendChild(link);
        document.getElementsByTagName('head')[0].appendChild(title);
    }
};
