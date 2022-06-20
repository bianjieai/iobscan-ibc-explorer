<template>
    <div class="chainlist">
        <a-menu class="chainlist_menu" v-model:selectedKeys="currentMenu" mode="horizontal" @select="onSelectedMenu">
            <a-menu-item class="chainlist_item" v-for="item of menus" :key="item.value">
                {{ item.label }}
            </a-menu-item>
        </a-menu>
        <div class="chainlist_bottom">
            <!-- <a-list
                class="card_list ibc_scrollbar"
                id="card_keyoflist"
                v-show="chainList[currentMenu] && chainList[currentMenu].length"
                :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 }"
                :data-source="chainList[currentMenu]"
                ref="listRef"
            >
                <template #renderItem="{ item }">
                    <a-list-item
                        :class="findClassName(item.chain_name)"
                        :id="`list${findClassName(item.chain_name)}`"
                        class="ibc_selected_border card_list_item"
                    >
                        <router-link :to="`/chains/details?chain_id=${item.chain_id}`">
                            <a-card class="menu_card">
                                <img
                                    class="card_img"
                                    :src="item.icon ? item.icon : require('../assets/placeHoder.png')"
                                />
                                <p class="card_title">{{ item.chain_name }}</p>
                                <p class="card_value">{{ item.chain_id }}</p>
                            </a-card>
                        </router-link>
                    </a-list-item>
                </template>
            </a-list> -->

            <!-- <a-anchor
                class="list_anchor"
                :affix="false"
                :getContainer="getBindElement"
                @change="onChangeAnchor"
                v-show="chainList[currentMenu] && chainList[currentMenu].length"
            >
                <a-anchor-link
                    @click.prevent.stop="() => {}"
                    class="list_anchor_item"
                    v-for="item of anchors"
                    :key="item.title"
                    :href="`#list${item.title}`"
                >
                    <template #title>
                        <div class="custom_title">
                            <span class="custom_title_left">{{ item.title.split("")[0] }}</span>
                            <span>{{ item.title.split("")[1] }}</span>
                            <span class="custom_title_right">{{ item.title.split("")[2] }}</span>
                        </div>
                    </template>
                </a-anchor-link>
            </a-anchor> -->

            <!-- <no-datas
                class="card_list"
                v-if="!chainList[currentMenu] || !chainList[currentMenu].length"
            /> -->
        </div>
    </div>
</template>

<script setup>
import {ref, reactive, toRefs} from 'vue';
import { chainMenus } from '../constants';

const menus = reactive(chainMenus);
const currentMenu = ref([menus[0].value]);
const props = defineProps({
    chainList: Object
})
const chainList = toRefs(props.chainList);
</script>

<style lang="less" scoped>

</style>