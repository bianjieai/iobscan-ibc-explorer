import { Ref } from 'vue';
export const handleImgLoadingSussess = (imgSrc: string, isSuccess: Ref<boolean>): void => {
    isSuccess.value = false;
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
        isSuccess.value = true;
    };
    img.onerror = () => {
        isSuccess.value = false;
    };
};
