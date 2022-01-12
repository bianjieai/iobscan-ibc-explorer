<template>
    <div class="transfer_container">
        <loading v-show="isShowLoading.value"></loading>
        <div class="transfer_detail_content_wrap">
            <div class="transfer_detail_top_content">
                <div class="transfer_detail_title">
                    <span class="detail_title">Transfer Details</span>
                    <span class="success_icon" v-show="ibcTxStatus === 1">
                        <i class="iconfont icon-chenggong"></i>
                        Success
                    </span>
                    <span class="failed_icon" v-show="ibcTxStatus === 2 || ibcTxStatus === 4">
                        <i class="iconfont icon-shibai"></i>
                        Failed
                    </span>
                    <span class="processing_icon" v-show="ibcTxStatus === 3">
                        <i class="iconfont icon-dengdai"></i>
                        Processing
                    </span>
                </div>
                <div class="transfer_ibc_out_tx_hash">
                    <span class="transfer_ibc_out_tx_hash_label">
                        <i v-show="outTxStatus === 'default'" class="iconfont icon-address1"></i>
                        <i v-show="outTxStatus === 1 " style="color: rgba(0, 200, 83, 1)" class="iconfont icon-address1"></i>
                        <i v-show="outTxStatus === 0" style="color:rgba(255, 90, 90, 1);" class="iconfont icon-address1"></i>
                        IBC Out TxHash:
                    </span>
                    <span class="transfer_ibc_out_tx_hash_value">{{ibcTransferOutTxHash}} <copy-component v-show="ibcTransferOutTxHash !== '--'" :copy-text="ibcTransferOutTxHash"></copy-component></span>
                </div>
                <div class="transfer_arrows_icon">
                    <i v-show="ibcTxStatus === 1" style="color: rgba(0, 200, 83, 1)"  class="iconfont_style iconfont icon-zhuangtai"></i>
                    <i v-show="ibcTxStatus === 2 || ibcTxStatus === 4" style="color: rgba(255, 90, 90, 1)"  class="iconfont_style iconfont icon-zhuangtai"></i>
                    <i v-show="ibcTxStatus === 3" style="color: rgba(255, 196, 0, 1)" class="iconfont_style iconfont icon-zhuangtai"></i>
                    <i v-show="ibcTxStatus === 'default'" style="color: rgba(0, 0, 0, 0.35)" class="iconfont_style iconfont icon-zhuangtai"></i>


                </div>
                <div class="transfer_ibc_in_tx_hash">
                    <span class="transfer_ibc_in_tx_hash_label">
                        <i v-show="inTxStatus === 'default'" class="iconfont icon-address1"></i>
                        <i v-show="inTxStatus === 1 " style="color: rgba(0, 200, 83, 1)" class="iconfont icon-address1"></i>
                        <i v-show="inTxStatus === 0" style="color:rgba(255, 90, 90, 1);" class="iconfont icon-address1"></i>
                        IBC In TxHash:
                    </span>
                    <span class="transfer_ibc_in_tx_hash_value">{{ibcTransferInTxHash}} <copy-component v-show="ibcTransferInTxHash !== '--'"  :copy-text="ibcTransferInTxHash"></copy-component></span>
                </div>
                <div class="transfer_sequence">
                    <span class="transfer_sequence_label">
                        <i class="iconfont icon-Sequence"></i>
                        Sequence:
                    </span>
                    <span class="transfer_sequence_value">{{sequence}}</span>
                </div>
            </div>
            <div class="transfer_Details_content">
                <div class="transfer_out_content">
                    <transfer-details-card :title="'IBC Out Details'"
                                           :details="transferOutDetails"
                                           :expand-details="transferOutExpandDetails"
                                           :base-denom="baseDenom"></transfer-details-card>
                </div>
                <div class="transfer_in_content">
                    <transfer-details-card :title="'IBC In Details'"
                                           :details="transferInDetails"
                                           :expand-details="transferInExpandDetails"
                                           :base-denom="baseDenom"></transfer-details-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getTxDetailsByTxHash} from "../service/api";
