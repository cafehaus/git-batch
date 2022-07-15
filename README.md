# Git常用命令批量操作工具

## 使用说明
```bash
# 批量克隆分支
yarn clone

# 批量拉取分支
yarn pull

# 批量新建功能分支
# yarn create 会和yarn官方的重复，会报错：error Invalid package name
yarn cb

# 批量删除本地分支
yarn delete

# 批量合并功能分支代码到de/test分支
yarn merge

# 批量提交
yarn commit

# 批量推送分支
yarn push

# 测试命令
yarn test
```

## 注意事项
1. 请在同一个盘里运行

如当前命令文件在 C 盘，而 config.js 里配置的本地放置仓库的路径 localPath 在 D 盘，直接运行会报错：
fatal: not a git repository (or any of the parent directories): .git

即使 clone 下来的项目也会直接到当前命令工具的目录，而非 localPath