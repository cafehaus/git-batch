const fs = require('fs')
const execSync = require('child_process').execSync

let count = {
  '总共': 0,
  '成功': 0,
  '失败': 0,
  '非Git路径': 0,
  '仓库异常': 0,
  '有未提交修改': 0,
}

/**
 * 读取文件和路径
 * @param path
 * @returns {Promise<any>}
 */
function readFile(path) {
  return new Promise(function(resolve, reject) {
    fs.readdir(path, function(error, result) {
      if (!error) {
        resolve(result)
      } else {
        console.log(`请检查项目路径配置`)
        reject(error)
      }
    })
  })
}

/**
  * 判断目录是否存在
  * @param path
 * @returns {Boolean}
  */
function isDirExist(path) {
  try {
    let stat = fs.lstatSync(path)
    return stat && stat.isDirectory()
  } catch (r) {
    // console.log(r)
    return false
  }
}

/**
 * 判断是否为 Git 项目
 * @param path
 * @returns {Boolean}
 */
function isGitProj(path) {
  return isDirExist(path) && isDirExist(`${path}/.git`)
}

/**
 * 判断是否为异常仓库
 * @param path
 * @returns {Boolean}
 */
function isErrRepository(path) {
  return new Promise(async function(resolve, reject) {
    let remoteUrl = await exeCmd(`cd ${path} && git remote -v`)
    console.log(path)
    if (!remoteUrl || remoteUrl === 'fail') {
      console.log(`异常仓库地址：[${remoteUrl}]`)
      resolve(true)
    } else {
      resolve(false)
    }
  })
}

/**
 * 判断当前操作分支是否需要 commit
 * @param path
 * @returns {Boolean}
 */
function isErrCommit(path) {
  return new Promise(async function(resolve, reject) {
    let status = await exeCmd(`cd ${path} && git status`)
    let projName = path.split('/').reverse()[0]
    if (!status.includes('nothing to commit, working tree clean')) {
      console.log(`${projName}：有未提交修改，请先提交`)
      resolve(true)
    } else {
      resolve(false)
    }
  })
}

/**
 * 执行命令
 * @param cmdStr
 * @param isCount
 * @returns {Promise}
 */
function exeCmd(cmdStr, isCount) {
  return new Promise(function(resolve, reject) {
    try {
      const cmd = execSync(cmdStr)
      if (isCount) count.成功 += 1 // 更新计数
      resolve(cmd.toString())
    } catch (e) {
      count.失败 += 1 // 更新计数
      console.log(`#########失败命令：${e}`)
      // reject(e) // 自定义错误
      resolve('fail')
    }
  })
}

/**
 * 批量执行命令
 * @callback 批处理回调
 */
async function batchExeCmd(callback, config) {
  let localPath = config.localPath
  let projNames = config.projectList || await readFile(localPath)

  let isClone = config.type === 'clone'
  let isDelDir = config.type === 'del-dir'
  let isCommit = config.type === 'commit'
  let ignoreGit = isClone || isDelDir

  for (let i = 0; i < projNames.length; i++) {
    let projName = projNames[i]
    let projPath = `${localPath}/${projName}`

    if (!ignoreGit) {
      // 非 Git 项目路径
      if (!isGitProj(projPath)) {
        count.非Git路径 += 1
        continue
      }

      // 仓库异常
      let errRepository = await isErrRepository(projPath)
      if (errRepository) {
        count.仓库异常 += 1
        continue
      }

      if (!isCommit) {
        // 有未提交修改
        let errCommit = await isErrCommit(projPath)
        if (errCommit) {
          count.有未提交修改 += 1
          continue
        }
      }
    }

    console.log('\n==========================================================')
    console.log(`当前项目：${projName}`)
    await callback(projName, projPath)
  }

  count.总共 = projNames.length
  console.log('统计结果：', count)
  return count
}

module.exports = {
  exeCmd,
  batchExeCmd,
  isDirExist,
}
