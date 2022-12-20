export enum API_CODE {
    success = 0,
    wrongRequestParameters = 40000,
    systemAbnormality = 50000,
    nodeAccessError = 60000,
    noMatchAddress = 41000
}

export enum API_ERRPR_MESSAGE {
    loadFailed = 'Failed to Load',
    noData = 'No Data',
    wrongRequestParameters = 'Wrong Request Parameters',
    systemAbnormality = 'System Abnormality',
    nodeAccessError = 'Node Access Error'
}
