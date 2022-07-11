import {isArray} from './object-helper';
import {useIbcChains} from '../views/home/composable';
const { ibcChains } = useIbcChains();
const allChains = ibcChains;
export default class ChainHelper {
    static formatChainId(chainId){
        if (chainId && chainId !== '--') {
            return chainId.replace(new RegExp("\_", "g"), "-")
        }
        return '--'
    }
    
    // chain_name sort
    static sortByChainName(sourceList, chain) {
        function changeChainsSort(item) {
            let saveChain, saveChannel;
            saveChain = item.chain_a;
            item.chain_a = item.chain_b;
            item.chain_b = saveChain;
            saveChannel = item.channel_a;
            item.channel_a = item.channel_b;
            item.channel_b = saveChannel;
        }
        if(isArray(sourceList) && sourceList?.length) {
            const updateList = sourceList?.map((item, index) => {
                const matchChainA = allChains?.value?.all?.find((chain) => chain.chain_id === item.chain_a);
                const matchChainB = allChains?.value?.all?.find((chain) => chain.chain_id === item.chain_b);
                // 满足单选情况
                if(chain?.split(',')[0] !== 'allchain' && chain?.split(',')[1] === 'allchain') {
                    if(matchChainB?.chain_id === chain?.split(',')[0]) {
                        changeChainsSort(item);
                    }
                    return item;
                } else {
                    if([matchChainA?.chain_name, matchChainB?.chain_name].indexOf('Cosmos Hub') !== -1) {
                        if([matchChainA?.chain_name, matchChainB?.chain_name].indexOf('Cosmos Hub') === 1) {
                            changeChainsSort(item);
                        }
                    } else if([matchChainA?.chain_name, matchChainB?.chain_name].indexOf('IRIS Hub') !== -1) {
                        if([matchChainA?.chain_name, matchChainB?.chain_name].indexOf('IRIS Hub') === 1) {
                            changeChainsSort(item);
                        }
                    } else {
                        /**
                         * -1 -- need not
                         *  0 -- same
                         *  1 -- need
                         */
                        if(matchChainA?.chain_name.localeCompare(matchChainB?.chain_name) === 1) {
                            changeChainsSort(item);
                        }
                    }
                    return item;
                }
            })
            return updateList;
        }
        return [];
    }
}
