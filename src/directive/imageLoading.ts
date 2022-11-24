import { App, Directive } from 'vue';

export const imgLoadingDirective: Directive = {
    mounted(el, binding) {
        // 监听是否进入可视区域
        const observer = new IntersectionObserver(([{ isIntersecting }]) => {
            // 如果进入可视区域
            if (isIntersecting) {
                // 给图片的 src 属性赋值图片地址
                el.src = binding.value;
                // 取消图片监听
                observer.unobserve(el);
            }
        });
        observer.observe(el);
    }
};

export const imgLoadingDirectiveInstall = (app: App<Element>) => {
    app.directive('lazyload', imgLoadingDirective);
};
