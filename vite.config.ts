import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import * as path from 'path';

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
    const env = loadEnv(mode, './');
    console.log(env);

    return defineConfig({
        css: {
            preprocessorOptions: {
                less: {
                    additionalData: `@import "${path.resolve(
                        __dirname,
                        './src/theme/variable/variable.less'
                    )}";`,
                    modifyVars: {
                        'primary-color': '#3D50FF',
                        'border-radius-base': '4px'
                    },
                    javascriptEnabled: true
                }
            }
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '~': path.resolve(__dirname, './node_modules')
            }
        },
        plugins: [
            vue(),
            vueJsx(),
            Components({
                dts: 'src/types/globalComponents.d.ts',
                dirs: ['src/components'], // 按需加载的文件夹
                resolvers: [AntDesignVueResolver({ importStyle: 'less' })]
            }),
            AutoImport({
                imports: ['vue', 'vue-router', 'pinia'], // 自动导入vue和vue-router相关函数
                dts: 'src/types/autoImport.d.ts' // 生成 `auto-import.d.ts` 全局声明
            }),
            viteCompression({
                ext: '.gz',
                verbose: true,
                deleteOriginFile: false
            }),
            visualizer()
        ],
        server: {
            fs: {
                strict: true,
                allow: ['.']
            },
            host: true,
            port: 3000,
            open: 'http://localhost:3000'
        },
        build: {
            // 打包删除console配置 以及报错
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true
                }
            },
            sourcemap: mode !== 'production',
            cssTarget: 'chrome61'
        }
    });
};
