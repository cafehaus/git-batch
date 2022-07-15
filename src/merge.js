// 批量合并代码到dev/test分支
const util = require('../libs/util')
let config = require('../config')
config = {
  ...config,
  type: 'merge',
  projectList: [ // 配置要 pull 的项目仓库名
    'pc-www',
  ],
  featBranch: '', // 功能分支，默认为空直接使用当前分支merge
  branch: ['dev', 'test'] // 要merge的分支
}

util.batchExeCmd(async (projName, projPath) => {
  let featBranch = config.featBranch
  if (!featBranch) {
    featBranch = await util.exeCmd(`cd ${projPath} && git branch --show-current`)
  }

  let branchList = config.branch || []
  // 用map遍历会报错：SyntaxError: await is only valid in async functions and the top level bodies of modules
  for (let i = 0; i < branchList.length; i++) {
    let res = await util.exeCmd(`cd ${projPath} && git checkout ${branchList[i]} && git pull origin ${branchList[i]} && git merge ${featBranch}`)

    // 无冲突就推送到远程，然后切换回功能分支
    let isConflict = res.includes('CONFLICT') || res.includes('error')
    if (!isConflict) {
      await util.exeCmd(`cd ${projPath} && git push origin ${branchList[i]} && git checkout ${featBranch}`, 1)
    }

    let isFail = res === 'fail' || isConflict
    console.log(`${projName}：${featBranch}合并到${branchList[i]}分支${isFail ? '失败' : (isConflict ? '冲突' : '成功')}`)
  }
}, config)