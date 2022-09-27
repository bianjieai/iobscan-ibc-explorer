import { AxiosTimeout } from '@/constants/index';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import jsonBig from 'json-bigint';

const serviceMock = axios.create({
    baseURL: 'http://yapi.bianjie.ai/mock/23',
    timeout: AxiosTimeout,
    transformResponse: (data) => {
        try {
            return jsonBig.parse(data);
        } catch {
            return data;
        }
    }
});

// Request interceptors
serviceMock.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // do something
        return config;
    },
    (error: any) => {
        Promise.reject(error);
    }
);

// Response interceptors
serviceMock.interceptors.response.use(
    async (response: AxiosResponse) => {
        // do something
        return response.data;
    },
    (error: any) => {
        // do something
        return Promise.reject(error);
    }
);

export default serviceMock;
