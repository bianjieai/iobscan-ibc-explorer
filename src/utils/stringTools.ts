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
