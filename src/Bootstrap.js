"use strict";
import * as singleSpa from 'single-spa'; 
import { registerApp } from './Register'

async function bootstrap() {
    let projectConfig = await SystemJS.import('/project.js')
    projectConfig.projects.forEach( async element => {
        await registerApp({
            name: element.name,
            main: element.main,
            url: element['prefix'],
        });
    });

    singleSpa.start();
}

bootstrap()

