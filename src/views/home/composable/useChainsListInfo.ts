import { chainMenus, anchorsDatas } from '@/constants';

export const useMenus = () => {
    const menus = reactive(chainMenus);
    const currentMenu = ref([menus[0].value]);
    return {
        menus,
        currentMenu
    };
};
export const useInterfaceActive = (emits: any) => {
    const onSelectedMenu = ({ key }: { key: any }) => {
        emits('onMenuSelected', key);
    };
    const clickListItem = ({ type, value }: { type: any; value: any }) => {
        emits('clickItem', { type, value });
    };
    return {
        onSelectedMenu,
        clickListItem
    };
};

export const useAnchors = () => {
    const anchors = reactive(anchorsDatas);
    const listRef = ref();
    const findClassName = (chainName: string) => {
        const chainQuery = chainName[0].toUpperCase();
        let className = '';
        try {
            anchors.forEach((anchor) => {
                className = anchor.collection.indexOf(chainQuery) !== -1 ? anchor.title : '#';
                if (anchor.collection.indexOf(chainQuery) !== -1) {
                    listRef.value.$el.scrollTop = 0;
                    throw new Error('find className');
                }
            });
        } catch (e) {
            // console.log(e);
        }
        return className;
    };

    const onChangeAnchor = (title: string) => {
        const findItem = document.getElementsByClassName(title.replace('#', ''))[0];
        if (findItem) {
            listRef.value.$el.scrollTop = (findItem as any).parentElement.offsetTop;
        }
    };
    return {
        anchors,
        listRef,
        findClassName,
        onChangeAnchor
    };
};

export const useGetBindElement = () => {
    const getBindElement = ref<Function>();
    onMounted(() => {
        getBindElement.value = () => document.querySelector('#card_list');
    });
    return {
        getBindElement
    };
};
