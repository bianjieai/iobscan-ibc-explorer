export interface IDataItem {
    id: TDenom;
    title: TDenom;
    disabled?: boolean;
    hideIcon?: boolean;
    icon?: string;
    tooltips?: string;
    doubleTime?: boolean;
}

export type TData = {
    groupName?: string;
    hideGroupName?: boolean;
    icon?: string;
    tooltips?: string;
    children?: IDataItem[];
}[];

export type TDenom = string | number;

export type TProps = {
    data: TData;
    value: TDenom | TDenom[];
    mode?: 'multiple' | 'double';
    defaultImg?: string;
};

export type ModeType = TProps['mode'];
