import { isString } from './objectTools';

/**
 * @description format url and params
 * @param baseUrl string /tokens ...
 * @param rest object { key: xx, value: xxx }
 * @returns string url?xx=xxx
 */
export const urlPageParser = (baseUrl: string, ...rest: { key: string; value?: string }[]) => {
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

export const urlParser = (url = document.location.toString()) => {
    if (url.includes('?')) {
        const searchStr = url.split('?')[1];
        const searchInstance = new URLSearchParams(searchStr);
        const params: any = {};
        for (const entries of searchInstance.entries()) {
            params[entries[0]] = entries[1];
        }
        return params;
    } else if (url.includes('&')) {
        const searchInstance = new URLSearchParams(url);
        const params: any = {};
        for (const entries of searchInstance.entries()) {
            params[entries[0]] = entries[1];
        }
        return params;
    } else {
        return {};
    }
};
// 计算文本宽度 --> TextMetrics.width 是只读属性，chain_id 长度判断时需加 Icon 长度和间距
export const getTextWidth = (text: string, font = '14px GolosUI_Medium') => {
    if (!text) return 0;
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const context = canvas.getContext('2d');
    font && context && (context.font = font);
    const metrics = context && context.measureText(text);
    const textWidth = metrics && Math.ceil(metrics.width);
    context && context.clearRect(0, 0, canvas.width, canvas.height);
    return textWidth;
};

export const drawDefaultIcon = (path: string) => {
    return new URL(`${path}`, import.meta.url).href;
};
