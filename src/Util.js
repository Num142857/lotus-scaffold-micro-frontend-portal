import * as singleSpa from 'single-spa'; // waiting for this to be merged: https://github.com/CanopyTax/single-spa/pull/156

export function hashPrefix(prefix) {
    return function (location) {
        return location.hash.startsWith(`#${prefix}`);
    }
}

export async function importApp(params) {
    // import the store module
    const storeModule = params.storeURL ? await SystemJS.import(params.storeURL) : {storeInstance: null};

    // register the store with the globalEventDistributor
    if (storeModule.storeInstance && params.globalEventDistributor)
        params.globalEventDistributor.registerStore(storeModule.storeInstance);

    // register the app with singleSPA and pass a reference to the store of the app as well as a reference to the globalEventDistributor
    const customProps = { store: storeModule.storeInstance, globalEventDistributor: params.globalEventDistributor };

    singleSpa.registerApplication(params.name, () => SystemJS.import(params.appURL), hashPrefix(params.hash), customProps);
}