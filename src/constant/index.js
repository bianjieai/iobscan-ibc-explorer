/* eslint-disable import/prefer-default-export */
const menus = [
  {
    label: 'Home',
    value: 'Home',
  },
  {
    label: 'Transfers',
    value: 'Transfers',
  },
  {
    label: 'Tokens',
    value: 'Tokens',
  },
  {
    label: 'Network',
    value: 'Network',
  },
  {
    label: 'Channels',
    value: 'Channels',
  },
  {
    label: 'Relayers',
    value: 'Relayers',
  },
];

const statisticsName = {
  chains_24hr: 'Active IBC Chains',
  chain_all: 'All IBC Chains',
  channels_24hr: 'Active',
  channel_all: 'All',
  channel_opened: 'Opened',
  channel_closed: 'Closed',
  denom_all: 'Tokens by Denom',
  base_denom_all: 'Tokens by Base Denom',
  tx_24hr_all: 'Recent',
  tx_all: 'All',
  tx_success: 'Success',
  tx_failed: 'Failed',
};

const ibcStatisticsChainsDefault = {
  chains_24hr: {
    statistics_name: 'chains_24hr',
    count: 0,
  },
  chain_all: {
    statistics_name: 'chain_all',
    count: 0,
  },
};

const ibcStatisticsChannelsDefault = {
  channels_24hr: {
    statistics_name: 'channels_24hr',
    count: 0,
  },
  channel_all: {
    statistics_name: 'channel_all',
    count: 0,
  },
  channel_opened: {
    statistics_name: 'channel_opened',
    count: 0,
  },
  channel_closed: {
    statistics_name: 'channel_closed',
    count: 0,
  },
};

const ibcStatisticsDenomsDefault = {
  denom_all: {
    statistics_name: 'denom_all',
    count: 0,
  },
  base_denom_all: {
    statistics_name: 'base_denom_all',
    count: 0,
  },
};

const ibcStatisticsTxsDefault = {
  tx_24hr_all: {
    statistics_name: 'tx_24hr_all',
    count: 0,
  },
  tx_all: {
    statistics_name: 'tx_all',
    count: 0,
  },
  tx_success: {
    statistics_name: 'tx_success',
    count: 0,
  },
  tx_failed: {
    statistics_name: 'tx_failed',
    count: 0,
  },
};

export {
  menus,
  statisticsName,
  ibcStatisticsChainsDefault,
  ibcStatisticsChannelsDefault,
  ibcStatisticsDenomsDefault,
  ibcStatisticsTxsDefault,
};
