// table bottom status component
export type TBottomStatus = 'Channel' | 'Relayer';

export enum BottomStatusType {
    CHANNEL = 'Channel',
    RELAYER = 'Relayer'
}

export type TTableCellIconSize = 'small' | 'normal';

export interface ITableTokenInfo {
    defaultTitle: string;
    title: string;
    subtitle: string;
    imgSrc: string;
}

//tablecell icon size
export enum TableCellIconSize {
    SMALL = 'small',
    NORMAL = 'normal'
}

export enum CompareOrder {
    ASCEND = 'ascend',
    DESCEND = 'descend'
}

export type TRelayerStatus = '1' | '2' | '0';
export enum RelayerStatus {
    RUNNING = '1',
    UNKNOWN = '2',
    UNSEARCH = '0'
}

export type TChannelStatus = '1' | '2';
export enum ChannelStatus {
    OPEN = '1',
    CLOSED = '2'
}
