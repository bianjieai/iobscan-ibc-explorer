/* eslint-disable import/prefer-default-export */
const testChains = {
  active: [
    {
      chain_id: 'a1',
      chain_name: 'a1',
      icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto',
    },
    {
      chain_id: 'b1',
      chain_name: 'b1',
      icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto',
    },
    {
      chain_id: 'c1',
      chain_name: 'c1',
      icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto',
    },
    {
      chain_id: 'f1',
      chain_name: 'f1',
      icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto',
    },
    {
      chain_id: 'g1',
      chain_name: 'g1',
      icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto',
    },
    {
      chain_id: 'k1',
      chain_name: 'k1',
      icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto',
    },
    {
      chain_id: 'l1',
      chain_name: 'l1',
      icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto',
    },
    {
      chain_id: 'm1',
      chain_name: 'm1',
      icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto',
    },
    {
      chain_id: 'p1',
      chain_name: 'p1',
      icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto',
    },
    {
      chain_id: 'r1',
      chain_name: 'r1',
      icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto',
    },
    {
      chain_id: 'x1',
      chain_name: 'x1',
      icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto',
    },
    {
      chain_id: 'z1',
      chain_name: 'z1',
      icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto',
    },
    {
      chain_id: '11',
      chain_name: '11',
      icon: 'https://img0.baidu.com/it/u=3122136587,3938996930&fm=26&fmt=auto',
    },
  ],
};

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

const chainMenus = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
  {
    label: 'All',
    value: 'all',
  },
];

const anchorsDatas = [
  {
    title: 'A-E',
    collection: ['A', 'B', 'C', 'D', 'E'],
  },
  {
    title: 'F-J',
    collection: ['F', 'G', 'H', 'I', 'J'],
  },
  {
    title: 'K-O',
    collection: ['K', 'L', 'M', 'N', 'O'],
  },
  {
    title: 'P-T',
    collection: ['P', 'Q', 'R', 'S', 'T'],
  },
  {
    title: 'U-Z',
    collection: ['U', 'V', 'W', 'X', 'Y', 'Z'],
  },
  {
    title: '#',
    collection: ['#'],
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

const ageTimerInterval = 1000;

export {
  testChains,
  menus,
  chainMenus,
  anchorsDatas,
  statisticsName,
  ageTimerInterval,
  ibcStatisticsChainsDefault,
  ibcStatisticsChannelsDefault,
  ibcStatisticsDenomsDefault,
  ibcStatisticsTxsDefault,
};
