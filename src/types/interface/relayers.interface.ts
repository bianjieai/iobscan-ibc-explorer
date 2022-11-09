import { RelayersListKey } from '@/constants/relayers';
import { IRequestPagination, IResponsePageInfo } from '@/types/interface/index.interface';
import { Ref } from 'vue';
export type TTxsSuccessRate = string | number | undefined;

export interface IRequestRelayerList extends IRequestPagination {
    relayer_name?: string;
    relayer_address?: string;
    loading?: Ref<boolean>;
}

export interface ServedChainsInfo {
    chain: string;
    addresses: string[];
}

export interface IResponseRelayerListItem {
    relayer_name: string;
    relayer_id: string;
    relayer_icon: string;
    served_chains: number;
    served_chains_info: ServedChainsInfo[];
    update_time: number;
    relayed_total_txs: number;
    relayed_success_txs: number;
    relayed_total_txs_value: string;
    total_fee_value: string;
}

export interface IResponseRelayerList {
    items: IResponseRelayerListItem[];
    page_info: IResponsePageInfo;
}

export interface chainPopoverProp {
    chain: string;
    chainName: string;
    chainLogo: string;
    address: string[];
}
export interface RelayerListItem {
    [RelayersListKey.relayersRelayerName]: string;
    [RelayersListKey.relayersServedChains]: number;
    [RelayersListKey.relayersSuccessRate]: number;
    [RelayersListKey.relayersIbcTransferTxs]: number;
    [RelayersListKey.relayersTotalRelayedValue]: string;
    [RelayersListKey.relayersTotalFeeCost]: string;
    [RelayersListKey.relayersLastUpdated]: number;
    relayer_id: string;
    relayer_icon: string;
    served_chains_infos: chainPopoverProp[];
}
export interface IChannelChain {
    chain_a: string;
    channel_a: string;
    chain_a_addresses: string[];
    chain_b: string;
    channel_b: string;
    chain_b_addresses: string[];
    channel_pair_status: number;
}
export interface IResponseRelayerDetails {
    relayer_id: string;
    relayer_name: string;
    relayer_icon: string;
    served_chains: string[];
    channel_pair_info: IChannelChain[];
    update_time: string;
    relayed_total_txs: number;
    relayed_success_txs: number;
    relayed_total_txs_value: string;
    total_fee_value: string;
}

export interface ITransferTypeTxs {
    recv_packet_txs: number;
    acknowledge_packet_txs: number;
    timeout_packet_txs: number;
}

export interface IRequestRelayerTransfer extends IRequestPagination {
    chain: string;
    tx_time_start?: string;
    tx_time_end?: string;
}

export interface IRelayerTransferItem {
    tx_hash: string;
    tx_type: string;
    chain: string;
    denom_info: {
        denom: string;
        denom_chain: string;
        base_denom: string;
        base_denom_chain: string;
        amount: string;
    };
    fee_info: {
        denom: string;
        denom_chain: string;
        amount: string;
    };
    tx_status: number;
    signer: string;
    tx_time: number;
}
export interface IRelayerTransferList {
    items: IRelayerTransferItem[];
    page_info: IResponsePageInfo;
}
