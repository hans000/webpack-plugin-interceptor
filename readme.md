# webpack-plugin-interceptor

English | [中文](./readme-zh.md)

A webpack plugin based on service worker to intercept and modify requests in a **development** environment

> the browser needs to support service worker

> a chrome extension can be used in production environment. [easy-interceptor](https://github.com/hans000/easy-interceptor)

## Usage

in webpack.config.js
```

const { Interceptor, middleware } = require('webpack-plugin-interceptor')

export default {
    // ...
    plugins: [
        // Interceptor()
        // or
        new Interceptor({
            input: 'src/index.ts', // 默认src/index.ts
            mockDir: './src/__mock__',   // 默认src/mock
        }),
    ],
    devServer: {
        // install middleware
        setupMiddlewares: (middlewares) => {
            middlewares.push(middleware)
            return middlewares
        }
    }
}
```

in webpack-dev-server3.0
```
export default {
    devServer: {
        before: (app) => {
            app.use(middleware.middleware)
        }
    }
}
```

// create a .ts or .js file in \_\_mock\_\_ dir，must be use export default and set rules by plugin provide
```
export default function() {
    window.__INTERCEPTOR_DEVTOOL__.set(
        '1',
        {
            url: '**/tsconfig.json',
            method: 'get',
            response: '{"foo":"test"}',
            // enable: false,
            // delay: 5000,
        }
    )
}

```

ts type, create a new file `interceptor.d.ts`, input this text

```
/// <reference types="webpack-plugin-interceptor/typing" />
```


you will meet the following errors in https project. The solutions are as follows
```
Uncaught (in promise) DOMException: Failed to register a ServiceWorker for scope ('https://127.0.0.1/') with script ('https://127.0.0.1/sw000.js'): An SSL certificate error occurred when fetching the script.

// terminal
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir=/tmp --ignore-certificate-errors --unsafely-treat-insecure-origin-as-secure=https://localhost:443

// windows
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --user-data-dir=./tmp --ignore-certificate-errors --unsafely-treat-insecure-origin-as-secure=https://localhost:443
```

## API

### \_\_INTERCEPTOR_DEVTOOL\_\_

|prop|explain|type|description|
|:--:|:---|:---|:---|
|get|get rules|()=>Promise|
|set|set a rule|(id, rule) => void|
|clear|clear all rules|()=>void|

### InterceptorRule
|prop|explain|type|description|
|:--|:---|:---|:---|
|url|match request url|string|rquired
|response|response text|string|rquired
|delay|delay|number|0
|enable|enable rule|boolean|true
|method|request method|`get` `post` `put` `delete`|
|responseHeaders|response headers|Record<string, string>|{}
|status|response status|number|200


> about multi-page: the sw.js scope is `./`, so the plugin supports multi-page. just load the configured page to make the script active

## LICENSE
[MIT](./LICENSE)