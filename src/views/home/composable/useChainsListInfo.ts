import { Ref, ComputedRef } from 'vue';
import { IIbcChains, IIbcchain, TIbcChainsKeys } from '@/types/interface/index.interface';
import { ANCHORS_DATAS, CHAINS_MENUS, CURRENT_MENU_TYPE } from '@/constants';

export const useAnchors = (chainList: Ref<IIbcChains>, emits: any) => {
    const menus = reactive(CHAINS_MENUS);
    const currentMenu = ref<CURRENT_MENU_TYPE[]>([menus[0].value as CURRENT_MENU_TYPE]);
    const scrollListRef = ref();
    const linkListRef = ref();
    const lock = ref(false);
    const anchors = reactive(ANCHORS_DATAS);
    let once = true;

    const highlightedLabel = (label: string) => {
        const queryDomId = `a-link${label}`;
        const labelContainerDom = linkListRef.value;
        if (labelContainerDom) {
            const children = labelContainerDom.children;
            for (let i = 0; i < children.length; i++) {
                const element = children[i];
                element.id === queryDomId
                    ? element.classList.add('self_link_active')
                    : element.classList.remove('self_link_active');
            }
        } else {
            console.log('labelContainerDom Dom no render');
        }
    };

    const findClassName = (prettyName: string) => {
        const chainQuery = prettyName[0].toUpperCase();
        const findAnchor = anchors.find((anchor) => anchor.collection.includes(chainQuery));
        const className = findAnchor?.title || '#';
        // 初始值,第一次选中第一个chain 对应的标签
        if (once) {
            once = false;
            nextTick(() => {
                highlightedLabel(className);
            });
        }
        return className;
    };

    // 点击高亮标签,滚动到合适的位置
    const onClickAnchor = (label: string) => {
        highlightedLabel(label);
        const scrollDom = scrollListRef.value.$el;
        if (!scrollDom) return;
        const findItem = document.getElementsByClassName(label)[0];
        if (findItem) {
            scrollDom.scrollTop = (findItem as any).parentElement.offsetTop;
            lock.value = true;
        } else {
            scrollDom.scrollTop = scrollDom.scrollHeight - scrollDom.clientHeight;
            lock.value = true;
        }
    };

    const sortChainList: ComputedRef<IIbcChains> = computed<IIbcChains>(() => {
        const res: IIbcChains = {
            all: [],
            active: [],
            inactive: []
        };

        Object.keys(chainList.value).forEach((key) => {
            res[key as TIbcChainsKeys] = chainList.value[key as TIbcChainsKeys]
                .slice()
                .sort((a: IIbcchain, b: IIbcchain) => {
                    return a.pretty_name.toLowerCase() < b.pretty_name.toLowerCase()
                        ? -1
                        : a.pretty_name.toLowerCase() > b.pretty_name.toLowerCase()
                        ? 1
                        : 0;
                });
        });

        return res;
    });

    onMounted(() => {
        const scrollDom = scrollListRef.value.$el;
        scrollDom.onscroll = () => {
            if (lock.value) {
                lock.value = false;
                return;
            }
            // 通过滚动去获取当前高亮的标签
            const containerDom: HTMLDivElement | null =
                document.querySelector('#card_list .ant-row');
            if (containerDom) {
                const cardDomList = Array.from(containerDom.children) as HTMLDivElement[];
                const scrollTop: number = scrollDom.scrollTop;
                const findCard = cardDomList.find((card: any) => {
                    const calculate: number = scrollTop - card.offsetTop;
                    return 0 <= calculate && calculate < 144;
                });
                const listID = findCard?.children[0]?.children[0]?.id;
                if (listID) {
                    const label = listID.replace('list', '');
                    highlightedLabel(label);
                }
            } else {
                console.log('list containerDom no render');
            }
        };
    });

    const onSelectedMenu = ({ key }: { key: any }) => {
        (window as any).gtag('event', 'Home-点击链接', {
            clickLink: `Active、InActive、All区域点击${key}`
        });

        highlightedLabel(ANCHORS_DATAS[0].title);
        const currentChainList = chainList.value[currentMenu.value[0]];
        currentChainList.sort((a: IIbcchain, b: IIbcchain) => {
            return a.pretty_name.toLowerCase() < b.pretty_name.toLowerCase()
                ? -1
                : a.pretty_name.toLowerCase() > b.pretty_name.toLowerCase()
                ? 1
                : 0;
        });
        if (!(currentChainList && currentChainList.length > 0)) return;
        const scrollDom = scrollListRef.value.$el;
        if (!scrollDom) return;
        // 通过标签去找符合当前列表的标签，然后再根据标签，滚动到合适的位置
        // 1.如果当前高亮的标签页能找到, 以当前高亮的标签为准
        // 2.如果当前高亮的标签 向上查找，能找到，则已找到的为准
        // 3.如果向上查找未找到，则使用数据列表中第一个匹配上的标签
        const id = document.querySelector('.self_link_active')?.id;
        let label: string;
        if (id) {
            label = id.replace('a-link', '');
        } else {
            return;
        }
        const currentChainNameList = currentChainList.map((chain) =>
            chain.chain_name[0].toUpperCase()
        );
        let findIndex = ANCHORS_DATAS.findIndex((item) => item.title === label);
        let isSuccess = false;
        let sureChainNameList = ANCHORS_DATAS[findIndex].collection;
        // 终止条件 isSuccess 成功  或者 findIndex <= 0
        while (!(isSuccess || findIndex <= 0)) {
            for (let i = 0; i < sureChainNameList.length; i++) {
                if (currentChainNameList.includes(sureChainNameList[i])) {
                    label = ANCHORS_DATAS[findIndex].title;
                    isSuccess = true;
                    break;
                }
            }
            if (!isSuccess) {
                findIndex--;
                sureChainNameList = ANCHORS_DATAS[findIndex].collection;
            }
        }
        // 如果没找到，以列表中第一个数据，来确定高亮的标签
        if (!isSuccess) {
            label = findClassName(currentChainList[0].pretty_name);
        }
        lock.value = true;
        setTimeout(() => {
            onClickAnchor(label);
        }, 0);
        emits('onMenuSelected', key);
    };

    const clickListItem = ({ type, value }: { type: any; value: any }) => {
        emits('clickItem', { type, value });
    };

    return {
        menus,
        currentMenu,
        anchors,
        scrollListRef,
        linkListRef,
        findClassName,
        onClickAnchor,
        onSelectedMenu,
        clickListItem,
        sortChainList
    };
};
