import { TChannelStatus } from '@/components/responsive/component.interface';
import { ref } from 'vue';
import { HttpHelper } from '../helper/httpHelpers.js';
import { baseParams } from './tokens';
import ChainHelper from '../helper/chainHepler';

export type TChannelsListParams = {
  chain?: string
  status?: TChannelStatus
}

const urlPrefix = import.meta.env.VITE_BASE_GO_API

const getChannelsListUrl = `${urlPrefix}/ibc/channelList`

export const useGetChannelsList = () => {
  const list = ref([])
  const total = ref(0)

  const getList = async (params: TChannelsListParams = {}, totalCount: boolean = false) => {
    const result = await HttpHelper.get(getChannelsListUrl, {
      params: {
        ...baseParams,
        ...(totalCount ? {} : params)
      }
    })
    const { code, data, message } = result
    if (code === 0) {
      const { items } = data
      if (!totalCount) {
        list.value = ChainHelper.sortByChainName(items);
      } else {
        total.value = items.length
      }
    } else {
      console.error(message)
    }
  }
  getList({}, true); // todo taishan 为了获取 total, 后期优化
  return {
    list,
    total,
    getList
  }
}