<template>
    <a-config-provider>
        <template #renderEmpty>
            <no-datas/>
        </template>
        <a-layout class="layout"  ref="layout">
            <a-layout-header class="header" v-show="$store.state.isShowHeader">
                <a-row class="header__content" type="flex">
                    <a-col flex="160px" class="col__layout">
                        <div class="logo" @click="onClickLogo">
                            <img class="logo__icon" src="./assets/HeaderIcon.png" alt="logo"/>
                            <img class="logo__text" src="./assets/iobscan.png" alt="title"/>
                        </div>
                    </a-col>
                    <a-col flex="auto">
                        <navigation
                            :menus="headerMenus"
                            @clickMenu="clickMenu"
                            :currentMenu="currentMenu.value"
                        />
                    </a-col>
                    <a-col flex="auto" class="col__layout">
                        <!-- disabled can remove if have tx details -->
                        <header-input @pressedEnter="onPressEnter" disabled/>
                        <a href="https://www.iobscan.io/#/" target="_blank" rel="noreferrer noopener">
                            <img
                                class="header__input__icon"
                                :src="require('./assets/ioblink.png')"
                                alt="icon"
                            />
                        </a>
                    </a-col>
                </a-row>
            </a-layout-header>

            <a-layout-content class="content" :class="isShowBackground.value ? 'show__background' : ''">
                <router-view/>
            </a-layout-content>
            <a-layout-footer  v-show="$store.state.isShowFooter" class="footer">
                <ibc-footer/>
            </a-layout-footer>
        </a-layout>
    </a-config-provider>
</template>

<script>
import {
    reactive, computed, watch, ref, onMounted
} from 'vue';
import {useStore} from 'vuex';
import {useRouter, useRoute} from 'vue-router';
import {menus} from './constant';
import Navigation from './components/Navigation.vue';
import HeaderInput from './components/HeaderInput.vue';
import IbcFooter from './components/IbcFooter.vue';
import NoDatas from './components/NoDatas.vue';

import {
    GET_IBCSTATISTICS,
    GET_IBCDENOMS,
    GET_IBCBASEDENOMS,
    GET_IBCCHAINS,
    GET_IBCCONFIGS,
} from './store/action-types';
import config from '../config/config.json'
export default {
    components: {
        Navigation,
        HeaderInput,
        IbcFooter,
        NoDatas,
    },
    setup() {
        const script = document.createElement('script');
        script.src = `https://s4.cnzz.com/z_stat.php?id=${config.UMENG_ID}&web_id=${config.UMENG_WEB_ID}`;
        script.language = 'JavaScript';
        document.body.appendChild(script);
        const router = useRouter();
        const store = useStore();
        const headerMenus = reactive(menus);
        const onClickLogo = () => {
            router.push({
                name: 'Home',
            });
        };

        const iobscanUrl = computed(() => store.state.configs?.iobscan);
        const onClickIcon = () => {
            if (iobscanUrl.value) {
                window.open(iobscanUrl.value);
            } else {
                store.dispatch(GET_IBCCONFIGS).then(() => {
                    window.open(iobscanUrl.value);
                });
            }
        };

        const isShowBackground = reactive({value: false});
        const route = useRoute();
        watch(
            () => route.path,
            (to) => {
                document.body.scrollTop = 0
                // firefox
                document.documentElement.scrollTop = 0
                store.commit('isShowHeader',true)
                store.commit('isShowFooter',true)
                if(to === '/404' || to === '/500'){
                    store.commit('isShowHeader',false)
                    store.commit('isShowFooter',false)
                }
                isShowBackground.value = to !== '/home';
            },
        );

        const onPressEnter = (val) => {
            console.log(val);
        };
        const currentMenu = reactive({value: []});
        watch(
            () => route.path,
            (to) => {
                if(to?.toString().includes('home')){
                    currentMenu.value = ['Home'];
                }else if(to?.toString().includes('transfers')){
                    currentMenu.value = ['Transfers'];
                }else if(to?.toString().includes('tokens')){
                    currentMenu.value = ['Tokens'];
                }else if(to?.toString().includes('network')){
                    currentMenu.value = ['Network'];
                }else if(to?.toString().includes('channels')){
                    currentMenu.value = ['Channels'];
                }else if(to?.toString().includes('relayers')){
                    currentMenu.value = ['Relayers'];
                }


                /*switch (to) {
                    case '/home':
                        currentMenu.value = ['Home'];
                        break;
                    case '/transfers':
                        currentMenu.value = ['Transfers'];
                        break;
                    case '/tokens':
                        currentMenu.value = ['Tokens'];
                        break;
                    case '/network':
                        currentMenu.value = ['Network'];
                        break;
                    case '/channels':
                        currentMenu.value = ['Channels'];
                        break;
                    case '/relayers':
                        currentMenu.value = ['Relayers'];
                        break;
                    default:
                        break;
                }*/
            },
        );
        const clickMenu = (val) => {
            console.log(val)
            switch (val) {
                case 'Home':
                    currentMenu.value = ['Home'];
                    router.push({
                        name: 'Home',
                    });
                    break;
                case 'Transfers':
                    currentMenu.value = ['Transfers'];
                    router.push({
                        name: 'Transfers',
                    });
                    break;
                case 'Tokens':
                    currentMenu.value = ['Tokens'];
                    router.push({
                        name: 'Tokens',
                    });
                    break;
                case 'Network':
                    currentMenu.value = ['NetWork'];
                    router.push({
                        name: 'NetWork',
                    });
                    break;
                case 'Channels':
                    currentMenu.value = ['Channels'];
                    router.push({
                        name: 'Channels',
                    });
                    break;
                case 'Relayers':
                    currentMenu.value = ['Relayers'];
                    router.push({
                        name: 'Relayers',
                    });
                    break;
                default:
                    break;
            }
        };
        let layout = ref(null)
        const setTest = () => {
            setInterval(() => {
                const removeStarContainerDom = document.getElementsByClassName('star_container')
                if(removeStarContainerDom?.length !== 0){
                    layout.value.$el.removeChild(removeStarContainerDom[0])
                }
                const starContainerDom = document.createElement('div')
                starContainerDom.className = 'star_container'
                layout.value.$el.appendChild(starContainerDom)
                const windowClientWidth  = window.document.documentElement.clientWidth - 20
                for (let i= 0; i < 20; i++) {
                    const createDom = document.createElement('div')
                    createDom.className = 'star_content'
                    let leftNumber = `${parseInt(Math.random() * windowClientWidth)} px`
                    createDom.style.left = `${parseInt(Math.random() * windowClientWidth)}px`
                    createDom.style.top = `${parseInt(Math.random() * 320)}px`
                    const appendChildStartContainerDom = document.getElementsByClassName('star_container')
                    appendChildStartContainerDom[0].appendChild(createDom)

                }
            },3100)
        };
        onMounted(()=> {
            setTest()
        })
        return {
            headerMenus,
            onClickLogo,
            onClickIcon,
            onPressEnter,
            currentMenu,
            clickMenu,
            layout,
            isShowBackground,
        };
    },
};
</script>