import {useRoute,useRouter} from 'vue-router';
import Loading from "../components/Loading";
import TransferDetailsCard from "../components/TransferDetailsCard";
import {reactive, watch,onMounted,ref} from 'vue';
import CopyComponent from "../components/CopyComponent";

export default {
    name: "TransferDetail",
    components: {CopyComponent, TransferDetailsCard, Loading},
    setup() {
        const route = useRoute();
        const router = useRouter();
        const isShowLoading = reactive({
            value: true
        })
        let ibcTransferOutTxHash= ref('--')
        let ibcTransferInTxHash = ref('--')
        let ibcTxStatus = ref('default')
        let outTxStatus = ref('default')
        let inTxStatus = ref('default')
        let sequence = ref('--')
        let baseDenom = ref('')
        const transferOutDetails = reactive([
            {
                label: 'MsgType:',
                value: 'IBC Transfer Out',
            },
            {
                label: 'Chain ID:',
                value: '--',
                dataKey: 'sc_chain_id',
                isFormatChainID:true
            },
            {
                label: 'Port:',
                value: '--',
                dataKey: 'sc_port',
            },
            {
                label: 'Channel ID:',
                value: '--',
                dataKey: 'sc_channel',
            },
            {
                label: 'Send Token:',
                value: '--',
                dataKey: 'sc_tx_info.msg_amount',
                isFormatToken: true
            },
            {
                label: 'IBC Out Address:',
                value: '--',
                dataKey: 'sc_tx_info.msg.msg.sender',
                isAddress:true
            },
            {
                label: 'Block:',
                value: '--',
                dataKey: 'sc_tx_info.height',
            },
            {
                label: 'Status:',
                value: '--',
                dataKey: 'sc_tx_info.status',
                isFormatStatus: true
            },
            {
                label: 'Timestamp:',
                value: '--',
                dataKey: 'tx_time',
                isFormatDate: true
            },
            {
                label: 'Fee:',
                value: '--',
                dataKey: 'sc_tx_info.fee.amount',
                isFormatFee: true
            },
            {
                label: 'Signer:',
                value: '--',
                dataKey: 'sc_signers',
                isAddress:true
            },

        ])
        const transferOutExpandDetails = reactive([
            {
                label: 'Connection:',
                value: '--',
                dataKey: 'sc_connect',
                isExpand: false,
            },
            {
                label: 'Time Out Height:',
                value: '--',
                dataKey: 'sc_tx_info.msg.msg.timeout_height',
                isExpand: false,
                isFormatHeight: true,
            },
            {
                label: 'Time Out Timestamp:',
                value: '--',
                dataKey: 'sc_tx_info.msg.msg.timeout_timestamp',
                isExpand: false,
            }
        ])
        const transferInDetails = reactive([
            {
                label: 'MsgType:',
                value: 'IBC Transfer In',
            },
            {
                label: 'Chain ID:',
                value: '--',
                dataKey: 'dc_chain_id',
                isFormatChainID:true
            },
            {
                label: 'Port:',
                value: '--',
                dataKey: 'dc_port',
            },
            {
                label: 'Channel ID:',
                value: '--',
                dataKey: 'dc_channel',
            },
            {
                label: 'Received Token:',
                value: '--',
                dataKey: 'dc_tx_info.msg.msg.packet.data',
                isFormatToken: true
            },
            {
                label: 'IBC In Address:',
                value: '--',
                dataKey: 'sc_tx_info.msg.msg.receiver',
                isAddress:true
            },
            {
                label: 'Block:',
                value: '--',
                dataKey: 'dc_tx_info.height',
            },
            {
                label: 'Status:',
                value: '--',
                dataKey: 'dc_tx_info.status',
                isFormatStatus: true
            },
            {
                label: 'Timestamp:',
                value: '--',
                dataKey: 'dc_tx_info.time',
                isFormatDate: true
            },
            {
                label: 'Fee:',
                value: '--',
                dataKey: 'dc_tx_info.fee.amount',
                isFormatFee: true
            },
            {
                label: 'Signer:',
                value: '--',
                dataKey: 'dc_signers',
                isAddress:true,
            },

        ])
        const transferInExpandDetails = [
            {
                label: 'Connection:',
                value: '--',
                dataKey: 'dc_connect',
                isExpand: true,
            },
            {
                label: 'Packet Ack:',
                value: '--',
                dataKey: 'dc_tx_info.ack',
                isExpand: true,
                isAck:true
            },
            {
                label: 'Proof Height:',
                value: '--',
                dataKey: 'dc_tx_info.msg.msg.proof_height',
                isExpand: true,
                isFormatHeight: true,
            }
        ]
        watch(route, (newValue, oldValue) => {
            if(newValue?.query?.hash){
                getTxDetails(newValue.query.hash)
            }
        })
        const getTxDetails = (txHash) => {
            isShowLoading.value = true
            getTxDetailsByTxHash(route.query.hash).then(result => {
                isShowLoading.value = false
                if(result?.length === 1){
                    const res = result[0]
                    if(res?.sc_tx_info?.hash){
                        ibcTransferOutTxHash.value = res.sc_tx_info.hash

                    }
                    if(res?.sc_tx_info?.status >= 0){
                        outTxStatus.value = res.sc_tx_info.status
                    }
                    if(res?.dc_tx_info?.hash){
                        ibcTransferInTxHash.value = res.dc_tx_info.hash
                    }
                    if(res?.dc_tx_info?.status >= 0){
                        inTxStatus.value = res.dc_tx_info.status
                    }
                    if(res?.sequence){
                        sequence.value = res.sequence
                    }
                    if(res?.status){
                        ibcTxStatus.value = res.status
                    }
                    if(res?.base_denom){
                        baseDenom.value = res.base_denom
                    }
                    transferOutDetails.forEach(item => {
                        if (item?.dataKey?.includes('.')) {
                            const keys = item.dataKey.split('.')
                            if (keys?.length) {
                                let result = res
                                keys.forEach(key => {
                                    result = result[key] || result[key] === 0 ? result[key] : ''
                                    item.value = result

                                })
                            }
                        } else {
                            if (item.dataKey) {
                                item.value = res[item.dataKey]
                            }
                        }
                    })
                    transferOutExpandDetails.forEach(item => {
                        if (item?.dataKey?.includes('.')) {
                            const keys = item.dataKey.split('.')
                            if (keys?.length) {
                                let result = res
                                keys.forEach(key => {
                                    result = result[key] || result[key] === 0 ? result[key] : ''
                                    item.value = result

                                })
                            }
                        } else {
                            if (item.dataKey) {
                                item.value = res[item.dataKey]
                            }
                        }
                    })
                    transferInDetails.forEach(item => {
                        if (item?.dataKey?.includes('.')) {
                            const keys = item.dataKey.split('.')
                            if (keys?.length) {
                                let result = res
                                keys.forEach(key => {
                                    result = result[key] || result[key] === 0 ? result[key] : ''
                                    item.value = result

                                })
                            }
                        } else {
                            if (item.dataKey) {
                                item.value = res[item.dataKey]
                            }
                        }
                    })
                    transferInExpandDetails.forEach(item => {
                        if (item?.dataKey?.includes('.')) {
                            const keys = item.dataKey.split('.')
                            if (keys?.length) {
                                let result = res
                                keys.forEach(key => {
                                    result = result[key] || result[key] === 0 ? result[key] : ''
                                    item.value = result

                                })
                            }
                        } else {
                            if (item.dataKey) {
                                item.value = res[item.dataKey]
                            }
                        }
                    })
                }else {
                    router.push(`/searchResult`)
                }

            }).catch(error => {
                isShowLoading.value = false
                console.error(error)
            })
        }
        if (route?.query?.hash) {
            getTxDetails(route?.query?.hash)
        }
        return {
            transferOutDetails,
            transferInDetails,
            isShowLoading,
            ibcTransferOutTxHash,
            ibcTransferInTxHash,
            sequence,
            transferOutExpandDetails,
            transferInExpandDetails,
            ibcTxStatus,
            outTxStatus,
            inTxStatus,
            baseDenom
        }
    }
}
</script>

