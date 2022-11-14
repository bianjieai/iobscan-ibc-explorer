export const urlReplacePlaceholder = '=%=';

export const API_URL = {
    ibcChainsUrl: '/ibc/chains',
    ibcSearchPointUrl: '/ibc/searchPoint',
    ibcBaseDenomsUrl: '/ibc/baseDenoms',
    ibcDenomsUrl: '/ibc/denoms',
    ibcStatisticsUrl: '/ibc/statistics',
    ibcTxsUrl: '/ibc/txs',
    ibcTxDetailsUrl: '/ibc/txs_detail/',
    ibcTxDetailsSourceUrl: '/ibc/trace_source/',
    ibcTokensListUrl: '/ibc/tokenList',
    ibcIbcTokenListUrl: '/ibc/ibcTokenList',
    ibcChainsListUrl: '/ibc/chainList',
    ibcChannelsListUrl: '/ibc/channelList',
    ibcRelayerListUrl: '/ibc/relayerList',
    ibcRelayerDetailsUrl: 'ibc/relayer/',
    ibcRelayerRelayerName: '/ibc/relayer/names',
    ibcTxsSearchCondition: '/ibc/txs/searchCondition',
    ibcRelayedTrend: `/ibc/relayer/${urlReplacePlaceholder}/relayedTrend`,
    ibcTotalRelayedValue: `/ibc/relayer/${urlReplacePlaceholder}/totalRelayedValue`,
    ibcTotalFeeCost: `/ibc/relayer/${urlReplacePlaceholder}/totalFeeCost`
};
