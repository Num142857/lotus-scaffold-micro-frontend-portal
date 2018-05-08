#!/usr/bin/env node

const program = require('commander');
const appInfo = require('../../package.json')
var generate = require('./generate')
program
    .version(appInfo.version, '-v, --version')


program
    .command('init')
    .alias('i')
    .description('初始化你的项目')
    .action(require('./init').init);

program
    .command('generate')
    .alias('g')
    .description('模板生成')
    .arguments('<type> [src]')  //[]:可选  <>:必选
    .action(function (type, src) {
        if (type === 'generateList'){
            generate.list()
            return
        }
        try {
            generate[type](src)
        } catch (error) {
            
        }
    });

program.on('--help', function () {
    console.log('');
    console.log('  例子:');

    console.log('');
    console.log('  项目初始化');
    console.log(`    $ ${appInfo.name} init`);

    console.log('');
    console.log('  生成一个新页面');
    console.log(`    $ ${appInfo.name} generate page src/modles/my-new-page`);

    console.log('');
    console.log('  生成一个新组件');
    console.log(`    $ ${appInfo.name} generate component src/component/my-new-component`);

    console.log('');
    console.log('');
});

program.parse(process.argv);


