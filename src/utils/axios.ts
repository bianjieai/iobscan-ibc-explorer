import { AxiosTimeout } from '@/constants/index';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

const service = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    timeout: AxiosTimeout
});

// Request interceptors
service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // do something
        return config;
    },
    (error: any) => {
        Promise.reject(error);
    }
);

// Response interceptors
service.interceptors.response.use(
    async (response: AxiosResponse) => {
        // do something
        return response.data;
    },
    (error: any) => {
        // do something
        return Promise.reject(error);
    }
);

export const CancelToken = axios.CancelToken;

export const executeCancel = (useCount?: boolean) => {
    if (useCount) {
        (window as any).axiosCancelCount && (window as any).axiosCancelCount();
        return (window as any).axiosCancelCount;
    } else {
        return (window as any).axiosCancel && (window as any).axiosCancel();
    }
};

export const setExecuteCancel = (useCount?: boolean) => {
    return new CancelToken(function executor(c) {
        if (useCount) {
            (window as any).axiosCancelCount = c;
        } else {
            (window as any).axiosCancel = c;
        }
    });
};

export const axiosCancel = axios.isCancel;

export default service;
