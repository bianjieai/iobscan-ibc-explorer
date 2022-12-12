export const urlReplacePlaceholder = '=%=';
export const urlReplacePlaceholder2 = '==%==';

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
    ibcTotalFeeCost: `/ibc/relayer/${urlReplacePlaceholder}/totalFeeCost`,
    ibcAddrBaseInfo: `/ibc/chain/${urlReplacePlaceholder}/address/${urlReplacePlaceholder2}`,
    ibcAddrTokenList: `/ibc/chain/${urlReplacePlaceholder}/address/${urlReplacePlaceholder2}/tokens`,
    ibcAddrTxs: `/ibc/chain/${urlReplacePlaceholder}/address/${urlReplacePlaceholder2}/txs`,
    ibcAddrTxsExport: `/ibc/chain/${urlReplacePlaceholder}/address/${urlReplacePlaceholder2}/txs/export`,
    ibcAddrAccountToken: `/ibc/chain/${urlReplacePlaceholder}/address/${urlReplacePlaceholder2}/accounts`
};
