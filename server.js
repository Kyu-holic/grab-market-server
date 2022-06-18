const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const multer = require("multer");
// 파일들을 어디에 저장할 것인지 dest를 통해 설정하면 uploads 파일이 생성됨. 반환되는 것들을 upload 변수로 지정
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, res, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname );
    },
  }),
});
const port = 8080;

app.use(express.json());
app.use(cors());

app.get("/products", (req, res) => {
  models.Product.findAll({
    // 정보가 수천가지라고 가정했을 때 findAll로 조회를 하게되면 엄청나게 느리고 비효율적으로 됨
    // 이를 막아주기 위해 limit를 걸어서 조회하면 그 갯수 만큼 잘라서 조회
    // limit: 1,

    // 정렬해줄 때 order 사용 DESC는 내림차순
    order: [["createdAt", "DESC"]],
    attributes: ["id", "name", "price", "createdAt", "seller", "imageUrl"],
  })
    .then((result) => {
      res.send({
        products: result,
      });
    })
    .catch((error) => {
      res.send("에러 발생");
    });
});

app.post("/products", (req, res) => {
  const body = req.body;
  const { name, description, price, seller } = body;
  // 아래 if 문은 하나라도 없으면 true가 되면서 전체 로직이 true가 된다. 그러면 아래 res.send 실행
  if (!name || !description || !price || !seller) {
    res.send("모든 필드를 입력해 주세요.");
  }
  // models의 Product에 아래 내용들을 생성하겠다는 뜻
  models.Product.create({
    name,
    description,
    price,
    seller,
  })
    .then((result) => {
      console.log("상품 생성 결과 : ", result);
      res.send({
        result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.send("상품 업로드에 문제가 생겼습니다.");
    });
});

app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  models.Product.findOne({
    where: {
      id,
    },
  })
    .then((result) => {
      console.log("PRODUCT : ", result);
      res.send({
        product: result,
      });
    })
    .catch((error) => {
      console.error(error);
      console.log("상품 조회에 에러가 발생했습니다.");
    });
});

// 이미지 파일을 하나 보냈을 때 사용되는 구문 single()
app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log(file);
  res.send({
    imageUrl: file.path,
  });
});

app.listen(port, () => {
  console.log("그랩의 쇼핑몰 서버가 돌아가고 있습니다.");
  // models에 모델링에 필요한 정보를 넣으면 sync를 시키는 것
  models.sequelize
    .sync()
    .then(() => {
      console.log("DB 연결 성공");
    })
    .catch((err) => {
      console.error(err);
      console.log("DB 연결 에러");
      process.exit();
    });
});
