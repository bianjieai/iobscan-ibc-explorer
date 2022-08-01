<template>
    <div class="transfer">
        <div class="transfer__detail">
            <div class="transfer__detail__top_content">
                <div class="transfer__detail_title">
                    <span class="detail_title">Transfer Details</span>
                    <span v-show="ibcTxStatus === 1" class="success_icon">
                        <i class="iconfont icon-chenggong"></i>
                        Success
                    </span>
                    <span v-show="ibcTxStatus === 2 || ibcTxStatus === 4" class="failed_icon">
                        <i class="iconfont icon-shibai"></i>
                        Failed
                    </span>
                    <span v-show="ibcTxStatus === 3" class="processing_icon">
                        <i class="iconfont icon-dengdai"></i>
                        Processing
                    </span>
                </div>
                <div class="transfer__ibc_out_tx_hash">
                    <span class="transfer__ibc_out_tx_hash__label">
                        <i v-show="outTxStatus === 'default'" class="iconfont icon-address1"></i>
                        <i
                            v-show="outTxStatus === 1"
                            style="color: rgba(0, 200, 83, 1)"
                            class="iconfont icon-address1"
                        ></i>
                        <i
                            v-show="outTxStatus === 0"
                            style="color: rgba(255, 90, 90, 1)"
                            class="iconfont icon-address1"
                        ></i>
                        From TxHash:
                    </span>
                    <span class="transfer__ibc_out_tx_hash__value">
                        <span>{{ ibcTransferOutTxHash }} </span>
                        <copy-component
                            v-show="ibcTransferOutTxHash !== '--'"
                            :copy-text="ibcTransferOutTxHash"
                        >
                        </copy-component>
                    </span>
                </div>
                <div class="transfer__arrows_icon">
                    <i
                        v-show="ibcTxStatus === 1"
                        style="color: rgba(0, 200, 83, 1)"
                        class="iconfont_style iconfont icon-zhuangtai"
                    ></i>
                    <i
                        v-show="ibcTxStatus === 2 || ibcTxStatus === 4"
                        style="color: rgba(255, 90, 90, 1)"
                        class="iconfont_style iconfont icon-zhuangtai"
                    ></i>
                    <i
                        v-show="ibcTxStatus === 3"
                        style="color: rgba(255, 196, 0, 1)"
                        class="iconfont_style iconfont icon-zhuangtai"
                    ></i>
                    <i
                        v-show="ibcTxStatus === 'default'"
                        style="color: rgba(0, 0, 0, 0.35)"
                        class="iconfont_style iconfont icon-zhuangtai"
                    ></i>
                </div>
                <div class="transfer__ibc_in_tx_hash">
                    <span class="transfer__ibc_in_tx_hash__label">
                        <i v-show="inTxStatus === 'default'" class="iconfont icon-address1"></i>
                        <i
                            v-show="inTxStatus === 1"
                            style="color: rgba(0, 200, 83, 1)"
                            class="iconfont icon-address1"
                        ></i>
                        <i
                            v-show="inTxStatus === 0"
                            style="color: rgba(255, 90, 90, 1)"
                            class="iconfont icon-address1"
                        ></i>
                        To TxHash:
                    </span>
                    <span class="transfer__ibc_in_tx_hash__value">
                        <span>{{ ibcTransferInTxHash }}</span>
                        <copy-component
                            v-show="ibcTransferInTxHash !== '--'"
                            :copy-text="ibcTransferInTxHash"
                        >
                        </copy-component>
                    </span>
                </div>
                <div class="transfer__sequence">
                    <span class="transfer__sequence__label">
                        <i class="iconfont icon-Sequence"></i>
                        Sequence:
                    </span>
                    <span class="transfer__sequence__value">{{ sequence }}</span>
                </div>
            </div>
            <div class="transfer__detail__content">
                <div class="transfer__out_content">
                    <transfer-details-card
                        :title="'IBC Out Details'"
                        :details="transferOutDetails"
                        :expand-details="transferOutExpandDetails"
                        :base-denom="baseDenom"
                        :chain-id="scChainId"
                        :sc-chain-id="scChainId"
                        :dc-chain-id="dcChainId"
                    >
                    </transfer-details-card>
                </div>
                <div class="transfer__in_content">
                    <transfer-details-card
                        :title="'IBC In Details'"
                        :details="transferInDetails"
                        :expand-details="transferInExpandDetails"
                        :base-denom="baseDenom"
                        :chain-id="dcChainId"
                        :sc-chain-id="scChainId"
                        :dc-chain-id="dcChainId"
                    ></transfer-details-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import TransferDetailsCard from '../components/TransferDetailsCard.vue';
    import { useTransfersDetailsInfo } from '../composable';

    const {
        ibcTransferOutTxHash,
        ibcTransferInTxHash,
        ibcTxStatus,
        outTxStatus,
        inTxStatus,
        sequence,
        baseDenom,
        transferOutDetails,
        transferOutExpandDetails,
        transferInDetails,
        transferInExpandDetails,
        scChainId,
        dcChainId
    } = useTransfersDetailsInfo();
