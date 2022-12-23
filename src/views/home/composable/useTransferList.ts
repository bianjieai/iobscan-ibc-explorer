export const useInterfaceActive = (emits: any) => {
    const itemDidExpand = (recordId: number) => {
        emits('itemDidExpand', recordId);
    };
    return {
        itemDidExpand
    };
};

export const useIsExpand = (emits: any, index: number) => {
    const onClickExpandBtn = () => {
        emits('itemDidExpand', index);
    };
    return {
        onClickExpandBtn
    };
};
