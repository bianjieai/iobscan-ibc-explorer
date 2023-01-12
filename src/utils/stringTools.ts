export const removeSpaceAndToLowerCase = (text: string) => {
    if (!text) return '';
    return text.replace(/\s+/g, '').toLowerCase();
};

export const formatString = (address: string) => {
    if (!address) return '';
    if (address.length > 6) {
        return `${address.substring(0, 6)}...`;
    } else if (address) {
        return address;
    }
};

// 截取小数位数
export const interceptionString = (text: string, reservedDecimal: number) => {
    if (text.includes('.') && text.length - (text.indexOf('.') + 1) > reservedDecimal) {
        let length = text.indexOf('.') + reservedDecimal;
        reservedDecimal != 0 ? (length += 1) : '';
        return text.substring(0, length);
    } else {
        return text;
    }
};

// 首字母大写
export const firstLetterCapitalize = (str: string) => {
    const newStr = str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
    return newStr;
};
