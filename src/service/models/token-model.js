"use strict";

const {DataTypes, Model} = require(`sequelize`);
class RefreshToken extends Model {}

const define = (sequelize) => RefreshToken.init({
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize,
  modelName: `RefreshToken`,
  tableName: `refreshTokens`
});

module.exports = define;
