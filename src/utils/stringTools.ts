export const removeSpaceAndToLowerCase = (text: string) => {
    if (!text) return '';
    return text.replace(/\s+/g, '').toLowerCase();
};
