'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Allcodes extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Allcodes.hasMany(models.User, { foreignKey: 'positionId', as: 'positionData' })
            Allcodes.hasMany(models.User, { foreignKey: 'gender', as: 'genderData' })
            Allcodes.hasMany(models.Schedule, { foreignKey: 'timeType', as: 'timeTypeData' })

            Allcodes.hasMany(models.Doctor_infor, { foreignKey: 'priceId', as: 'priceData' })
            Allcodes.hasMany(models.Doctor_infor, { foreignKey: 'provinceId', as: 'provinceData' })
            Allcodes.hasMany(models.Doctor_infor, { foreignKey: 'paymentId', as: 'paymentData' })

            // define association here
        }
    };
    Allcodes.init({
        keyMap: DataTypes.STRING,
        type: DataTypes.STRING,
        valueEN: DataTypes.STRING,
        valueVI: DataTypes.STRING,

    }, {
        sequelize,
        modelName: 'Allcodes',
    });
    return Allcodes;
};