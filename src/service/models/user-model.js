"use strict";

const {DataTypes, Model} = require(`sequelize`);
class User extends Model {}

const define = (sequelize) => User.init({
  userName: {
    type: DataTypes.STRING,
    allowNull: false
  },

  userSurname: DataTypes.STRING,

  userAvatar: DataTypes.STRING,

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  }

}, {
  sequelize,
  modelName: `User`,
  tableName: `users`
});

module.exports = define;
