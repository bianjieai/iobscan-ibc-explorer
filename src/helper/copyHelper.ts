import { copyToClipboard } from '@/utils/clipboardTools';

export const useCopyToast = () => {
    const showToast = ref(false);
    const clientX = ref(0);
    const clientY = ref(0);
    const clickEventFn = (e: MouseEvent) => {
        clientX.value = e.clientX || 0;
        clientY.value = e.clientY || 0;
    };
    let showTimer: number;
    let cancelShowTimer: number;
    const copyFn = (copyText: string) => {
        showTimer && clearInterval(showTimer);
        cancelShowTimer && clearInterval(cancelShowTimer);
        showToast.value = false;
        showTimer = setTimeout(() => {
            copyToClipboard(copyText);
            showToast.value = true;
        }, 0);
        cancelShowTimer = setTimeout(() => {
            showToast.value = false;
        }, 600);
    };
    const copyAndClickEventFn = (copy: string, e: MouseEvent) => {
        copyFn(copy);
        clickEventFn(e);
    };
    return {
        showToast,
        clientX,
        clientY,
        clickEventFn,
        copyFn,
        copyAndClickEventFn
    };
};
