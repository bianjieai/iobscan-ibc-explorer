// TODO shan => 3端响应式

/**
 *
 * @param layout dom ref
 * @returns 生成两批star方法，编号count 1 / 2
 */
export const useStarAnimation = (layout: any) => {
    const setStar = (count: number) => {
        const removeStarContainerDom = document.getElementsByClassName(`star_container_${count}`);
        if (removeStarContainerDom?.length !== 0) {
            layout.value && layout.value?.$el.removeChild(removeStarContainerDom[0]);
        }

        const starContainerDom = document.createElement('div');
        starContainerDom.className = `star_container_${count}`;
        starContainerDom.style.position = 'absolute';
        starContainerDom.style.left = '0';
        starContainerDom.style.top = '0';
        starContainerDom.style.zIndex = '1';
        starContainerDom.style.minHeight = '100vh';
        starContainerDom.style.background = 'transparent';
        starContainerDom.style.width = '100%';
        layout.value && layout.value?.$el.appendChild(starContainerDom);
        const windowClientWidth = window.document.documentElement.clientWidth - 20;
        const starNumber = count === 1 ? 20 : 10;

        for (let i = 0; i < starNumber; i++) {
            const createDom = document.createElement('div');
            createDom.className = `star_content_${count}`;
            const widthAndHeight = parseInt(String(Math.random() * (count === 1 ? 6 : 10)));
            createDom.style.width = `${widthAndHeight}px`;
            createDom.style.height = `${widthAndHeight}px`;
            createDom.style.borderRadius = `${widthAndHeight / 2}px`;
            createDom.style.animationDelay = '1000';
            // let leftNumber = `${parseInt(Math.random() * windowClientWidth)} px`
            createDom.style.left = `${parseInt(String(Math.random() * windowClientWidth))}px`;
            createDom.style.top = `${parseInt(String(Math.random() * 320))}px`;
            createDom.style.boxShadow = '0 0 0.1rem 0 rgba(229, 232, 153, 0.8)';
            createDom.style.background = '#FEFFA6';
            createDom.style.position = 'absolute';
            createDom.style.animation =
                count === 1 ? 'flicker 3s ease-in-out infinite' : 'flicker 4s ease-in-out infinite';

            const appendChildStartContainerDom = document.getElementsByClassName(
                `star_container_${count}`
            );
            appendChildStartContainerDom[0].appendChild(createDom);
        }
    };

    return {
        setStar1: () => setStar(1),
        setStar2: () => setStar(2)
    };
};
export const useOnPressEnter = () => {
    const onPressEnter = (val: any) => {
        console.log(val);
    };
    return {
        onPressEnter
    };
};
