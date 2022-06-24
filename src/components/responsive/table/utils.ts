import { getKeyValue } from "@/helper/object-helper";
import { CompareOrder } from "../component.interface";

export function compareValues(key: string, order: CompareOrder = CompareOrder.ASCEND) {
  return function innerSort(a: object, b: object) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // 该属性在其中一个对象上不存在 
      return 0;
    }

    const varA = (typeof getKeyValue(key, a) === 'string')
      ? getKeyValue(key, a).toUpperCase() : getKeyValue(key, a);
    const varB = (typeof getKeyValue(key, b) === 'string')
      ? getKeyValue(key, b).toUpperCase() : getKeyValue(key, b);

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