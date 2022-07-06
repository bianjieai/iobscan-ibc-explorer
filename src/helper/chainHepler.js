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
    static sortByChainName(sourceList) {
        if(isArray(sourceList) && sourceList?.length) {
            const updateList = sourceList?.map((item, index) => {
                const matchChainA = allChains?.value?.all?.find((chain) => chain.chain_id === item.chain_a);
                const matchChainB = allChains?.value?.all?.find((chain) => chain.chain_id === item.chain_b);
                /**
                 * -1 -- need not
                 *  0 -- same
                 *  1 -- need
                 */
                if(matchChainA?.chain_name !== 'Cosmos Hub' && (matchChainA?.chain_name !== 'IRIS Hub' || (matchChainA?.chain_name === 'IRIS Hub' && matchChainB?.chain_name === 'Cosmos Hub'))) {
                    let saveChain, saveChannel;
                    if(matchChainA?.chain_name.localeCompare(matchChainB?.chain_name) === 1) {
                        saveChain = item.chain_a;
                        item.chain_a = item.chain_b;
                        item.chain_b = saveChain;
                        saveChannel = item.channel_a;
                        item.channel_a = item.channel_b;
                        item.channel_b = saveChannel;
                    }
                }
                return item;
            })
            return updateList;
        }
    }
}
