import { isString } from './objectTools';

/**
 * @description format url and params
 * @param baseUrl string /tokens ...
 * @param rest object { key: xx, value: xxx }
 * @returns string url?xx=xxx
 */
export const urlHelper = (baseUrl: string, ...rest: { key: string; value?: string }[]) => {
    // let prefix = baseUrl.includes('?') ? '&' : '?';
    if (!isString(baseUrl)) return location.pathname;
    const search = baseUrl.split('?')[1] ?? location.search;
    const searchParams = new URLSearchParams(search);
    rest.forEach((item) => {
        if (item.value) {
            searchParams.set(item.key, item.value);
        } else {
            searchParams.delete(item.key);
        }
    });
    const params = decodeURI(searchParams.toString());
    return `${baseUrl.split('?')[0]}${params.length === 0 ? '' : '?'}${params}`;
};
