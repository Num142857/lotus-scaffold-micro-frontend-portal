var Metalsmith = require('metalsmith');
var consolidate = require('consolidate')
var inquirer = require('inquirer')
var path = require('path')
var fs = require('fs')
const fse = require('fs-extra');
const util = require('lotusjs-util')
const log = util.log
var metalsmith;

module.exports = exportFn()
//动态获取文件夹信息
function exportFn() {
  var dirs = fs.readdirSync(path.resolve(__dirname, '../template/'))
  let fn = {}
  dirs.forEach( (item) => {
    fn[item] =  async function (src) {
      let templatePath = path.resolve(__dirname, '../template/' + item);
      try {
        let config = await fse.readFile(`${templatePath}/template.json`)
        config = JSON.parse(config.toString())
        let message = config.message
        log.info(message)
      } catch (error) {
        log.warn(error)
      }
      generate(templatePath, src)
    }
  })

  fn.list = function(){
    inquirer
      .prompt([{
        type: 'list',
        name: 'type',
        message: '选择你要初始化的模板类型',
        choices: dirs
      }]).then((answers)=>{
        let templatePath = path.resolve(__dirname, '../template/' + answers.type);
        generate(templatePath)
      })
  }
  return fn
}

//统一生成函数
function generate(templatePath,src ){
  if (src) {
    //如果有路径,直接生成
    metalsmith = Metalsmith(__dirname)
      .source(templatePath)
      .ignore(`${templatePath}/template.json`)
      .destination(process.cwd() + "/" + src)
      .use((files, metalsmith, done)=>{
        var metadata = metalsmith.metadata();
        let pathArr = src.split('/');
        metadata['componentName'] = pathArr[pathArr.length-1]
        done()
      })
      .use(template)
      .build(function (err) {
        if (err) throw err;
        log.info('成功完结')
      });
  } else {
    //没有路径的处理,命令行问完问题再生成
    metalsmith = Metalsmith(__dirname)
      .source(templatePath)
       .ignore(`${templatePath}/template.json`)
      .use(ask)
      .use(template)
      .build(function (err) {
        if (err) throw err;
        log.info('成功完结')
      });
  }
}

//命令行问题
function ask(files, metalsmith, done) {
  inquirer
    .prompt([{
      type: 'input',
      name: 'componentName',
      message: '你的组件名称是?',
    }, {
        type: 'input',
        name: 'path',
        message: '路径',
      }]).then((answers)=>{
        var metadata = metalsmith.metadata();
        metadata['componentName'] = answers.componentName
        metalsmith.destination(process.cwd() + "/" + answers.path);
        done()
    })
}

//渲染
function template(files, metalsmith, done) {
  var keys = Object.keys(files);
  var metadata = metalsmith.metadata();
  keys.forEach((file)=>{
    var str = files[file].contents.toString();
    consolidate.handlebars.render(str, metadata, function (err, res) {
      if (err) return done(err);
      files[file].contents = new Buffer(res);
      done();
    });
  })
}