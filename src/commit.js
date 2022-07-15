// 批量提交代码
// 慎用：适用于多端简单修改同样的代码提交，比如修改文字
// 如果多人共用一个分支 commit 前自己要先 pull 一下
const util = require('../libs/util')
let config = require('../config')
config = {
  ...config,
  type: 'commit',
  projectList: [ // 配置要 commit 的项目仓库名
    'pc-www',
  ],
  // message: 'feat：修改字段 name => newName' // 注意尽量不要在命令里带一些特殊符号，这句里的 => 会在当前文件下生成一个 newName 的空文件
  // message: 'feat：add 静态页面' // 这里的 add 也会被当成命令解析，会报错
  message: 'feat：新增静态页面' // 提交备注
}

util.batchExeCmd(async (projName, projPath) => {
  let featBranch = await util.exeCmd(`cd ${projPath} && git branch --show-current`)

  let origin = config.remote
  let res = await util.exeCmd(`cd ${projPath} && git add . && git commit -m ${config.message} && git push ${origin} ${featBranch}`, 1)
  console.log(`提交${res === 'fail' ? '失败' : '成功'}：\n` + await util.exeCmd(`cd ${projPath} && git status`))
}, config)