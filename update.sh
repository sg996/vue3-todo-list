#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

git config --local user.name "源代码"
git config --local user.email "1942459198@qq.com"

git add -A
git commit -m "update"

# git branch --set-upstream-to=github-origin/main main
# git branch --set-upstream-to=gitee-origin/master main

git push github-origin main
git push gitee-origin main:master

cd /