<style lang="scss">
@import "./style/index.css";
@import "./style/mixin.scss";
@import "./style/variable.scss";
a{
    cursor: url("./assets/mouse/shiftlight_mouse.png"),default !important;
}
.star_content{
    width: 2px;
    height: 2px;
    box-shadow: 0 0 10px 0 rgba(229, 232, 153, 0.8);
    background: #FEFFA6;
    position: absolute;
    border-radius: 1px;
    animation: flicker 3s ease-in-out infinite;
}
.ant-tooltip{
    max-width: 400px !important;
    .ant-tooltip-content{
        .ant-tooltip-arrow{
            .ant-tooltip-arrow-content{
                background: rgba(255,255,255,1) !important;
            }
        }
        .ant-tooltip-inner{

            background: rgba(255,255,255,1) !important;
            color: rgba(0, 0, 0, 0.65);
        }
    }
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    min-height: 100Vh;
    min-width: 1200px;
    overflow-x: auto;
}

.layout {
    width: 100%;
    background-image: url("./assets/Summer_bg.png");
    background-repeat: no-repeat;
    background-size: 1920px 396px;
    background-position: top center;
    background-color: #F5F7FC;
    flex: 1;
    position: relative;

    .star_container{
        position: absolute;
        left: 0;
        top:0;
        z-index: 1;
        width: 100%;
        min-height: 100%;
        flex: 1;
        background: transparent;
    }
    & .header {
        width: 100%;
        @include flex(column, nowrap, center, center);
        text-align: center;
        height: 80px;
        background-color: transparent;
        z-index: 10;
        //position: fixed;
        //top: 0;
        //left: 0;
        //z-index: 100;
        & .header__content {
            width: 100%;
            max-width: 1200px;
            height: 100%;
            @include flex(row, nowrap, center, center);
    }

        .logo {
            // height: 30px;
            cursor: url("./assets/mouse/shiftlight_mouse.png"),default !important;

            .logo__icon {
                width: 34px;
                margin-right: 10px;
            }

            .logo__text {
                width: 100px;
            }
        }

        &__input__icon {
            display: inline-block;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            margin-left: 24px;
            cursor: url("./assets/mouse/shiftlight_mouse.png"),default !important;
        }
    }

    & .content {
        @include flex(column, nowrap, flex-start, center);
        flex: 1;
        z-index: 10;
        .home{
            margin-bottom: 80px;
        }
    }

    & .footer {
        @include flex(column, nowrap, flex-start, center);
        padding: 0;
        width: 100%;
        background-color: #eef0f6;
        z-index: 10;
        //position: absolute;
        //bottom: 0;
    }
}
.ant-btn{
    cursor: url("./assets/mouse/shiftlight_mouse.png"),default !important;
}
.ant-select{
    cursor: url("./assets/mouse/shiftlight_mouse.png"),default !important;
}
.ant-select-item{
    cursor: url("./assets/mouse/shiftlight_mouse.png"),default !important;
}
.ant-calendar-date{
    cursor: url("./assets/mouse/shiftlight_mouse.png"),default !important;
}
.col__layout {
    @include flex(row, nowrap, flex-start, center);
}

.show__background {
    background-color: #F5F7FC !important;
    // background-color: transparent;
}

@media screen and (max-width: 1920px) {
}

a {
    color: rgba(0, 0, 0, 0.7);

    &:hover {
        color: #3d50ff
    }
}
@keyframes flicker {
    0% {
        opacity: 0;
        transform: scale(1);
    }
    50% {
        opacity: 1;
        transform: scale(5);
    }
    100% {
        opacity: 0;
        transform: scale(1);
    }
}
</style>
