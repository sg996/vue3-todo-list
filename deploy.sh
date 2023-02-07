#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e
# window 全局下载  npm i rimraf -g
rimraf dist
# mac 可使用(慎用)
# rm -rf dist
# 生成静态文件
yarn build 

# 进入生成的打包文件夹
cd dist

echo "
<h3>
    <a href="https://sg996.github.io/vue3-todo-list/" target="_blank">
    <img src="https://img.shields.io/badge/GitHub%20%E5%9C%B0%E5%9D%80-https%3A%2F%2Fsg996.github.io%2Fvue3--todo--list%2F-brightgreen" alt="访问地址"/>
    </a>
</h3>
<h3>
    <a href="https://sg996.gitee.io/vue3-todo-list/" target="_blank">
    <img src="https://img.shields.io/badge/Gitee%20%E5%9C%B0%E5%9D%80-https%3A%2F%2Fsg996.gitee.io%2Fvue3--todo--list%2F-brightgreen" alt="访问地址"/>
    </a>
</h3>
" > README.md

git init 

git config --local user.name "sg996"
git config --local user.email "1942459198@qq.com"

note=`git status`

git add -A
git commit -m "$note"

git remote add github-origin git@github.com:sg996/vue3-todo-list.git
git remote add gitee-origin git@gitee.com:sg996/vue3-todo-list.git

git branch -M gh-pages
git push -f github-origin gh-pages
git push -f gitee-origin gh-pages:pages

cd /