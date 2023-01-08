import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/index.vue';
import LayoutError from '@/layout/LayoutError.vue';
import { createInterceptor } from './interceptor';
import { ROUTE_INFO } from '@/constants';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        component: Layout,
        meta: {},
        children: [
            {
                path: '',
                name: ROUTE_INFO.home.name,
                component: () => import('../views/home/index.vue'),
                meta: {}
            }
        ]
    },
    {
        path: '/transfers',
        component: Layout,
        meta: {},
        children: [
            {
                path: '',
                name: ROUTE_INFO.transfers.name,
                component: () => import('../views/transfers/index.vue'),
                meta: {}
            },
            {
                path: 'details',
                name: ROUTE_INFO.transferDetails.name,
                component: () => import('../views/transfers/details/index.vue'),
                meta: {}
            }
        ]
    },
    {
        path: '/searchResult/:result',
        component: Layout,
        children: [
            {
                path: '',
                name: ROUTE_INFO.searchResults.name,
                component: () => import('../views/transfers/components/NoTxResult.vue'),
                meta: {}
            }
        ]
    },
    {
        path: '/tokens',
        component: Layout,
        meta: {},
        children: [
            {
                path: '',
                name: ROUTE_INFO.tokens.name,
                component: () => import('../views/tokens/index.vue'),
                meta: {}
            },
            {
                path: 'details',
                name: ROUTE_INFO.tokenDetails.name,
                component: () => import('../views/tokens/IbcToken.vue')
            }
        ]
    },
    {
        path: '/chains',
        component: Layout,
        meta: {},
        children: [
            {
                path: '',
                name: ROUTE_INFO.chains.name,
                component: () => import('../views/chains/index.vue'),
                meta: {}
            }
        ]
    },
    {
        path: '/channels',
        component: Layout,
        meta: {},
        children: [
            {
                path: '',
                name: ROUTE_INFO.channels.name,
                component: () => import('../views/channels/index.vue'),
                meta: {}
            }
        ]
    },
    {
        path: '/relayers',
        component: Layout,
        meta: {},
        children: [
            {
                path: '',
                name: ROUTE_INFO.relayers.name,
                component: () => import('../views/relayers/index.vue'),
                meta: {}
            },
            {
                path: 'details/:relayerId',
                name: ROUTE_INFO.relayerDetails.name,
                component: () => import('../views/relayers/details/index.vue'),
                meta: {}
            }
        ]
    },
    {
        path: '/address/:address',
        component: Layout,
        meta: {},
        children: [
            {
                path: '',
                name: ROUTE_INFO.addressDetails.name,
                component: () => import('../views/address/index.vue'),
                meta: {}
            }
        ]
    },
    {
        path: '/overview',
        component: Layout,
        meta: {},
        children: [
            {
                path: 'heatmap',
                name: ROUTE_INFO.overviewHeatmap.name,
                component: () => import('../views/overview/heatmap/index.vue'),
                meta: {}
            },
            {
                path: 'volume',
                name: ROUTE_INFO.overviewVolume.name,
                component: () => import('../views/overview/volume/index.vue'),
                meta: {}
            }
            // todo shan 先注释掉桑基图入口
            // {
            //     path: 'distribution',
            //     name: ROUTE_INFO.overviewDistribution.name,
            //     component: () => import('../views/overview/distribution/index.vue'),
            //     meta: {}
            // }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        component: LayoutError,
        meta: {},
        children: [
            {
                path: '',
                name: ROUTE_INFO[404].name,
                component: () => import('../components/errorpage/404.vue')
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory('/'),
    scrollBehavior() {
        return { left: 0, top: 0 };
    },
    routes
});

createInterceptor(router);

export default router;
