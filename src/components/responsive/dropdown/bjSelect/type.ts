export type DataItem = {
    groupName?: String;
    denom: TDenom;
    symbol?: string;
    disabled?: boolean;
    hideIcon?: boolean;
    hideGroupName?: boolean;
    icon?: string;
    tooltips?: string;
};

export type Data = (DataItem & {
    children?: DataItem[];
})[];

export type TDenom = string | undefined;

export interface IProps {
    data: Data;
    value?: string | string[];
    mode?: 'multiple';
}
