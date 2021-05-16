const http = require("http");
const https = require("https");
const unzipper = require('unzipper');
const querystring = require('querystring');

// 2auth路由 允许接受code， 用code加client_id 和client_secret 换token
function auth(req, res) {
  console.log('enter auth');
  let query =querystring.parse(req.url.match(/^\/auth\?([\s\S]+)$/)[1]);
  console.log('query', query);
  getToken(query.code, function(info) {
    console.log('info');
    // res.write(JSON.stringify(info));
    res.write(`<a href='http://localhost:8088/?token=${info.access_token}'>publish</a>`);
    res.end();
  });
}

function getToken(code, callback) {
  console.log('getToken');
  let request = https.request({
    hostname: 'github.com',
    path: `/login/oauth/access_token?code=${code}&client_id=Iv1.9d2fe5abef59d0b7&client_secret=2926ebf3e462805c92da610600fc84860dd9f41c`,
    port: 443,
    method: 'POST'
  }, function(response) {
    let body = []
    response.on('data', chunk => {
      console.log('data chunk', chunk.toString());
      body = chunk.toString();
    });

    response.on('error', err => {
      console.log('error', err);
    });

    response.on('end', chunk => {
      callback(querystring.parse(body));
    });
  });

  request.end();

}
// 4用token获取用户信息，检查权限


// publish路由接受发布

function publish(req, res) {
  console.log('enter publish');

  console.log('Authorize-Token', req.headers['authorize-token']);
  getUser(req.headers['authorize-token'], (info) => {
    console.log('user info', info);
    if (info.login === 'Kevinabcabc') {

      req.pipe(unzipper.Extract({path: '../server/public/'}));
      req.on('close', () => {
        console.log('publish success!');
        res.end('publish success!');
      });
    }
  });

}

function getUser(token, cb) {
  let request = https.request({
    hostname: 'api.github.com',
    path: `/user`,
    port: 443,
    headers: {
      Authorization: `token ${token}`,
      "User-Agent": 'PJ-Server',
    },
    method: 'GET'
  }, function(response) {
    let body = ''
    response.on('data', chunk => {
      console.log('data chunk', chunk.toString());
      body = chunk.toString();
    });

    response.on('error', err => {
      console.log('error', err);
    });

    response.on('end', chunk => {
      console.log('auth res', body);
      cb(JSON.parse(body));
    });
  });
}


http.createServer(function (req, res) {
  console.log('req headers', req.headers);
  console.log('req url', req.url);

  if (req.url.match(/^\/favicon\.ico/)) {
    res.end();
    return;
  }

  if (req.url.match(/^\/auth\?/)) {
    return auth(req, res);
  }

  if (req.url.match(/^\/publish/)) {
    return publish(req, res);
  }
}).listen(8082, () => {
  console.log('ok 8082');
});