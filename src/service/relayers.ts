import { TRelayerStatus } from '@/components/responsive/component.interface.js';
import { ref } from 'vue';
import { HttpHelper } from '../helper/httpHelpers.js';
import { baseParams } from './tokens';
import { formatTransfer_success_txs } from '@/helper/tablecell-helper';

type TRelayersListParams = {
  chain?: string
  status?: TRelayerStatus
}

const urlPrefix = import.meta.env.VITE_BASE_GO_API

const getRelayersListUrl = `${urlPrefix}/ibc/relayerList`

export const useGetRelayersList = () => {
  const list = ref([])
  const total = ref(0)

  const getList = async (params: TRelayersListParams = {}, totalCount: boolean = false) => {
    const result = await HttpHelper.get(getRelayersListUrl, {
      params: {
        ...baseParams,
        ...(totalCount ? {} : params)
      }
    })
    const { code, data, message } = result

    if (code === 0) {
      const { items } = data
      if (!totalCount) {
        list.value = (items ?? []).map((item:any)=>{
          item.txs_success_rate = formatTransfer_success_txs(item.transfer_success_txs, item.transfer_total_txs);
          return item;
        });
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