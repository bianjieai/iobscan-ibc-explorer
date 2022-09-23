/*
 * @Author: feiyu
 * @Date: 2022-09-23 14:11:29
 * @LastEditors: feiyu
 * @LastEditTime: 2022-09-23 16:58:38
 * @Description: file content
 */
const env = import.meta.env;
const url = 'https://www.googletagmanager.com/gtag/js?id=';
let GID = '';
GID = env.VITE_GID ? env.VITE_GID : 'G-V6WLNTGZ9R';
const src = url + GID;

// 挂载gtag方法
(window as any).dataLayer = (window as any).dataLayer || [];
function gtag(){dataLayer.push(arguments);}
(window as any).gtag = gtag;
(window as any).gtag('js', new Date());
(window as any).gtag('config', GID);

export { src };
