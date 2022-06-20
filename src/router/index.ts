import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from '../layout/index.vue'
import { createInterceptor } from './interceptor'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/500',
        name: '500',
        component: () => import('../components/errorpage/500.vue'),
    },
    {
        path: '/404',
        name: '404',
        component: () => import('../components/errorpage/404.vue'),
    },
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        redirect: '/home',
        component: Layout,
        meta: {},
        children: [
            {
                path: '',
                name: 'Home',
                component: () => import('../views/home/index.vue'),
                meta: {}
            },
        ]
    },
    {
        path: '/transfers',
        redirect: '/transfers',
        component: Layout,
        meta: {},
        children: [
            {
                path: '',
                name: 'Transfers',
                component: ()=> import('../views/transfers/index.vue'),
                meta: {}
            }
        ]
    },
    {
        path: '/tokens',
        redirect: '/tokens',
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
                component: () => import('../components/ComingSoon.vue')
            }
        ]
    },
    {
        path: '/chains',
        redirect: '/chains',
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
        redirect: '/channels',
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
        redirect: '/relayers',
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
        redirect: '/404',
    }
]


const VITE_BASE_URL = import.meta.env.VITE_BASE_URL // base_url

const router = createRouter({
    history: createWebHistory('/'),
    routes
})

createInterceptor(router)

export default router

