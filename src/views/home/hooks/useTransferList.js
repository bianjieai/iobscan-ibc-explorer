import chainDefaultImg from '../../../assets/chain-default.png';
import {  computed } from 'vue';
export const useInterfaceActive = (emits) => {
    const onClickViewAll = () => {
        emits('clickViewAll');
    };
    const clickListItem = (item) => {
        emits('clickItem', item);
    };
    const itemDidExpand = (idx) => {
        emits('itemDidExpand', idx);
    };
    return {
        onClickViewAll,
        clickListItem,
        itemDidExpand
    }
}

export const useIsExpand = (emits ,index) => {
    const onClickExpandBtn = () => {
        emits('itemDidExpand', index);
    }
    return {
        onClickExpandBtn
    }
}
export const useFindIbcChainIcon = (props) => {
    const findIbcChainIcon = (chainId) => {
        if (props.ibcChains && props.ibcChains.all) {
            const result = props.ibcChains.all.find((item) => item.chain_id === chainId);
            if (result) {
                return result.icon || chainDefaultImg;
            }
        }
        return chainDefaultImg;
    };
    return {
        findIbcChainIcon
    }
}