/*
 * @Author: feiyu
 * @Date: 2022-09-23 14:11:29
 * @LastEditors: feiyu
 * @LastEditTime: 2022-09-23 15:06:30
 * @Description: file content
 */
const env = import.meta.env;
let url = 'https://www.googletagmanager.com/gtag/js?id=';
let GID = '';
GID = env.VITE_GID ? env.VITE_GID : 'G-V6WLNTGZ9R';
const src = url + GID;

export { src };
