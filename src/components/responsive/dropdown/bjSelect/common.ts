import { DataItem, ModeType, IProps } from './type';

/**
 * 根据不同类型返回对应的数据：单选返回单值，多选返回数组集合
 * @param selectData
 * @param mode
 * @param keygen
 */
export const getValByMode = (selectData: DataItem[], mode: ModeType, keygen = 'denom') => {
    switch (mode) {
        case 'multiple':
            return selectData.map((v) => v[keygen]);
        default:
            return selectData[0][keygen];
    }
};

/**
 * 根据类型判断是否要收起（true）
 * @param selectData
 * @param mode
 */
export const closeByMode = (selectData: DataItem[], mode: ModeType) => {
    switch (mode) {
        case 'multiple':
            return false;
        case 'two':
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
type InputItemsByModeRes = {
    [key: string]: any;
};

export const inputItemsByMode = (
    inputVal: string | undefined,
    props: IProps
): InputItemsByModeRes[] => {
    let tokens;
    const res: InputItemsByModeRes[] = [];

    switch (props.mode) {
        case 'multiple':
            tokens = inputVal?.split(',').filter((v) => v);
            break;
        default:
            tokens = [inputVal];
            break;
    }

    tokens?.forEach((v) => {
        res.push({
            [props.format!]: v,
            [props.renderItem!]: v
        });
    });

    return res;
};
