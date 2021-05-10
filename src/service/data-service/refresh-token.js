'use strict';

class RefreshTokenService {
  constructor(sequelize) {
    this._RefreshToken = sequelize.models.RefreshToken;
  }

  async add(userId, token) {
    const newToken = await this._RefreshToken.create({userId, token});
    return newToken.get();
  }

  async find(userId) {
    const user = await this._RefreshToken.findOne({where: {userId}});
    return user;
  }

  async delete(userId) {
    const deletedRows = await this._RefreshToken.destroy({
      where: {userId}
    });
    return !!deletedRows;
  }
}

module.exports = RefreshTokenService;
