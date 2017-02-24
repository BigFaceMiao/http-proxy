var _pro = require("./pro");
/*使用前，请安装依赖库
 querystring
 http-proxy
* */
var _config = {
    port: 80,
    //代理服务监听端口
    errorConfig: "D:/code/node/uglify/web/404.html",
    //错误页，如果不存在，将会输出一条404消息
    siteConfig: [{
        doMain : "www.abcd1.com",
        webFile: "D:/code/node/uglify/web",
        isDebug: true
    }, {
        doMain : "www.abcd2.com",
        webFile: "D:/code/node/uglify/web"
    }],
    /*静态资源配置
     doMain    当前网站的域名
     webFile   当前网站的物理路径
     isDebug   是否开启调试，如开启，则可以使用localhost访问
     * */
    serverConfig: [{
        doMain: "api.abcd1.com",
        port: 8081,
        path: ["/df"]
    }, {
        doMain: "api.abcd2.com",
        port: 8082,
        path: ["/d"]
    }]
    /*服务端口配置
     doMain    如果接口为单独域名，则填写，调试时可以改为localhost等本地地址
     port      服务所在端口
     path      当前端口下，有哪些接口地址
     * */
};
_pro(_config);