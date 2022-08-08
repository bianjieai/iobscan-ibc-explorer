import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

const router = useRouter();

const service = axios.create({
    baseURL: import.meta.env.VITE_BASE_API
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
        const url = error?.config?.url;
        if (url?.includes('/ibc/chains') || url?.includes('/ibc/txs')) {
            if (!error?.message?.includes('code 200')) {
                // todo duanjie 500
                router.push('/500');
            }
        }
        return Promise.reject(error);
    }
);

export default service;
