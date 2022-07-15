// 批量删除本地分支
const util = require('../libs/util')
let config = require('../config')
config = {
  ...config,
  type: 'delete',
  projectList: [ // 配置要 delete 的项目仓库名
    'pc-www',
  ]
}

util.batchExeCmd(async (projName, projPath) => {
  // Git Bash 版本批量删除分支：grep 和 xargs 这两个 Linux 命令需要 Git Bash 才能执行
  // let res = await util.exeCmd(`cd ${projPath} && git checkout master && git pull origin master && git branch | grep -v 'master' | xargs git branch -D`, 1)
  // console.log(`${projName}：删除本地分支${res === 'fail' ? '失败' : '成功'}`)

  // windows 版本批量删除分支
  let res = await util.exeCmd(`cd ${projPath} && git checkout master && git pull origin master && git branch`)
  if (res && res !== 'fail') {
    let list = res.replace(`Your branch is up to date with 'origin/master'.\nAlready up to date.\n  `, '').split('\n')
    let delList = list.filter(m => m && !/^\*/.test(m))
    console.log(delList)
    delList.map(m => {
      util.exeCmd(`cd ${projPath} && git checkout master && git pull origin master && git branch`)
    })
    for (let i = 0; i < delList.length; i++) {
      let delRes = await util.exeCmd(`cd ${projPath} && git branch -D ${delList[i]}`)
      console.log(`${projName}：本地分支${delList[i]}删除${delRes === 'fail' ? '失败' : '成功'}`)
    }
  }
}, config)