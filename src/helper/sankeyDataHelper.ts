import { DEFAULT_DISPLAY_TEXT, PRETTYNAME, UNKNOWN } from '@/constants';
import { UNKNOWN_NODE_COLOR, SANKEY_ZERO_JUMP_LINE_OPACITY } from '@/constants/overview';
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
    let maxHopRecord = 1;
    let maxChildrenLength = 1;
    const lastLevelNodesArr: string[] = [];
    const formatAmount = (originValue: string, nextAmount: string) => {
        const addAmount = bigNumberAdd(originValue || '0', nextAmount || '0');
        return addAmount;
    };
    const format = (formatData: IResponseDistribution, lastHop?: string) => {
        if (formatData.children?.length) {
            const deleteSameChain = [...new Set(formatData.children.map((item) => item.chain))];
            maxChildrenLength = Math.max(deleteSameChain.length, maxChildrenLength);
        }
        if (formatData.hops > maxHopRecord) {
            maxHopRecord = formatData.hops;
        }
        const linkChain = formatData.chain ? formatData.chain : UNKNOWN;

        const judgeNodesorLinksPush = (hasChildren: boolean) => {
            const linkTarget = `${linkChain} ${hasChildren ? formatData.hops : 'last'}`;
            const node = { name: linkTarget };
            nodes.push(node);
            if (hasChildren) {
                if (Number(formatData.amount) > 0) {
                    lastLevelNodesArr.push(`${linkChain} last`);
                    nodes.push({ name: `${linkChain} last` });
                    let zeroLineStyle;
                    let zeroLineEmphasisStyle;
                    let source;
                    let isZeroJumpLine;
                    if (!lastHop) {
                        zeroLineStyle = {
                            opacity: SANKEY_ZERO_JUMP_LINE_OPACITY.line
                        };
                        zeroLineEmphasisStyle = {
                            lineStyle: {
                                opacity: SANKEY_ZERO_JUMP_LINE_OPACITY.emphasis
                            }
                        };
                        source = `${linkChain} ${formatData.hops}`;
                        isZeroJumpLine = true;
                    } else {
                        source = lastHop;
                        isZeroJumpLine = false;
                    }
                    const link = {
                        source: source,
                        target: `${linkChain} last`,
                        value: formatData.amount,
                        lineStyle: zeroLineStyle,
                        emphasis: zeroLineEmphasisStyle,
                        isZeroJumpLine
                    };
                    links.push(link);
                    linksMap.set(`${linkChain} ${formatData.hops} ${linkChain} last`, link);
                }
            } else {
                lastLevelNodesArr.push(`${linkChain} last`);
            }
            if (lastHop) {
                const linkMapKey = `${lastHop} ${linkTarget}`;
                if (linksMap.has(linkMapKey)) {
                    const currentLinkInfo = linksMap.get(linkMapKey);
                    currentLinkInfo.value = formatAmount(currentLinkInfo.value, formatData.supply);
                } else {
                    const link = {
                        source: lastHop,
                        target: linkTarget,
                        value: formatData.supply
                    };
                    links.push(link);
                    linksMap.set(linkMapKey, link);
                }
            }
        };
        if (formatData.children?.length) {
            judgeNodesorLinksPush(true);
            formatData.children.forEach((item) => {
                format(item, `${linkChain} ${formatData.hops}`);
            });
        } else {
            judgeNodesorLinksPush(false);
        }
    };
    if (sankeyData.children?.length) {
        format(sankeyData);
    } else {
        nodes.push({
            name: `${sankeyData.chain} ${sankeyData.hops}`
        });
        nodes.push({
            name: `${sankeyData.chain} last`
        });
        links.push({
            source: `${sankeyData.chain} ${sankeyData.hops}`,
            target: `${sankeyData.chain} last`,
            value: sankeyData.amount,
            isZeroJumpLine: true,
            lineStyle: {
                opacity: SANKEY_ZERO_JUMP_LINE_OPACITY.line
            },
            emphasis: {
                lineStyle: {
                    opacity: SANKEY_ZERO_JUMP_LINE_OPACITY.emphasis
                }
            }
        });
        links.forEach((link) => {
            linksMap.set(`${link.source} ${link.target}`, link);
        });
    }
    const dedupNodes = [...new Set(nodes.map((node) => JSON.stringify(node)))].map((node) =>
        JSON.parse(node)
    );
    dedupNodes.forEach((node) => {
        if (node.name.includes(UNKNOWN)) {
            node.itemStyle = {
                color: UNKNOWN_NODE_COLOR,
                borderWidth: 1,
                borderColor: UNKNOWN_NODE_COLOR
            };
            node.lineStyle = {
                color: 'source',
                opacity: 0.4
            };
        }
        nodesMap.set(node.name, node);
    });
    for (const node of nodesMap.values()) {
        const chain = node.name.split(' ')[0];
        const hops = node.name.split(' ')[1];
        const chainInfo = await ChainHelper.getChainInfoByKey(chain);
        nodesArr.push({
            name: `${chainInfo?.pretty_name || chain} ${hops}`,
            itemStyle: node.itemStyle
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
            lineStyle: link.lineStyle,
            emphasis: link.emphasis,
            isZeroJumpLine: link.isZeroJumpLine
        });
    }
    // todo shan pretty_name 排序逻辑抽离
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
    const maxNodeHeight = Math.max(maxChildrenLength, [...new Set(lastLevelNodesArr)].length);
    return {
        nodes: [...cosmos, ...irishub, ...other],
        links: [...linksValueArr, ...linksNoValueArr],
        maxHopRecord,
        maxNodeHeight
    };
};
