const http = require("http");
const fs = require("fs");

http.createServer(function (req, res) {
  console.log(33, req.headers);


  let outFile =  fs.createWriteStream('../server/public/index.html')


  req.on('data', (trunk) => {
    console.log(11,trunk.toString());

    outFile.write(trunk);
  });

  req.on('end', (trunk) => {
    console.log(22,trunk);

    trunk && outFile.write(trunk);
    outFile.end();
    res.end('success');
  })

}).listen(8082, () => {
  console.log('ok 8082');
});