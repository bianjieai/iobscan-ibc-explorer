import type { IIbcSource } from '@/types/interface/transfers.interface';

const secureParse = (JSONString: any) => {
    if (!JSONString) {
        return null;
    }
    if (typeof JSONString == 'object') {
        return JSONString;
    }

    let result = null;
    try {
        result = JSON.parse(JSONString);
    } catch (e) {}
    return result;
};

const parseObjJsonData = (_d: any) => {
    const data = secureParse(_d) || {};
    return data;
};

const getKeyNameByJSONPath = (path: string, src: object | string) => {
    if (!path || !src) {
        return '';
    }
    let c: any = src;
    if (typeof src == 'string') {
        try {
            c = JSON.parse(src);
        } catch (e) {
            c = {};
        }
    }
    path.split('/').forEach((k) => {
        if (c && k) {
            c = c[k];
        }
    });
    return (c && c.__keyName) || '';
};
interface DataItem {
    key: string;
    value: string;
    children?: DataItem[];
}

export const getJSONData = (jsonData: IIbcSource) => {
    const keys = [];
    const enumMap: any = {};
    const JSONSchemaKeys = {};
    const format = (data: any, superKey: string) => {
        const result = [];
        if (data && Object.keys(data).length) {
            for (const key in data) {
                const keyPath = superKey ? `${superKey}/${key}` : `${key}`;
                let displayKey = '';
                const v = data[key];
                let r: DataItem;
                if (typeof v == 'object') {
                    if (!Array.isArray(data)) {
                        displayKey = getKeyNameByJSONPath(keyPath, JSONSchemaKeys) || key;
                    }
                    r = {
                        key: displayKey || keyPath,
                        value: ''
                    };
                    r.children = format(v, keyPath);
                } else {
                    let dataEnum;
                    if (!Array.isArray(data)) {
                        displayKey = getKeyNameByJSONPath(keyPath, JSONSchemaKeys) || key;
                        dataEnum = enumMap[key];
                    } else {
                        const keyList = superKey.split('/') || [];
                        dataEnum = enumMap[keyList[keyList.length - 1]];
                    }
                    r = {
                        key: displayKey,
                        value: dataEnum && dataEnum[v] ? dataEnum[v] : String(v)
                    };
                }
                keys.push(r.key);
                result.push(r);
            }
        }
        return result;
    };
    const d = parseObjJsonData(jsonData);
    const data = format(d, '');
    return data;
};
