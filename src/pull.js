// 批量拉取分支
const util = require('../libs/util')
let config = require('../config')
config = {
  ...config,
  type: 'pull',
  projectList: [ // 配置要 pull 的项目仓库名
    'pc-www',
  ],
  branch: 'feat-dev' // 要拉取的分支名
}

util.batchExeCmd(async (projName, projPath) => {
  // git pull 后面不加 origin <远程分支名>，有时会报错：
  // There is no tracking information for the current branch.
  // Please specify which branch you want to merge with.
  let res = await util.exeCmd(`cd ${projPath} && git checkout ${config.branch} && git pull origin ${config.branch}`, 1)
  console.log(`${projName}：拉取${config.branch}分支${res === 'fail' ? '失败' : '成功'}`)
}, config)