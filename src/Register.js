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
    let storeModule = {}, customProps = { globalEventDistributor: globalEventDistributor };

    // try to import the store module
    try {
        storeModule = storeURL ? await SystemJS.import(storeURL) : { storeInstance: null };
    } catch (e) {
        console.log(`Could not load store of app ${name}.`, e);
    }
    console.log(storeModule)
    // register the store with the globalEventDistributor
    if (storeModule.storeInstance && globalEventDistributor) {
        // add a reference of the store to the customProps
        customProps.store = storeModule.storeInstance;

        // register the store with the globalEventDistributor
        globalEventDistributor.registerStore(storeModule.storeInstance);
    }

    setInterval(function(){
        console.log(globalEventDistributor)
    },4000)
    // register the app with singleSPA and pass a reference to the store of the app as well as a reference to the globalEventDistributor
    customProps = { store: storeModule, globalEventDistributor: globalEventDistributor };
    singleSpa.registerApplication(params.name, () => SystemJS.import(params.main), pathPrefix(params.url), customProps);
}