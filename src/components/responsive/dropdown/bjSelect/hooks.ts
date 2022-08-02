import { onMounted, ref, watch } from 'vue';
import { DataItem, TDenom, Data, IProps } from './type';

// 初始化
export const useInit = (props: IProps) => {
    const visible = ref(false);
    const selectItems = ref<DataItem[]>([]);
    const inputItems = ref<DataItem[]>([]); // 输入框的集合
    const tokenInput = ref<TDenom>(undefined);
    const flatData = ref<DataItem[]>([]); // 拍扁后的数组

    const resetFlatArr = (data: Data) => {
        // 拍扁数组处理，集合
        const tempFlats: DataItem[] = [];

        data?.forEach((v) => {
            if (v.children && v.children.length) {
                tempFlats.push(...v.children);
            }
        });

        flatData.value = tempFlats;
    };

    const resetVal = (val: TDenom | TDenom[]) => {
        tokenInput.value = undefined; // 清空input
        inputItems.value = [];
        selectItems.value = []; // 清空选中

        // 所有值都处理为数组操作，最后返回时候，再判断返回什么样的值
        let values;
        if (props.mode === 'multiple') {
            if (val && !Array.isArray(val)) {
                throw 'value need array';
            }
            values = val as TDenom[];
        } else {
            // 不能为null & undefined
            values = (val !== undefined && val !== null ? [val] : []) as TDenom[];
        }

        values.forEach((v) => {
            const temp = flatData.value.find((item) => item.denom === v);
            if (temp) {
                selectItems.value.push(temp);
            } else {
                inputItems.value.push({
                    denom: v,
                    symbol: v
                });
            }
        });

        tokenInput.value = inputItems.value.map((v) => v.denom).join(',');
    };

    onMounted(() => {
        // 先整理集合，再去赋值
        resetFlatArr(props.data);
        resetVal(props.value);
    });

    watch(
        () => props.value,
        (newVal) => {
            resetVal(newVal);
        }
    );

    watch(
        () => props.data,
        (newData) => {
            resetFlatArr(newData);
            resetVal(props.value);
        }
    );

    return {
        visible,
        selectItems,
        tokenInput,
        flatData,
        inputItems,
        resetVal
    };
};
