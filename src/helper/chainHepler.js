export default class ChainHelper {
    static formatChainId(chainId){
        if (chainId && chainId !== '--') {
            return chainId.replace(new RegExp("\_", "g"), "-")
        }
        return '--'
    }
}
