// 测试
const util = require('../libs/util')
let config = require('../config')
const execSync = require('child_process').execSync

function execCmd(cmd) {
  let output = execSync(cmd)
  console.log(output.toString())
}

execCmd(`cd ${config.localPath}/pc-www && git branch`)