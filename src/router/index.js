import {createRouter, createWebHistory} from 'vue-router';

const routes = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    },
    {
        path: '/transfers',
        name: 'Transfers',
        component: () => import(/* webpackChunkName: "transfers" */ '../views/Transfers.vue'),
    },
    {
        path: '/tokens',
        name: 'Tokens',
        component: () => import(/* webpackChunkName: "transfers" */ '../views/ComingSoon.vue'),
    },
    {
        path: '/network',
        name: 'NetWork',
        component: () => import(/* webpackChunkName: "transfers" */ '../views/ComingSoon.vue'),
    },
    {
        path: '/channels',
        name: 'Channels',
        component: () => import(/* webpackChunkName: "transfers" */ '../views/ComingSoon.vue'),
    },
    {
        path: '/relayers',
        name: 'Relayers',
        component: () => import(/* webpackChunkName: "transfers" */ '../views/ComingSoon.vue'),
    },
    {
        path: '/tokens/details',
        name: 'tokensDetails',
        component: () => import(/* webpackChunkName: "transfers" */ '../views/ComingSoon.vue'),
    },
    {
        path: '/transfers/details',
        name: 'transfersDetails',
        component: () => import(/* webpackChunkName: "transfers" */ '../views/TransferDetail.vue'),
    },
    {
        path: '/address/details',
        name: 'addressDetails',
        component: () => import(/* webpackChunkName: "transfers" */ '../views/ComingSoon.vue'),
    },
    {
        path: '/network/details',
        name: 'chainsDetails',
        component: () => import(/* webpackChunkName: "transfers" */ '../views/ComingSoon.vue'),
    },
    {
        path: '/404',
        name: '404',
        component: () => import(/* webpackChunkName: "transfers" */ '../errorpage/404.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404',
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
