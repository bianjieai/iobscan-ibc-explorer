import { MODES } from './constants';

export interface IDataItem {
    id: TDenom;
    title: TDenom;
    icon?: string;
    disabled?: boolean;
    tooltips?: string;
    doubleTime?: boolean;
    metaData?: any;
    inputFlag?: boolean; // 判断是输入还是选择的，在展示的时候需要处理
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
    inputFlag?: boolean;
    placeholder?: string;
    hideIcon?: boolean;
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

export type TUseInit = Pick<TProps, 'mode' | 'data' | 'value' | 'inputFlag'>;
