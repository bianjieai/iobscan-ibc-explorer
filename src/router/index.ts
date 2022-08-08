import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/index.vue';
import LayoutError from '@/layout/LayoutError.vue';
import { createInterceptor } from './interceptor';

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
                name: 'Home',
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
                name: 'Transfers',
                component: () => import('../views/transfers/index.vue'),
                meta: {}
            },
            {
                path: 'details',
                name: 'Transfers Details',
                component: () => import('../views/transfers/details/index.vue'),
                meta: {}
            }
        ]
    },
    {
        path: '/searchResult',
        name: 'searchResult',
        component: Layout,
        children: [
            {
                path: '',
                name: 'Search Result',
                component: () => import('../views/transfers/components/NoResult.vue'),
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
                name: 'Tokens',
                component: () => import('../views/tokens/index.vue'),
                meta: {}
            },
            {
                path: 'details',
                name: 'Tokens Details',
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
                name: 'Chains',
                component: () => import('../views/chains/index.vue'),
                meta: {}
            },
            {
                path: 'details',
                name: 'Chains Details',
                component: () => import('../components/ComingSoon.vue'),
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
                name: 'Channels',
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
                name: 'Relayers',
                component: () => import('../views/relayers/index.vue'),
                meta: {}
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        component: LayoutError,
        meta: {},
        children: [
            {
                path: '',
                name: '404',
                component: () => import('../components/errorpage/404.vue')
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory('/'),
    routes
});

createInterceptor(router);

export default router;
