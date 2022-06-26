import { TChannelStatus } from '@/components/responsive/component.interface';
import { ref } from 'vue';
import { HttpHelper } from '../helper/httpHelpers.js';
import { baseParams } from './tokens';

export type TChannelsListParams = {
  chain?: string
  status?: TChannelStatus
}

const urlPrefix = import.meta.env.VITE_BASE_GO_API

const getChannelsListUrl = `${urlPrefix}/ibc/channelList`

export const useGetChannelsList = () => {
  const data = ref([])

  const getList = async (params: TChannelsListParams = {}) => {
    const result = await HttpHelper.get(getChannelsListUrl, {
      params: {
        ...baseParams,
        ...params
      }
    })
    if (result) {
      const { items } = result
      data.value = items
    }
  }


  data.value = [{
    chain_a: 'irishub-1',
    channel_a: 'a',
    status: '1',
    chain_b: 'irishub-1',
    channel_b: 'b',
    operating_period: 300000000,
    last_updated: 1656147685957,
    relayers: 11,
    ibc_transfer_txs: 11,
    ibc_transfer_txs_value: 1000000000,
    currency: '$'
  }, {
    chain_a: 'irishub-1',
    channel_a: 'a',
    status: '2',
    chain_b: 'irishub-1',
    channel_b: 'b',
    operating_period: 300000000,
    last_updated: 1656147685957,
    relayers: 11,
    ibc_transfer_txs: 11,
    ibc_transfer_txs_value: 1000000000,
    currency: '$'
  }]

  return {
    data,
    getList
  }
}