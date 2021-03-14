const https = require('https');
const http = require('http');
const cheerio = require('cheerio');
// 启动服务浏览器访问端口信息，由于加载chunk 时间比较慢，需要稍等chunk加载完；

// 根据不同页面结构写filter
const filter = (data) => {
  console.log('end loading chunk', data);
}

let loading = false;

const server = http.createServer((req, res) => {
  let data = '';
  !loading && https.get('https://www.w3.org/TR/?tag=css', (result) => {
    loading = true;
    console.log('loading chunk...');
    result.on('data', (chunk) => {
      data += chunk;
    });

    result.on('end', () => {
      filter(data);
    });
  });
});

server.listen(8080, () => {
  console.log('启动成功端口：8080');
});