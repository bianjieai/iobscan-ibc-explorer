export enum API_CODE {
    success = 0,
    wrongRequestParameters = 40000,
    systemAbnormality = 50000,
    unRegisteredRelayer = 50001,
    nodeAccessError = 60000,
    // todo shan 需要根据接口返回特殊的 code 标识未找到对应地址信息，更换该 code 值
    noMatchAddress = 888
}

export enum API_ERRPR_MESSAGE {
    loadFailed = 'Failed to Load',
    noData = 'No Data',
    wrongRequestParameters = 'Wrong Request Parameters',
    systemAbnormality = 'System Abnormality',
    nodeAccessError = 'Node Access Error'
}