<style scoped lang="scss">
.transfer_container {
    flex: 1;
    display: flex;
    width: 100%;
    position: relative;

    .transfer_detail_content_wrap {
        width: 100%;
        height: 100%;
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        text-align: left;

        .transfer_detail_top_content {
            margin-top: 48px;
            .transfer_detail_title{
                .detail_title{
                    font-size: 20px;
                    font-weight: 400;
                    color: #000000;
                    line-height: 20px;
                    position: relative;
                    &:after{
                        content: '';
                        background: linear-gradient(90deg, rgba(112, 136, 255, 0) 0%, rgba(61, 80, 255, 0.15) 100%);
                        width: 100%;
                        height: 12px;
                        border-radius: 6px;
                        position: absolute;
                        left: 5px;
                        bottom: 0px;
                    }
                }
                .success_icon{
                    padding: 6px 7px;
                    background: rgba(0, 200, 83, 0.15);
                    border-radius: 4px;
                    color: rgba(0, 200, 83, 1);
                    .iconfont{
                        color: rgba(0, 200, 83, 1);
                    }
                    margin-left: 17px;
                }
                .failed_icon{
                    padding: 6px 7px;
                    background: rgba(255, 90, 90, 0.15);
                    border-radius: 4px;
                    color: rgba(255, 90, 90, 1);
                    .iconfont{
                        color: rgba(255, 90, 90, 1);
                    }
                    margin-left: 17px;
                }
                .processing_icon{
                    padding: 6px 7px;
                    background: rgba(255, 196, 0, 0.15);
                    border-radius: 4px;
                    color: rgba(255, 196, 0, 1);
                    .iconfont{
                        color: rgba(255, 196, 0, 1);
                    }
                    margin-left: 17px;
                }
            }
            .transfer_ibc_out_tx_hash{
                margin-top: 23px;
                display: flex;
                .transfer_ibc_out_tx_hash_label{
                    font-size: 14px;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 0.35);
                    line-height: 14px;
                    width: 140px;
                    i{
                        position: relative;
                        top:1px;
                        left: 0;
                    }
                }
                .transfer_ibc_out_tx_hash_value{
                    font-size: 14px;
                    font-weight: lighter;
                    color: rgba(0, 0, 0, 0.35);
                    line-height: 14px;
                    display: flex;
                    max-width: 340px;
                }
            }
            .transfer_arrows_icon{
                height: 20px;
                line-height: 20px;
                display: flex;
                align-items: center;
                .iconfont_style{
                    display: inline-block;
                    transform: rotate(90deg);
                    color: rgba(0, 0, 0, 0.35);
                }
            }
            .transfer_ibc_in_tx_hash{
                display: flex;
                .transfer_ibc_in_tx_hash_label{
                    font-size: 14px;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 0.35);
                    line-height: 14px;
                    width: 140px;
                    i{
                        position: relative;
                        top:1px;
                        left: 0;
                    }
                }
                .transfer_ibc_in_tx_hash_value{
                    font-size: 14px;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 0.35);
                    line-height: 14px;
                    display: flex;
                    max-width: 340px;
                }
            }
            .transfer_sequence{
                margin: 18px 0 16px 0;
                .transfer_sequence_label{
                    font-size: 14px;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 0.35);
                    line-height: 14px;
                    width: 140px;
                    display: inline-block;
                    i{
                        font-size: 14px;
                    }
                }
                .transfer_sequence_value{
                    font-size: 14px;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 0.35);
                    line-height: 14px;
                }
            }
        }

        .transfer_Details_content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-column-gap: 24px;
            width: 100%;

            .transfer_out_content {
                flex: 1;
            }

            .transfer_in_content {
                flex: 1;
            }
        }
    }
}
</style>
