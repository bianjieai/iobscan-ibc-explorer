import { DEFAULT_DISPLAY_TEXT, PRETTYNAME } from '@/constants';
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
        const judgeNodesorLinksPush = (length: number) => {
            if (!nodesMap.has(`${formatData.chain} ${length ? formatData.hops : 'last'}`)) {
                nodes.push({ name: `${formatData.chain} ${length ? formatData.hops : 'last'}` });
            }
            if (lastHop) {
                if (
                    linksMap.has(
                        `${lastHop} ${formatData.chain} ${length ? formatData.hops : 'last'}`
                    )
                ) {
                    const currentLinkInfo = linksMap.get(
                        `${lastHop} ${formatData.chain} ${length ? formatData.hops : 'last'}`
                    );
                    if (currentLinkInfo.originValue !== '-1' && formatData.amount !== '-1') {
                        currentLinkInfo.value = bigNumberAdd(
                            currentLinkInfo.originValue,
                            formatData.amount
                        );
                    }
                } else {
                    // value 为展示的值，originValue 为原始值
                    links.push({
                        source: lastHop,
                        target: `${formatData.chain} ${length ? formatData.hops : 'last'}`,
                        value: formatData.amount !== '-1' ? formatData.amount : '1',
                        originValue: formatData.amount
                    });
                }
            }
        };
        if (formatData.children?.length) {
            judgeNodesorLinksPush(formatData.children.length);
            formatData.children.forEach((item) => {
                format(item, `${formatData.chain} ${formatData.hops}`);
            });
        } else {
            judgeNodesorLinksPush(formatData.children?.length);
        }
    };
    if (sankeyData.children?.length) {
        format(sankeyData);
    } else {
        // todo shan 原生链没有下一跳的情况下，生成一个自己连自己的连接关系，添加个属性表明是 0 跳，根据这个属性更改对应颜色
    }
    [...new Set(nodes)].forEach((node) => {
        nodesMap.set(node.name, node);
    });
    links.forEach((link) => {
        linksMap.set(`${link.source} ${link.target}`, link);
    });
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
            value: link.value,
            originValue: link.originValue
        });
    }
    const cosmos = nodesArr.filter((item) => item.name.includes(PRETTYNAME.COSMOSHUB));
    const irishub = nodesArr.filter((item) => item.name.includes(PRETTYNAME.IRISHUB));
    const other = nodesArr
        .filter(
            (item) =>
                !item.name.includes(PRETTYNAME.IRISHUB) && !item.name.includes(PRETTYNAME.COSMOSHUB)
        )
        .sort((a, b) => a.name.localeCompare(b.name));
    const linksValueArr = linksArr
        .filter((item) => item.value !== DEFAULT_DISPLAY_TEXT)
        .sort((a, b) => Number(bigNumberSubtract(b.value, a.value)));
    const linksNoValueArr = linksArr.filter((item) => item.value === DEFAULT_DISPLAY_TEXT);
    return {
        nodes: [...cosmos, ...irishub, ...other],
        links: [...linksValueArr, ...linksNoValueArr]
    };
};
