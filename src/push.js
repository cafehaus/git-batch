// 批量推送分支
const util = require('../libs/util')
let config = require('../config')
config = {
  ...config,
  type: 'push',
  projectList: [ // 配置要 push 的项目仓库名
    'pc-www',
  ],
  branch: 'master' // 要推送的分支名
}

util.batchExeCmd(async (projName, projPath) => {
  let origin = config.remote
  let res = await util.exeCmd(`cd ${projPath} && git checkout ${config.branch} && git push ${origin} ${config.branch}`, 1)
  console.log(`推送${res === 'fail' ? '失败' : '成功'}：\n` + await util.exeCmd(`cd ${projPath} && git status`))
})