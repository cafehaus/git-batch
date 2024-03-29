// 批量从master创建功能分支
const util = require('../libs/util')
let config = require('../config')
config = {
  ...config,
  type: 'create',
  projectList: [ // 配置要 pull 的项目仓库名
    'pc-www',
  ],
  branch: 'feat-cafe' // 要新建的功能分支名
}

util.batchExeCmd(async (projName, projPath) => {
  // 远程分支
  // 如果不加 git remote show origin && git remote prune origin，远程已经被删除的历史分支还是能看到
  let originBranch = await util.exeCmd(`cd ${projPath} && git remote show origin && git remote prune origin && git branch -r`)
  if (originBranch.includes(config.branch)) {
    console.log(`${projName}：${config.branch}与远程分支名重复，请修改`)
    return
  }

  // 本地分支
  let localBranch = await util.exeCmd(`cd ${projPath} && git branch`)
  if (localBranch.includes(config.branch)) {
    console.log(`${projName}：${config.branch}本地分支名重复，请修改`)
    return
  }

  // 最后的命令 yarn(npm install) 可选，这里加上是因为如果只是修改不运行
  // 如果有新的依赖没安装，并且项目代码加了第三方push代码检查，后面还想批量 yarn merge 时就会报错不能推送
  let res = await util.exeCmd(`cd ${projPath} && git checkout master && git pull origin master && git branch ${config.branch} && git checkout ${config.branch} && git push -u origin ${config.branch} && yarn`, 1)
  console.log(`${projName}：新建${res === 'fail' ? '失败' : '成功'}-${config.branch}`)
}, config)