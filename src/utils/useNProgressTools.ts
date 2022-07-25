import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style

const ANIMATION_TIME = 300;

export const useNProgress = () => {
    return {
        init() {
            NProgress.configure({ showSpinner: false }); // NProgress Configuration
        },
        start() {
            NProgress.start();
        },
        done() {
            NProgress.done();
        },
        setContainerId(id: string) {
            NProgress.configure({ parent: `#${id}` });
        },
        do() {
            this.start();
            setTimeout(() => {
                this.done();
            }, ANIMATION_TIME);
        }
    };
};
