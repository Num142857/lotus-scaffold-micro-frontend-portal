import * as singleSpa from 'single-spa';
export function hashPrefix(prefix) {
    
    console.log("当前访问的地址为:", prefix)
    return function (location) {
        return location.hash.startsWith(`${prefix}`);
    }
}

export function pathPrefix(prefix) {
    console.log(prefix)
    return function (location) {
        console.log(location.pathname)
        console.log(location.pathname.indexOf(`${prefix}`) === 0)
        return location.pathname.indexOf(`${prefix}`) === 0;
    }
}
export async function registerApp(params) {
    singleSpa.registerApplication(params.name, () => SystemJS.import(params.main), pathPrefix(params.url));
}