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
    const { code, data, message } = result

    if (code === 0) {
      const { items } = data
      data.value = items
    } else {
      console.error(message)
    }
  }

  return {
    data,
    getList
  }
}