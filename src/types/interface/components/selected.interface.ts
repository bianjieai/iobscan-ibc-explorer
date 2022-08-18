export interface ISelectedData {
    groupName?: string;
    icon?: string;
    tooltips?: string;
    children?: {
        id: number | string;
        title: string;
        icon?: string;
        disabled?: boolean;
        tooltips?: string;
        doubleTime?: boolean;
        metaData?: any;
        inputFlag?: boolean; // 用来输入还是选择在展示时候有区别
    }[];
}
