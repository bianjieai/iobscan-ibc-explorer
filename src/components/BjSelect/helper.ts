import { IDataItem, ModeType, TProps } from './interface';
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
export const inputItemsByMode = (inputVal: string | undefined, props: TProps): IDataItem[] => {
    let tokens;
    const res: IDataItem[] = [];

    if (!inputVal || !inputVal.trim()) {
        return res;
    }

    switch (props.mode) {
        case MODES.multiple:
            tokens = inputVal?.split(',').filter((v) => v);
            break;
        default:
            tokens = [inputVal];
            break;
    }

    tokens?.forEach((v) => {
        res.push({
            id: v,
            title: v
        });
    });

    return res;
};
