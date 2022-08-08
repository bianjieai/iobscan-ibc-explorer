import { MODES } from './constants';

export interface IDataItem {
    id: TDenom;
    title: TDenom;
    disabled?: boolean;
    tooltips?: string;
    doubleTime?: boolean;
    metaData?: any;
}

export type TData = {
    groupName?: string;
    icon?: string;
    tooltips?: string;
    children?: IDataItem[];
}[];

export type TDenom = string | number;

export type TProps = {
    data: TData;
    value?: TDenom | TDenom[];
    mode?: MODES.multiple | MODES.double;
    placeholder?: string;
    hideIcon?: boolean;
    editModel?: boolean; // 修改时候是否展示框变化，默认false
    associateId?: string | number; // 双选时候，input输入时候一个值时候，另外展示的值
    badges?: [string, string];
    placeholders?: [string, string];
    inputCtn?: {
        title?: string;
        icon?: string;
        toolTip?: string;
        placeholder?: string;
        btnTxt: string;
    };
};

export type ModeType = TProps['mode'];
