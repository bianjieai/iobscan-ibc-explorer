import { Router } from 'vue-router';
import { useNProgress } from '@/utils/useNProgressTools';
import { useIbcStatisticsChains } from '@/store/index';

export function createInterceptor(router: Router) {
    const nprogress = useNProgress();
    nprogress.init();
    router.beforeEach((to, from, next) => {
        nprogress.start();
        // // 使用 Modal.destroyAll() 可以销毁弹出的确认窗（即上述的 Modal.info、Modal.success、Modal.error、Modal.warning、Modal.confirm）。通常用于路由监听当中，处理路由前进、后退不能销毁确认对话框的问题，而不用各处去使用实例的返回值进行关闭（modal.destroy() 适用于主动关闭，而不是路由这样被动关闭）
        // Modal.destroyAll()
        const ibcStatisticsChainsStore = useIbcStatisticsChains();
        ibcStatisticsChainsStore && (ibcStatisticsChainsStore.isShow500 = false);
        next();
    });

    router.afterEach(() => {
        nprogress.done();
    });
}
