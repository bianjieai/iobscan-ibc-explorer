/**
 * 根据不同类型返回对应的数据：单选返回单值，多选返回数组集合
 * @param selectData
 * @param mode
 * @param keygen
 */
export const getValByMode = (selectData, mode, keygen = 'denom') => {
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
export const closeByMode = (selectData, mode) => {
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
export const inputItemsByMode = (inputVal, mode) => {
    let tokens;
    const res = [];

    switch (mode) {
        case 'multiple':
            tokens = inputVal?.split(',').filter((v) => v);
            break;
        default:
            tokens = [inputVal];
            break;
    }

    tokens?.forEach((v) => {
        res.push({
            denom: v,
            symbol: v
        });
    });

    return res;
};
