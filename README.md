## iobscan-ibc-explorer
IBC Explorer Frontend


## development
step1 安装依赖
```
 	yarn install
```
step2 设置代理  详细参考 “## proxy”
step3 build
```
	yarn build
```

## proxy
```
proxy: {
          '/api':{
              target:'http://10.1.4.248:4003',
              secure:false,
              pathRewrite:{'^/api': '/'}
          },
        }
```

