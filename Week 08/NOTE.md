学习笔记

# request

  POST / HTTP/1.1    // request line   method path http协议版本号
  Host:127.0.0.1   // headers
  Content-Type: ... // headers
  // 空行标志header 结束   换行 (\r\n)
  a=1&x=%3D1    // body  content-type 决定什么格式

# response 
  HTTP/1.1 200 OK  // status line  http协议版本号 http状态码 http状态文本  
  Content-Type: text/html   //header
  Date: Mon,23 Dec 2019 06:46:19 GMT   //header
  Connection: keep-alive   //header
  Transfer-Encoding: chunked   //header
    // 空行标志header 结束   换行 (\r\n)
  26    // body (由content type决定， 默认chunked body) 16进制
  <html><body>hello world</body></html>      // body
  0   // body 16进制
  
- 500服务器内部错误 301（永久移动） 302（临时移动） 304（未修改）

# http 请求第一步：

- 设计一个http请求
- content-type是一个必要字段需要默认值
- body 是 kv 格式
- 不同的content-type 影响的body格式

# send 函数总结第二步

- 在request构造器中收集必要信息
- 设计一个send函数把请求的真实内容发送到服务器
- send 函数是异步的所以返回Promise

# send 函数总结第三步

- 设计支持已有的connection或者自己新建connection
- 收到数据传给parser
- 根据parser状态resolve Promise

# send 函数总结第四步

- response 必须分段构造用一个 response parser 来装配
- response parser 分段处理response text 用状态及分析文本结构