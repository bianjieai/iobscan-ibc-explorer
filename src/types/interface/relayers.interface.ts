import { IRequestPagination, IResponsePageInfo } from '@/types/interface/baseApi.interface';
import { TRelayerStatus } from '@/types/interface/component.interface.js';
import { Ref } from 'vue';

export interface IRequestRelayerList extends IRequestPagination {
    chain?: string;
    status?: TRelayerStatus;
}

export interface IResponseRelayerListItem {
    relayer_name: string;
    relayer_icon: string;
    channel_a: string;
    chain_a_address: string;
    channel_b: string;
    chain_b_address: string;
    chain_a: string;
    chain_b: string;
    status: number;
    update_time: number;
    transfer_total_txs: number;
    transfer_success_txs: number;
    transfer_total_txs_value: string;
    currency: string;
}

export interface IResponseRelayerList {
    items: IResponseRelayerListItem;
    page_info: IResponsePageInfo;
}

export interface TRelayersListParams {
    chain?: string;
    status?: TRelayerStatus;
    use_count?: boolean;
    loading?: Ref<boolean>;
}
