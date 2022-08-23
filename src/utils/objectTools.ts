export const _typeof = (type: string) => {
    // return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    return (obj: any) => Object.prototype.toString.call(obj) === `[object ${type}]`;
};

export const isObject = _typeof('Object');

export const isString = _typeof('String');

export const isNumber = _typeof('Number');

export const isArray = (obj: any) => Array.isArray(obj);

export const isNonEmptyArray = (obj: any[] = []) => {
    return obj && obj.length > 0 && Array.isArray(obj) && typeof obj !== 'undefined';
};
export const isEmptyObject = (obj: any) =>
    obj && isObject(obj) && Object.keys(obj).length === 0 && obj.constructor === Object;

/**
 * isPlainObject(node=document.getElementById("xx")) -> false
 * toString.call(node) : ie678 == '[object Object]',other =='[object HTMLElement]'
 * 'isPrototypeOf' in node : ie678 === false ,other === true
 * @param {*} obj
 */
export const isPlainObject = (obj: any) => obj && isObject(obj) && 'isPrototypeOf' in obj;

/**
 * 'null', 'undefined', '', null, undefined
 * @param {any} arg
 */
export const isNullOrEmpty = (arg: any) =>
    (typeof arg === 'string' &&
        (arg.toLowerCase() == 'null' || arg.toLowerCase() == 'undefined')) ||
    (!arg && arg !== 0 && typeof arg != 'boolean' ? true : false);

/**
 * 'null', 'undefined', '', null, undefined  or arr length=0
 * @param {any} arg
 */
export const isArryOrObjEmpty = (arg: any) => {
    let isEmpty = false;
    if (Array.isArray(arg)) {
        isEmpty = arg.length > 0 ? false : true;
    } else {
        isEmpty =
            (typeof arg === 'string' &&
                (arg.toLowerCase() == 'null' || arg.toLowerCase() == 'undefined')) ||
            (!arg && arg !== 0 && typeof arg != 'boolean' ? true : false);
    }
    return isEmpty;
};

export function isValidKey(key: PropertyKey, obj: object): key is keyof typeof obj {
    return key in obj;
}

export function getKeyValue(key: PropertyKey, obj: object, defaultValue = '') {
    if (isValidKey(key, obj)) {
        return obj[key];
    }
    return defaultValue;
}
