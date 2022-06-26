import { TRelayerStatus } from '@/components/responsive/component.interface.js';
import { ref } from 'vue';
import { HttpHelper } from '../helper/httpHelpers.js';
import { baseParams } from './tokens';

type TRelayersListParams = {
  chain?: string
  status?: TRelayerStatus
}

const urlPrefix = import.meta.env.VITE_BASE_GO_API

const getRelayersListUrl = `${urlPrefix}/ibc/relayerList`

export const useGetRelayersList = () => {
  const data = ref([])

  const getList = async (params: TRelayersListParams = {}) => {
    const result = await HttpHelper.get(getRelayersListUrl, {
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
    relayer_name: 'ZA',
    // relayer_icon: 'https://iobscan.io/resources/xp-chains/irishub-1.png',
    relayer_icon: '',
    chain_a: 'irishub-1',
    channel_a: 'xxa',
    chain_b: 'irishub-1',
    channel_b: 'xxa',
    update_time: 1656147685957,
    ibc_success_transfer_txs: 90,
    ibc_transfer_txs: 1000,
    ibc_transfer_txs_value: 1000000000,
    currency: '$',
    status: 1,
    chain_a_address: 'iaadsahss3dsj4k3si2jo3jsusk322dji3',
    chain_b_address: 'cosmos13ushe3jsh3is9js9sjsjh9sha9she48shs8e'
  }, {
    relayer_name: 'ZA',
    relayer_icon: 'https://iobscan.io/resources/xp-chains/irishub-1.png',
    chain_a: 'irishub-1',
    channel_a: 'xxa',
    chain_b: 'irishub-1',
    channel_b: 'xxb',
    update_time: 1656147685957,
    ibc_success_transfer_txs: 9011,
    ibc_transfer_txs: 1000,
    ibc_transfer_txs_value: 10000000000,
    currency: '$',
    status: 2,
    chain_a_address: 'iaadsahss3dsj4k3si2jo3jsusk322dji311',
    chain_b_address: 'cosmos13ushe3jsh3is9js9sjsjh9sha9she48shs8e'
  }]

  return {
    data,
    getList
  }
}