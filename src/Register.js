import * as singleSpa from 'single-spa';
import _ from 'lodash'
import { GlobalEventDistributor } from './GlobalEventDistributor' 
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
    let storeModule = params.store ? await SystemJS.import(params.store) : { storeInstance: null };
    // storeModule=  _.cloneDeep(storeModule)
    // delete storeModule.__esModule
    // register the store with the globalEventDistributor
    if (params.store && globalEventDistributor){
        globalEventDistributor.registerStore(storeModule); 
    }
    setInterval(function(){
        console.log(storeModule)
    },2000)
    // register the app with singleSPA and pass a reference to the store of the app as well as a reference to the globalEventDistributor
    const customProps = { store: storeModule, globalEventDistributor: globalEventDistributor };
    singleSpa.registerApplication(params.name, () => SystemJS.import(params.main), pathPrefix(params.url), customProps);
}