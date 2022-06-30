import { getKeyValue } from "@/helper/object-helper";
import { CompareOrder } from "../component.interface";

export function compareValues(key: string, order: CompareOrder = CompareOrder.ASCEND) {
  return function innerSort(a: object, b: object) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // 该属性在其中一个对象上不存在 
      return 0;
    }

    const varA = ((typeof getKeyValue(key, a) === 'string') && isNaN(Number(getKeyValue(key, a))))
      ? getKeyValue(key, a).toUpperCase() : Number(getKeyValue(key, a));
    const varB = ((typeof getKeyValue(key, b) === 'string') && isNaN(Number(getKeyValue(key, b))))
      ? getKeyValue(key, b).toUpperCase() : Number(getKeyValue(key, b));

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === CompareOrder.DESCEND) ? (comparison * -1) : comparison
    );
  };
} 