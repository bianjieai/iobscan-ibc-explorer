import { TChannelStatus } from '@/components/responsive/component.interface';
import { ref } from 'vue';
import { HttpHelper } from '../helper/httpHelpers.js';
import { baseParams } from './tokens';
import ChainHelper from '../helper/chainHepler';

export type TChannelsListParams = {
  chain?: string
  status?: TChannelStatus
  use_count?: boolean
}

const urlPrefix = import.meta.env.VITE_BASE_GO_API

const getChannelsListUrl = `${urlPrefix}/ibc/channelList`

export const useGetChannelsList = () => {
  const list = ref([])
  const total = ref(0)

  const getList = async (params: TChannelsListParams = {}) => {
    const result = await HttpHelper.get(getChannelsListUrl, {
      params: {
        ...baseParams,
        ...params
      }
    })
    const { code, data, message } = result
    if (code === 0) {
      if (!params.use_count) {
        const { items } = data;
        list.value = ChainHelper.sortByChainName(items);
      } else {
        total.value = data;
      }
    } else {
      console.error(message)
    }
  }
  getList({use_count: true}); // todo taishan 为了获取 total, 后期优化
  return {
    list,
    total,
    getList
  }
}