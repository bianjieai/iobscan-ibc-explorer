<template>
    <div class="copy_component_content" id="tag_copy" :data-clipboard-text="copyText" @click="handleCopy($event,copyText)">
        <span v-show="!isShowCopied" class="copied iconfont icon-fuzhi"></span>
        <span v-show="isShowCopied" class="copied iconfont icon-fuzhichenggong1"> <span class="text">Copied</span></span>
    </div>
</template>

<script>
import Clipboard from 'clipboard'
import {ref} from 'vue'
export default {
    name: "CopyComponent",
    props:{
        copyText :{
            type: String
        }
    },
    setup(){
        let isShowCopied = ref(false)
        let copyTimer = ref(null)
        const handleCopy = () => {
            clearTimeout(copyTimer)
            if(isShowCopied.value) return
            const clipboard = new Clipboard('#tag_copy')
            clipboard.on('success', e => {
                // 释放内存
                isShowCopied.value = true
                clipboard.destroy()
                copyTimer.value = setTimeout(() => {
                    isShowCopied.value = false
                },3000)
            })
            clipboard.on('error', e => {
                // 不支持复制
                // 释放内存
                isShowCopied.value = false
                clipboard.destroy()
            })
        }
        return {
            handleCopy,
            isShowCopied
        }
    }


}
</script>

<style scoped lang="scss">
    .copy_component_content{
        margin-left: 7px;
        display: flex;
        align-items: center;
        cursor: url("../assets/mouse/shiftlight_mouse.png"),default;
        user-select: none;
        .copied{
            font-size: 14px;
            color: rgba(151, 151, 151, 1);
            cursor: url("../assets/mouse/shiftlight_mouse.png"),default;
            padding-bottom: 2px;
            .text{
                margin-left: 7px;
                color:rgba(151, 151, 151, 1);
                font-size: 14px;
                font-weight: 400;
            }
        }
    }
</style>
