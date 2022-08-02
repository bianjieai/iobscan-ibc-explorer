export type DataItem = {
    denom?: TDenom;
    symbol?: string;
    disabled?: boolean;
    hideIcon?: boolean;
    icon?: string;
    tooltips?: string;
    [key: string]: any;
};

export type Data = {
    groupName?: String;
    hideGroupName?: boolean;
    icon?: string;
    tooltips?: string;
    children?: DataItem[];
}[];

export type TDenom = string | number;

export type IProps = {
    data: Data;
    value: TDenom | TDenom[];
    mode?: 'multiple' | 'two';
    format: string;
    renderItem: string;
};

export type ModeType = IProps['mode'];