</script>

<style scoped lang="less">
    .transfer {
        flex: 1;
        display: flex;
        width: 100%;
        position: relative;
        background: #f5f7fc;

        &__detail {
            box-sizing: content-box;
            margin: 0 auto;
            padding: 48px 32px 154px;
            width: 100%;
            max-width: 1200px;
            text-align: left;

            &__top_content {
            }

            &__title {
                .detail_title {
                    font-size: 20px;
                    font-weight: 400;
                    color: #000000;
                    line-height: 20px;
                    position: relative;

                    &:after {
                        content: '';
                        background: linear-gradient(
                            90deg,
                            rgba(112, 136, 255, 0) 0%,
                            rgba(61, 80, 255, 0.15) 100%
                        );
                        width: 100%;
                        height: 12px;
                        border-radius: 6px;
                        position: absolute;
                        left: 5px;
                        bottom: 0px;
                    }
                }

                .success_icon {
                    padding: 6px 7px;
                    background: rgba(0, 200, 83, 0.15);
                    border-radius: 4px;
                    color: rgba(0, 200, 83, 1);

                    .iconfont {
                        color: rgba(0, 200, 83, 1);
                    }

                    margin-left: 17px;
                }

                .failed_icon {
                    padding: 6px 7px;
                    background: rgba(255, 90, 90, 0.15);
                    border-radius: 4px;
                    color: rgba(255, 90, 90, 1);

                    .iconfont {
                        color: rgba(255, 90, 90, 1);
                    }

                    margin-left: 17px;
                }

                .processing_icon {
                    padding: 6px 7px;
                    background: rgba(255, 196, 0, 0.15);
                    border-radius: 4px;
                    color: rgba(255, 196, 0, 1);

                    .iconfont {
                        color: rgba(255, 196, 0, 1);
                    }

                    margin-left: 17px;
                }
            }

            &__content {
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-column-gap: 24px;
                width: 100%;
            }
        }

        &__out_content {
            flex: 1;
        }

        &__in_content {
            flex: 1;
        }

        &__ibc_out_tx_hash {
            display: flex;
            margin-top: 23px;

            &__label {
                display: inline-block;
                font-size: var(--bj-font-size-normal);
                font-weight: 400;
                color: rgba(0, 0, 0, 0.35);
                line-height: 20px;
                width: 140px;

                i {
                    position: relative;
                    top: 1px;
                    left: 0;
                }
            }

            &__value {
                flex: 1;
                width: 100%;
                font-size: var(--bj-font-size-normal);
                font-weight: lighter;
                color: rgba(0, 0, 0, 0.35);
                line-height: 20px;
                word-break: break-word;
            }
        }

        &__arrows_icon {
            height: 20px;
            line-height: 20px;
            display: flex;
            align-items: center;

            .iconfont_style {
                display: inline-block;
                transform: rotate(90deg);
                color: rgba(0, 0, 0, 0.35);
            }
        }

        &__ibc_in_tx_hash {
            display: flex;

            &__label {
                display: inline-block;
                font-size: var(--bj-font-size-normal);
                font-weight: 400;
                color: rgba(0, 0, 0, 0.35);
                line-height: 20px;
                width: 140px;

                i {
                    position: relative;
                    top: 1px;
                    left: 0;
                }
            }

            &__value {
                flex: 1;
                font-size: var(--bj-font-size-normal);
                font-weight: 400;
                color: rgba(0, 0, 0, 0.35);
                line-height: 20px;
                word-break: break-word;
            }
        }

        &__sequence {
            display: flex;
            margin-top: 18px;

            &__label {
                display: inline-block;
                font-size: var(--bj-font-size-normal);
                font-weight: 400;
                color: rgba(0, 0, 0, 0.35);
                line-height: 20px;
                width: 140px;

                i {
                    font-size: var(--bj-font-size-normal);
                }
            }

            &__value {
                flex: 1;
                font-size: var(--bj-font-size-normal);
                font-weight: 400;
                color: rgba(0, 0, 0, 0.35);
                line-height: 20px;
                word-break: break-word;
            }
        }
    }

    @media screen and (max-width: 1000px) {
        .transfer {
            &__detail {
                padding: 24px 16px 80px;

                &__top_content {
                }

                &__title {
                    .detail_title {
                        &:after {
                        }
                    }

                    .success_icon {
                        .iconfont {
                        }
                    }

                    .failed_icon {
                        .iconfont {
                        }
                    }

                    .processing_icon {
                        .iconfont {
                        }
                    }
                }

                &__content {
                    .flex(column, nowrap, flex-start, center);
                }
            }

            &__out_content {
                width: 100%;
            }

            &__in_content {
                margin-top: 16px;
                width: 100%;
            }

            &__ibc_out_tx_hash {
                &__label {
                    i {
                    }
                }

                &__value {
                }
            }

            &__arrows_icon {
                .iconfont_style {
                }
            }

            &__ibc_in_tx_hash {
                &__label {
                    i {
                    }
                }

                &__value {
                }
            }

            &__sequence {
                &__label {
                    i {
                    }
                }

                &__value {
                }
            }
        }
    }

    @media screen and (max-width: 800px) {
        .transfer {
            &__detail {
                &__top_content {
                }

                &__title {
                    .detail_title {
                        &:after {
                        }
                    }

                    .success_icon {
                        .iconfont {
                        }
                    }

                    .failed_icon {
                        .iconfont {
                        }
                    }

                    .processing_icon {
                        .iconfont {
                        }
                    }
                }

                &__content {
                }
            }

            &__out_content {
            }

            &__in_content {
            }

            &__ibc_out_tx_hash {
                &__label {
                    width: 128px;

                    i {
                        display: none;
                    }
                }

                &__value {
                }
            }

            &__arrows_icon {
                display: none;

                .iconfont_style {
                }
            }

            &__ibc_in_tx_hash {
                margin-top: 12px;

                &__label {
                    width: 128px;

                    i {
                        display: none;
                    }
                }

                &__value {
                }
            }

            &__sequence {
                margin-top: 12px;

                &__label {
                    width: 128px;

                    i {
                        display: none;
                    }
                }

                &__value {
                }
            }
        }
    }

    @media screen and (max-width: 530px) {
        .transfer {
            &__detail {
                &__top_content {
                }

                &__title {
                    .detail_title {
                        &:after {
                        }
                    }

                    .success_icon {
                        .iconfont {
                        }
                    }

                    .failed_icon {
                        .iconfont {
                        }
                    }

                    .processing_icon {
                        .iconfont {
                        }
                    }
                }

                &__content {
                }
            }

            &__out_content {
            }

            &__in_content {
            }

            &__ibc_out_tx_hash {
                .flex(column, nowrap, flex-start, flex-start);

                &_label {
                    i {
                    }
                }

                &_value {
                    margin-top: 12px;
                }
            }

            &__arrows_icon {
                display: none;

                .iconfont_style {
                }
            }

            &__ibc_in_tx_hash {
                .flex(column, nowrap, flex-start, flex-start);
                margin-top: 12px;

                &__label {
                    i {
                    }
                }

                &__value {
                }
            }

            &__sequence {
                &__label {
                    width: 88px;

                    i {
                    }
                }

                &__value {
                }
            }
        }
    }
</style>
