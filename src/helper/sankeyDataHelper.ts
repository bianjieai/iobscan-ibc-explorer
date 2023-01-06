import { DEFAULT_DISPLAY_TEXT } from '@/constants';
import type {
    IResponseDistribution,
    ISankeyDataLink,
    ISankeyDataNode
} from '@/types/interface/overview.interface';
import { bigNumberAdd, bigNumberSubtract } from '@/utils/calculate';
import ChainHelper from './chainHelper';

export const formatSankeyData = async (sankeyData: IResponseDistribution) => {
    const nodesArr: ISankeyDataNode[] = [],
        linksArr: ISankeyDataLink[] = [];
    const nodes: ISankeyDataNode[] = [],
        links: ISankeyDataLink[] = [];
    const nodesMap = new Map();
    const linksMap = new Map();
    const format = (formatData: IResponseDistribution, lastHop?: string) => {
        if (nodes.length) {
            if (!nodesMap.has(`${formatData.chain} ${formatData.hops}`)) {
                nodes.push({ name: `${formatData.chain} ${formatData.hops}` });
            }
            nodes.forEach((node) => {
                nodesMap.set(node.name, node);
            });
        } else {
            nodes.push({ name: `${formatData.chain} ${formatData.hops}` });
        }

        if (lastHop) {
            if (linksMap.has(`${lastHop} ${formatData.chain} ${formatData.hops}`)) {
                const currentLinkInfo = linksMap.get(
                    `${lastHop} ${formatData.chain} ${formatData.hops}`
                );
                if (currentLinkInfo.value !== '-1' && formatData.amount !== '-1') {
                    currentLinkInfo.value = bigNumberAdd(currentLinkInfo.value, formatData.amount);
                }
            } else {
                links.push({
                    source: lastHop,
                    target: `${formatData.chain} ${formatData.hops}`,
                    value: formatData.amount
                });
            }
            links.forEach((link) => {
                linksMap.set(`${link.source} ${link.target}`, link);
            });
        }
        if (formatData.children?.length) {
            formatData.children.forEach((item) => {
                format(item, `${formatData.chain} ${formatData.hops}`);
            });
        }
    };
    format(sankeyData);
    for (const node of nodesMap.values()) {
        const chain = node.name.split(' ')[0];
        const hops = node.name.split(' ')[1];
        const chainInfo = await ChainHelper.getChainInfoByKey(chain);
        nodesArr.push({
            name: `${chainInfo?.pretty_name || chain} ${hops}`,
            tooltip: {
                show: false
            }
        });
    }
    for (const link of linksMap.values()) {
        const sourceChain = link.source.split(' ')[0];
        const sourceHops = link.source.split(' ')[1];
        const targetChain = link.target.split(' ')[0];
        const targetHops = link.target.split(' ')[1];
        const sourceChainInfo = await ChainHelper.getChainInfoByKey(sourceChain);
        const targetChainInfo = await ChainHelper.getChainInfoByKey(targetChain);
        linksArr.push({
            source: `${sourceChainInfo?.pretty_name || sourceChain} ${sourceHops}`,
            target: `${targetChainInfo?.pretty_name || targetChain} ${targetHops}`,
            value: link.value
        });
    }
    const linksValueArr = linksArr
        .filter((item) => item.value !== DEFAULT_DISPLAY_TEXT)
        .sort((a, b) => Number(bigNumberSubtract(b.value, a.value)));
    const linksNoValueArr = linksArr.filter((item) => item.value === DEFAULT_DISPLAY_TEXT);
    return {
        nodes: [...nodesArr],
        links: [...linksValueArr, ...linksNoValueArr]
    };
};
