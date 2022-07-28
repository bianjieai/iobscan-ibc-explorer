import { chainMenus, anchorsDatas } from '../../../constants';
import {ref, reactive, onMounted} from 'vue';

export const useMenus = () => {
    const menus = reactive(chainMenus);
    const currentMenu = ref([menus[0].value]);
    return {
        menus,
        currentMenu
    }
}
export const useInterfaceActive = (emits) => {
    const onSelectedMenu = ({key}) => {
        emits('onMenuSelected', key);
    };
    const clickListItem = ({type, value}) => {
        emits('clickItem', {type, value});
    };
    return {
        onSelectedMenu,
        clickListItem
    }
}

export const useAnchors = () => {
    const anchors = reactive(anchorsDatas);
    const listRef = ref(null);
    const findClassName = (chainName) => {
        const chainQuery = chainName.substr(0, 1).toUpperCase();
        let className = '';
        try {
            anchors.forEach((anchor) => {
                className = anchor.collection.indexOf(chainQuery) !== -1 ? anchor.title : '#';
                if (anchor.collection.indexOf(chainQuery) !== -1) {
                    // todo shan => listRef.value.$el 中没有 scrollTop 属性，需考虑换个方式
                    listRef.value.$el.scrollTop = 0
                    throw new Error('find className');
                }
            });
        } catch (e) {
            // console.log(e.message);
        }
        return className;
    };
    
    const onChangeAnchor = (title) => {
        const findItem = document.getElementsByClassName(title.replace('#', ''))[0];
        if (findItem) {
            // todo shan => listRef.value.$el 中没有 scrollTop 属性，需考虑换个方式
            listRef.value.$el.scrollTop = findItem.parentElement.offsetTop;
        }
    };
    return {
        anchors,
        findClassName,
        onChangeAnchor
    }
}

export const useGetBindElement = () => {
    const getBindElement = ref(null);
    onMounted(() => {
        getBindElement.value = () => document.querySelector('#card_list');
    });
    return {
        getBindElement,
    }
}






