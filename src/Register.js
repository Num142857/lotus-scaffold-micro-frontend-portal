import * as singleSpa from 'single-spa';
import { GlobalEventDistributor } from './globalEventDistributor'
export function hashPrefix(prefix) {
    
    console.log("当前访问的地址为:", prefix)
    return function (location) {
        return location.hash.startsWith(`${prefix}`);
    }
}

const globalEventDistributor = new GlobalEventDistributor();
export function pathPrefix(prefix) {
    console.log(prefix)
    return function (location) {
        console.log(location.pathname)
        console.log(location.pathname.indexOf(`${prefix}`) === 0)
        return location.pathname.indexOf(`${prefix}`) === 0;
    }
}
export async function registerApp(params) {
    // import the store module
    const storeModule = params.store ? await SystemJS.import(params.store) : { storeInstance: null };
    // register the store with the globalEventDistributor
    if (storeModule.storeInstance && globalEventDistributor){
        globalEventDistributor.registerStore(storeModule.storeInstance);
    }
    // register the app with singleSPA and pass a reference to the store of the app as well as a reference to the globalEventDistributor
    const customProps = { store: storeModule.storeInstance, globalEventDistributor: globalEventDistributor };
       
    singleSpa.registerApplication(params.name, () => SystemJS.import(params.main), pathPrefix(params.url), customProps);
}