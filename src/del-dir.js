// 批量删除项目文件夹或项目下的 node-modules
// 也可以用删除库 rimraf
const util = require('../libs/util')
let config = require('../config')
config = {
  ...config,
  type: 'del-dir',
  dirName: '', // 为空则直接删除项目
  // dirName: 'node-modules',
  projectList: [ // 配置要批量删除的项目仓库名
    'pc-www',
  ]
}

util.batchExeCmd(async (projName, projPath) => {
  let dir = `${config.localPath}/${projName}/${config.dirName}`
  if (!util.isDirExist(dir)) {
    console.log(projName + '项目' + config.dirName + '不存在')
    return
  }

  // 要删除的上层目录
  // 注意：只支持删除项目仓库目录或者根目录下的直接目录，如 node-modules
  let actionPath = config.dirName ? `${config.localPath}/${projName}` : config.localPath
  let actionDirName = config.dirName || projName

  let res = await util.exeCmd(`cd ${actionPath} && rd /q /s ${actionDirName}`, 1)
  console.log(projName + '项目' + config.dirName + '删除：' + (res === 'fail' ? '失败' : '成功'))
}, config)