import { App, Directive } from 'vue';

export const gaDirectiveObj: Directive = {
    mounted(el, binding) {
        const domEventName = binding.arg || 'click';
        el.addEventListener(domEventName, () => {
            if (typeof binding.value === 'string') {
                // console.log('gaDirective', binding.value);
                (window as any).gtag('event', binding.value);
            } else {
                const { gaEventName, params } = binding.value;
                // console.log('gaDirective', gaEventName, params);
                (window as any).gtag('event', gaEventName, params);
            }
        });
    }
};

export const gaDirectiveInstall = (app: App<Element>) => {
    app.directive('ga', gaDirectiveObj);
};
