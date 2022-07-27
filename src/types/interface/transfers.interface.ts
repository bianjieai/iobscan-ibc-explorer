import { IRequestPagination } from '@/types/interface/baseApi.interface';

export interface IRequestIbcTxc extends IRequestPagination {
    date_range?: string;
    status: string;
}
