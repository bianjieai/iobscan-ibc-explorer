<template>
    <div class="details_content">
        <div class="details_title">{{title}}</div>
        <ul class="details_item_content">
            <li class="details_item" v-for="(item,index) in details" :key="index">
                <span class="details_item_label">{{item.label}}</span>
                <span class="details_item_value">{{item.value}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "TransferDetailsCard",
    props:{
        title:{
            type:String,
            default:''
        },
        details:{
            type:Array,
            default: []
        }
    }
}
</script>

<style scoped lang="scss">
    .details_content{
        width: 100%;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        margin-bottom: 100px;
        .details_title{
            border-bottom: 1px solid  rgba(151, 151, 151, 0.2);
            padding: 16px 0 16px 24px;
            font-size: 16px;
            line-height: 16px;
            font-weight: 400;
            text-align: left;
        }
        .details_item_content{
            list-style: none;
            box-sizing: border-box;
            margin: 0 24px;
            text-align: left;
            padding-top: 15px;
            .details_item{
                padding: 14px 0;

                .details_item_label{
                    display: inline-block;
                    width: 153px;
                    margin-right: 35px;
                    font-size: 14px;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 0.65);
                    line-height: 14px;
                }
                .details_item_value{
                    font-size: 14px;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 1);
                    line-height: 14px;
                }
            }
        }
    }
</style>
