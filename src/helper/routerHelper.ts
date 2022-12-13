import { ROUTE_INFO } from '@/constants/index';

export const isAddressDetailsName = (name: string) => {
    const routerName = ROUTE_INFO.addressDetails.name;
    return name === routerName;
};
