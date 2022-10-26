import { getUUID } from '@/utils/baseTools';
import type { DataItem, IIbcSource } from '@/types/interface/transfers.interface';

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

export const getJSONData = (jsonData: IIbcSource) => {
    const keys = [];
    const enumMap: any = {};
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
                        displayKey = key;
                    }
                    r = {
                        key: getUUID(),
                        name: displayKey || keyPath,
                        value: ''
                    };
                    r.children = format(v, keyPath);
                } else {
                    let dataEnum;
                    if (!Array.isArray(data)) {
                        displayKey = key;
                        dataEnum = enumMap[key];
                    } else {
                        const keyList = superKey.split('/') || [];
                        dataEnum = enumMap[keyList[keyList.length - 1]];
                    }
                    r = {
                        key: getUUID(),
                        name: displayKey || keyPath,
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

export const formatObjDisplay = (obj?: IIbcSource) => {
    if (!obj) return;
    let str = JSON.stringify(getJSONData(obj));
    str = str.replace(/\\u/g, '\\\\u');
    return JSON.parse(str);
};
