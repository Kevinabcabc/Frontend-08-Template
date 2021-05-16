const http = require("http");
const fs = require("fs");
const archiver = require('archiver');
const querystring = require('querystring');
const child_process = require('child_process');

// 1打开  https://github.com/login/oauth/authorize

child_process.exec(`open https://github.com/login/oauth/authorize?client_id=Iv1.9d2fe5abef59d0b7`);
// 3创建server 接受token然后点击发布


http.createServer(function (req, res) {
  if (req.url.match(/^\/favicon\.ico/)) {
    res.end();
    return;
  }
  let query = querystring.parse(req.url.match(/^\/\?([\s\S]+)$/)[1]);
  console.log('query', query);
  publish(query.token);
  res.end();
}).listen(8088, () => {
  console.log('ok 8088');
});

function publish(token) {
    console.log('publish');
  const request = http.request({
    hostname: "106.15.251.171",
    port: 8082,
    method: 'POST',
    path: '/publish',
    headers: {
      "Content-Type": "application/octet-stream", // 流
      // "Content-Length": stats.size, // 有了Content-Length 请求才会正常结束
      "Authorize-Token": token,
    }
  }, (response) => {
    // console.log(1, response);
  });
  
  
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });
  
  archive.directory('./sample/', false);
  
  archive.finalize();
  
  archive.pipe(request);
  
  archive.on('close', () => {
    console.log('finish');
    request.end();
  });
  
}
