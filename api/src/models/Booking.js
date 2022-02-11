const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("booking", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title:{
      type: DataTypes.STRING,
      //allowNull: false,

    },
    startTime: {
      type: DataTypes.DATE,
      // allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      // allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
    },
    finalAmount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status:{  
      type: DataTypes.ENUM('created', 'processing', 'cancelled', 'completed'),
      allowNull: false
    },
    payment_id:{
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    payment_status:{
        type: DataTypes.STRING,
        defaultValue: ""
    },
    merchant_order_id: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    }
  });
};
