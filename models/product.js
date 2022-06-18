module.exports = function (sequelize, DataTypes) {
  const product = sequelize.define("Product", {
    name: {
      //name의 글자길이 20까지 제한
      type: DataTypes.STRING(20),
      //data값을 안 넣어도 되는가를 결정. false는 무조건 있어야 한다는 뜻
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    seller: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
  });
  return product;
};
