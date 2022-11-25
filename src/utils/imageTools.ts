import { Ref } from 'vue';
export const handleImgLoadingSussess = (
    imgSrc: string,
    isSuccess: Ref<boolean>,
    isLoadingImg: Ref<boolean>
): void => {
    isLoadingImg.value = true;
    isSuccess.value = false;
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
        isLoadingImg.value = false;
        isSuccess.value = true;
    };
    img.onerror = () => {
        isLoadingImg.value = false;
        isSuccess.value = false;
    };
};
