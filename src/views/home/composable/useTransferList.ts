import chainDefaultImg from '@/assets/home/chain-default.png';

export const useInterfaceActive = (emits: any) => {
    const onClickViewAll = () => {
        emits('clickViewAll');
    };
    const clickListItem = (item: any) => {
        emits('clickItem', item);
    };
    const itemDidExpand = (recordId: number) => {
        emits('itemDidExpand', recordId);
    };
    return {
        onClickViewAll,
        clickListItem,
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
export const useFindIbcChainIcon = (props: any) => {
    const findIbcChainIcon = (chainId: string) => {
        if (props.ibcChains && props.ibcChains.all) {
            const result = props.ibcChains.all.find((item: any) => item.chain_id === chainId);
            if (result) {
                return result.icon || chainDefaultImg;
            }
        }
        return chainDefaultImg;
    };
    return {
        findIbcChainIcon
    };
};
