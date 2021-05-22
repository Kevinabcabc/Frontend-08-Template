学习笔记

 ls -l pre-commit  查看文件pre-commit 权限

 chmod +x ./pre-commit 添加执行权限


#!/usr/bin/env node
let process = require('process');
let child_process = require('child_process');
const { ESLint } = require('eslint');

function exec(name) {
  return new Promise((resolve, reject) => {
    child_process.exec(name, resolve);
  });
}

(async function main() {
  const eslint = new ESLint({fix: false});

  await exec("git stash push -k");

  const results = await eslint.lintFiles(["index.js"]);

  await exec("git stash pop");

  const formatter = await eslint.loadFormatter("stylish");

  const resultText = formatter.format(results);

  console.log(resultText);

  for (let result of results) {
    if (result.errorCount) {
        process.exitCode = 1;
    }
  }
})().catch(error => {
  process.exitCode = 1;
  console.error(error)
});


电脑设置谷歌命令行启动
alias chrome="/Applications/Google\ Chrome.app/Contents/MacOS/google\ Chrome"

设置无头
chrome --headless --dump-dom about:blank

无头浏览器输出文件
chrome --headless --dump-dom about:blank > tmp.txt
