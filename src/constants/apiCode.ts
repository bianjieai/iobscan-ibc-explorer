export enum API_CODE {
    success = 0,
    wrongRequestParameters = 40000,
    systemAbnormality = 50000,
    unRegisteredRelayer = 50001,
    nodeAccessError = 60000
}

export enum API_ERRPR_MESSAGE {
    networkError = 'network error',
    noData = 'No Data',
    wrongRequestParameters = 'Wrong Request Parameters',
    systemAbnormality = 'System Abnormality',
    nodeAccessError = 'Node Access Error'
}
