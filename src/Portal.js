"use strict";
import * as singleSpa from 'single-spa'; 
import { registerApp } from './Register'
import projectConfig from './project.js'
SystemJS.import('./project.js').then(function (m) {
    console.log(m)
})

async function bootstrap() {
    projectConfig.projects.forEach( async element => {
        await registerApp({
            name: element.name,
            main: element.main,
            url: element['url-prefix'],
        });
    });

    singleSpa.start();
}

bootstrap()

