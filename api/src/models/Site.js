const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  
    sequelize.define('site', {
        // id: {
        //     type: DataTypes.UUID,
        //     defaultValue: DataTypes.UUIDV4,
        //     allowNull: false,
        //     primaryKey: true
        // },
        name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
        },
        country: {
            type: DataTypes.STRING,
            allowNull:false
        },
        city: {
            type: DataTypes.STRING,
            allowNull:false
        },
        street: {
            type: DataTypes.STRING,
            allowNull:false
        },
        streetNumber: {
            type: DataTypes.INTEGER,
            allowNull:false
        }
        ,
        latitude: {
            type: DataTypes.FLOAT,
            allowNull:false
        }
        ,
        longitude: {
            type: DataTypes.FLOAT,
            allowNull:false
        }
        
    })
}
