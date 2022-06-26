import placeHoderImg from '../../../assets/placeHoder.png';
import { ref, computed } from 'vue';
export const useInterfaceActive = () => {
    const onClickViewAll = () => {
        emits('clickViewAll');
    };
    const clickListItem = (item) => {
        emits('clickItem', item);
    };
    return {
        onClickViewAll,
        clickListItem
    }
}

export const useIsExpand = () => {
    const isExpand = ref(true);
    const onClickExpandBtn = () => {
        isExpand.value = !isExpand.value;
    }
    return {
        isExpand,
        onClickExpandBtn
    }
}
export const useFindIbcChainIcon = (props) => {
    const findIbcChainIcon = (chainId) => {
        if (props.ibcChains && props.ibcChains.all) {
            const result = props.ibcChains.all.find((item) => item.chain_id === chainId);
            if (result) {
                return result.icon || placeHoderImg;
            }
        }
        return placeHoderImg;
    };
    return {
        findIbcChainIcon
    }
}
export const useClientWidth = () => {
    const clientWidth = ref(+document.body.clientWidth);
    return {
        clientWidth
    }
}