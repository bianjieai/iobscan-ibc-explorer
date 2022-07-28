import { isArray } from '../utils/objectTools';
import { CHAINNAME } from '../constants';
import { useIbcChains } from '../views/home/composable';
const { ibcChains } = useIbcChains();
export default class ChainHelper {
    static formatChainId(chainId: any) {
        if (chainId && chainId !== '--') {
            return chainId.replace(new RegExp('_', 'g'), '-');
        }
        return '--';
    }

    // chain_name sort
    static sortByChainName(sourceList: any, chain: any) {
        function changeChainsSort(item: any) {
            const saveChain = item.chain_a;
            item.chain_a = item.chain_b;
            item.chain_b = saveChain;
            const saveChannel = item.channel_a;
            item.channel_a = item.channel_b;
            item.channel_b = saveChannel;
            const saveAddress = item.chain_a_address;
            item.chain_a_address = item.chain_b_address;
            item.chain_b_address = saveAddress;
        }
        if (isArray(sourceList) && sourceList?.length) {
            const updateList = sourceList?.map((item: any) => {
                const matchChainA = ibcChains?.value?.all?.find(
                    (chain) => chain.chain_id === item.chain_a
                );
                const matchChainB = ibcChains?.value?.all?.find(
                    (chain) => chain.chain_id === item.chain_b
                );
                // 满足单选情况
                if (chain?.split(',')[0] !== 'allchain' && chain?.split(',')[1] === 'allchain') {
                    if (matchChainB?.chain_id === chain?.split(',')[0]) {
                        changeChainsSort(item);
                    }
                    return item;
                } else {
                    if (
                        [matchChainA?.chain_name, matchChainB?.chain_name].indexOf(
                            CHAINNAME.COSMOSHUB
                        ) !== -1
                    ) {
                        if (
                            [matchChainA?.chain_name, matchChainB?.chain_name].indexOf(
                                CHAINNAME.COSMOSHUB
                            ) === 1
                        ) {
                            changeChainsSort(item);
                        }
                    } else if (
                        [matchChainA?.chain_name, matchChainB?.chain_name].indexOf(
                            CHAINNAME.IRISHUB
                        ) !== -1
                    ) {
                        if (
                            [matchChainA?.chain_name, matchChainB?.chain_name].indexOf(
                                CHAINNAME.IRISHUB
                            ) === 1
                        ) {
                            changeChainsSort(item);
                        }
                    } else {
                        /**
                         * -1 -- need not
                         *  0 -- same
                         *  1 -- need
                         */
                        if (
                            matchChainA?.chain_name.localeCompare(
                                (matchChainB as any)?.chain_name
                            ) === 1
                        ) {
                            changeChainsSort(item);
                        }
                    }
                    return item;
                }
            });
            return updateList;
        }
        return [];
    }
}
