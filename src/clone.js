// 批量克隆项目
const util = require('../libs/util')
let config = require('../config')
config = {
  ...config,
  type: 'clone',
  projectList: [ // 配置要 clone 的项目仓库名
    'pc-www',
  ]
}

util.batchExeCmd(async (projName, projPath) => {
  let remoteUrl = `${config.remoteBaseUrl}${projName}.git`
  let res = await util.exeCmd(`cd ${config.localPath} && git clone ${remoteUrl}`, 1)

  console.log(projPath + '：' + (res === 'fail' ? '克隆失败' : '克隆成功'))
}, config)