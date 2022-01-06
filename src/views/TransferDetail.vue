<template>
    <div class="transfer_container">
        <loading v-show="isShowLoading.value"></loading>
        <div class="transfer_detail_content_wrap">
            <div class="transfer_detail_top_content"></div>
            <div class="transfer_Details_content">
                <div class="transfer_out_content">
                    <transfer-details-card :title="'IBC Out Details'"
                                           :details="transferOutDetails"></transfer-details-card>
                </div>
                <div class="transfer_in_content">
                    <transfer-details-card :title="'IBC In Details'"
                                           :details="transferInDetails"></transfer-details-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getTxDetailsByTxHash} from "../service/api";
import {useRoute} from 'vue-router';
import Loading from "../components/Loading";
import TransferDetailsCard from "../components/TransferDetailsCard";
import {reactive, watch,onMounted} from 'vue';

export default {
    name: "TransferDetail",
    components: {TransferDetailsCard, Loading},
    setup() {
        const router = useRoute();
        const isShowLoading = reactive({
            value: true
        })
        const transferOutDetails = reactive([
            {
                label: 'MsgType:',
                value: 'IBC Transfer Out',
            },
            {
                label: 'Chain ID:',
                value: '',
                dataKey: 'sc_chain_id',
            },
            {
                label: 'Port:',
                value: '',
                dataKey: 'sc_port',
            },
            {
                label: 'Channel ID:',
                value: '',
                dataKey: 'sc_channel',
            },
            {
                label: 'Send Token:',
                value: '',
                dataKey: 'sc_tx_info.msg_amount',
            },
            {
                label: 'IBC Out Address:',
                value: '',
                dataKey: '',
            },
            {
                label: 'Block:',
                value: '',
                dataKey: 'sc_tx_info.height',
            },
            {
                label: 'Status:',
                value: '',
                dataKey: 'sc_tx_info.status',
            },
            {
                label: 'Timestamp:',
                value: '',
                dataKey: 'tx_time',
            },
            {
                label: 'Fee:',
                value: '',
                dataKey: 'sc_tx_info.fee',
            },
            {
                label: 'Signer:',
                value: '',
                dataKey: '',
            },
            {
                label: 'Connection:',
                value: '',
                dataKey: '',
                isExpand: true,
            },
            {
                label: 'Time Out Height:',
                value: '',
                dataKey: 'sc_tx_info.msg.msg.timeout_height',
                isExpand: true,
            },
            {
                label: 'Time Out Timestamp:',
                value: '',
                dataKey: 'sc_tx_info.msg.msg.timeout_timestamp',
                isExpand: true,
            }
        ])
        const transferInDetails = reactive([
            {
                label: 'MsgType:',
                value: 'IBC Transfer In',
            },
            {
                label: 'Chain ID:',
                value: '',
                dataKey: 'dc_chain_id',
            },
            {
                label: 'Port:',
                value: '',
                dataKey: 'dc_port',
            },
            {
                label: 'Channel ID:',
                value: '',
                dataKey: 'dc_channel',
            },
            {
                label: 'Received Token:',
                value: '',
                dataKey: '',
            },
            {
                label: 'IBC In Address:',
                value: '',
                dataKey: '',
            },
            {
                label: 'Block:',
                value: '',
                dataKey: 'dc_tx_info.height',
            },
            {
                label: 'Status:',
                value: '',
                dataKey: 'dc_tx_info.status',
            },
            {
                label: 'Timestamp:',
                value: '',
                dataKey: 'dc_tx_info.time',
            },
            {
                label: 'Fee:',
                value: '',
                dataKey: 'dc_tx_info.fee',
            },
            {
                label: 'Signer:',
                value: '',
                dataKey: '',
            },
            {
                label: 'Connection:',
                value: '',
                dataKey: '',
                isExpand: true,
            },
            {
                label: 'Packet Ack:',
                value: '',
                dataKey: '',
                isExpand: true,
            },
            {
                label: 'Proof Height:',
                value: '',
                dataKey: 'dc_tx_info.msg.msg.proof_height',
                isExpand: true,
            }
        ])
        watch(router, (newValue, oldValue) => {
            if(newValue?.query?.hash){
                getTxDetails(newValue.query.hash)
            }
        })
        const getTxDetails = (txHash) => {
            isShowLoading.value = true
            getTxDetailsByTxHash(router.query.hash).then(res => {
                isShowLoading.value = false
                transferOutDetails.forEach(item => {
                    if (item?.dataKey?.includes('.')) {
                        const keys = item.dataKey.split('.')
                        if (keys?.length) {
                            let result = res
                            keys.forEach(key => {
                                result = result[key]
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
                                result = result[key] || ''
                                item.value = result

                            })
                        }
                    } else {
                        if (item.dataKey) {
                            item.value = res[item.dataKey]
                        }
                    }
                })
            }).catch(error => {
                isShowLoading.value = false
                console.error(error)
            })
        }
        if (router?.query?.hash) {
            getTxDetails(router?.query?.hash)
        }
        return {
            transferOutDetails,
            transferInDetails,
            isShowLoading
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

        .transfer_detail_top_content {
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
