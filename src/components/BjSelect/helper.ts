import { IDataItem, ModeType, TDenom } from './interface';
import { MODES } from './constants';
/**
 * 根据不同类型返回对应的数据：单选返回单值，多选返回数组集合
 * @param selectData
 * @param mode
 * @param keygen
 */
export const getValByMode = (selectData: IDataItem[], mode: ModeType) => {
    switch (mode) {
        case MODES.multiple:
            return selectData;
        case MODES.double:
            return selectData;
        default:
            return selectData[0];
    }
};

/**
 * 根据类型判断是否要收起（true）
 * @param selectData
 * @param mode
 */
export const closeByMode = (selectData: IDataItem[], mode: ModeType) => {
    switch (mode) {
        case MODES.multiple:
            return false;
        case MODES.double:
            return selectData.length === 2;
        default:
            return true;
    }
};

/**
 * 输入框输入时候的操作
 * @param inputVal
 * @param mode
 */
export const inputItemsByMode = (inputVal: string | undefined, mode: ModeType): IDataItem[] => {
    let tokens;
    const res: IDataItem[] = [];

    if (!inputVal || !inputVal.trim()) {
        return res;
    }

    switch (mode) {
        case MODES.multiple:
            tokens = inputVal?.split(',').filter((v) => v);
            break;
        case MODES.double:
            tokens = inputVal?.split(',').filter((v) => v);
            break;
        default:
            tokens = [inputVal];
            break;
    }

    tokens?.forEach((v) => {
        res.push({
            id: v,
            title: v,
            inputFlag: true
        });
    });

    return res;
};

// 去重 || 可以重复多选的
export const getLastArrs = (data?: IDataItem[]): IDataItem[] => {
    const res: IDataItem[] = [];

    if (!data?.length) {
        return res;
    }

    const ids: TDenom[] = [];

    data.forEach((v) => {
        if (!ids.includes(v.id) || v.doubleTime) {
            res.push(v);
            ids.push(v.id);
        }
    });

    return res;
};
