import { onMounted, ref, watch } from 'vue';
import { IDataItem, TDenom, TData, TProps } from './interface';
import { MODES } from './constants';

// 初始化
export const useInit = (props: TProps) => {
    const visible = ref(false);
    const selectItems = ref<IDataItem[]>([]);
    const inputItems = ref<IDataItem[]>([]); // 输入框的集合
    const tokenInput = ref<string | undefined>(undefined);
    const flatData = ref<IDataItem[]>([]); // 拍扁后的数组

    const resetFlatArr = (data: TData) => {
        // 拍扁数组处理，集合
        const tempFlats: IDataItem[] = [];

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
        if (props.mode === MODES.multiple) {
            if (val && !Array.isArray(val)) {
                throw 'value need array';
            }
            values = val as TDenom[];
        } else {
            // 不能为null & undefined
            values = (val !== undefined && val !== null ? [val] : []) as TDenom[];
        }

        values.forEach((v) => {
            const temp = flatData.value.find((item) => item.id === v);
            if (temp) {
                selectItems.value.push(temp);
            } else {
                inputItems.value.push({
                    id: v,
                    title: v
                });
            }
        });

        tokenInput.value = inputItems.value.map((v) => v.id).join(',');
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
