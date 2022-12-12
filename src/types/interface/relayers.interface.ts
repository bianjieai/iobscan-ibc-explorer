import { RelayersListKey } from '@/constants/relayers';
import type {
    IRequestPagination,
    IResponsePageInfo,
    IResponseTokenInfo
} from '@/types/interface/index.interface';
import { LinearGradientObject } from 'echarts';
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
    prettyName: string;
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
    is_registered: boolean;
    show_popover: boolean;
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
    served_chains_info: string[];
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
    denom_info: IResponseTokenInfo;
    fee_info: IResponseTokenInfo;
    tx_status: number;
    signer: string;
    tx_time: number;
}
export interface IRelayerTransferItemFormat extends IRelayerTransferItem {
    format_tx_time: string;
}
export interface IRelayerTransferList {
    items: IRelayerTransferItem[];
    page_info: IResponsePageInfo;
}

export interface IRequestRelayedTrend {
    relayer_id: string;
    days?: number;
}

export interface IRequestTotalRelayedValueOrFee {
    relayer_id: string;
}

export interface IResponseRelayerTrend {
    date: string;
    txs: number;
    txs_value: string;
}

export interface IDenomItem {
    base_denom: string;
    base_denom_chain: string;
    txs: number;
    txs_value: string;
}
export interface IResponseTotalRelayedValue {
    total_txs: number;
    total_txs_value: string;
    total_denom_count: number;
    denom_list: IDenomItem[];
}

export interface FormatDenomItem extends IDenomItem {
    imgUrl: string;
    name: string;
}

export interface IResponseTotalFeeCost {
    total_txs: number;
    total_fee_value: string;
    total_denom_count: number;
    denom_list: IDenomItem[];
}

export interface BarData {
    value: string | number;
    itemStyle?: {
        color: string | LinearGradientObject;
    };
}

export interface RelayerTrendData {
    date: string[];
    txs: BarData[];
    txsValue: BarData[];
}

export interface PieData {
    name?: string;
    displayName?: string;
    value: string | number;
    imgUrl?: string;
    percent?: string;
    itemStyle: {
        color: string;
    };
}

export interface RelayedValueData {
    totalValue: string;
    valueOpacity: PieData[];
    value: PieData[];
    totalTxs: number | string;
    txsOpacity: PieData[];
    txs: PieData[];
    totalValueCount: number;
    totalDenomCount: number;
    valueTwoLegend: boolean;
    txsTwoLegend: boolean;
    valueNoData: boolean;
    txsNoData: boolean;
}

export enum RelatedAssetsPieType {
    relayedValue,
    feeCost
}

export interface ChainPopoverChainItem {
    prettyName: string;
    chainLogo: string;
    address: string[];
}
