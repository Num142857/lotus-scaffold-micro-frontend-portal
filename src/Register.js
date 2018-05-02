import * as singleSpa from 'single-spa';
import _ from 'lodash'
import { GlobalEventDistributor } from './GlobalEventDistributor' 
const globalEventDistributor = new GlobalEventDistributor();


export function hashPrefix(app) {
    console.log("当前访问的地址为:", app.path || app.url)
    return function (location) {
        return location.hash.startsWith(`${app.path || app.url}`);
    }
}

export function pathPrefix(app) {
    return function (location) {
        console.log(location.pathname)
        console.log(location.pathname.indexOf(`${app.path||app.url}`) === 0)
        return location.pathname.indexOf(`${app.path || app.url}`) === 0;
    }
}
export async function registerApp(params) {
    // import the store module
    let storeModule = {}, customProps = { globalEventDistributor: globalEventDistributor };

    // try to import the store module
    try {
        storeModule = params.store ? await SystemJS.import(params.store) : { storeInstance: null };
    } catch (e) {
        console.log(`Could not load store of app ${params.name}.`, e);
    }
    // 注册应用于事件派发器
    if (storeModule.storeInstance && globalEventDistributor) {
        //取出 redux storeInstance
        customProps.store = storeModule.storeInstance;

        // 注册到全局
        globalEventDistributor.registerStore(storeModule.storeInstance);
    }

    //准备自定义的props,传入每一个单独工程项目
    customProps = { store: storeModule, globalEventDistributor: globalEventDistributor };
    singleSpa.registerApplication(params.name, () => SystemJS.import(params.main), params.base ? (() => true) : hashPrefix(params), customProps);
}