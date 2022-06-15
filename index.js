var http = require("http");
var hostname = "127.0.0.1";
var port = 8080;

const server = http.createServer(function (req, res) {
  const path = req.url;
  const method = req.method;
  if (path === "/products") {
    if (method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      //   end함수의 첫번째 인자에는 string 함수가 들어가야 함.
      //   근데 여기서는 배열 형태이므로 string 형태로 바꿔줘야하는데 그것이 JSON.stringify
      const products = JSON.stringify([
        {
          name: "농구공",
          price: 5000,
        },
      ]);
      res.end(products);
    }
    // post는 주로 상품을 생성할 때 많이 사용
    else if (method === "POST") {
      res.end("생성 되었습니다!");
    }
  } else {
    res.end("Good Bye");
  }
});

server.listen(port, hostname);

console.log("grab market server on!");
