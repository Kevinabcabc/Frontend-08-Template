const http = require("http");
const fs = require("fs");



const request = http.request({
  hostname: "127.0.0.1",
  port: 8200,
  method: 'POST',
  headers: {
    "Content-Type": "application/octet-stream", // 流
  }
}, (response) => {
  // console.log(1, response);
});


// let file = fs.createReadStream("./sample.jpg");
// let file = fs.createReadStream("./package.json");
let file = fs.createReadStream("./test.html");

file.on("data", trunk => {
  console.log(trunk.toString());
  request.write(trunk);
});

file.on("end", trunk => {
  console.log('read steam end');
  request.end(trunk);
});
