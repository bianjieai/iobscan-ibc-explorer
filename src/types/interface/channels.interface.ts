import { TChannelStatus } from '@/types/interface/components/table.interface';
import { Ref } from 'vue';
import { IRequestPagination, IResponsePageInfo } from './index.interface';

export interface IRequestChannelsList extends IRequestPagination {
    chain?: string;
    status?: TChannelStatus;
    loading?: Ref<boolean>;
}

export interface IResponseChannelsListItem {
    chain_a: string;
    chain_b: string;
    channel_a: string;
    channel_b: string;
    currency: string;
    ibc_transfer_txs: number;
    ibc_transfer_txs_value: string;
    last_updated: number;
    operating_period: number;
    pending_txs: number;
    status: number;
}

export interface IResponseChannelsList {
    items: IResponseChannelsListItem[];
    page_info: IResponsePageInfo;
}
