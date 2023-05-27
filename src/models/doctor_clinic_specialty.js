'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class D_C_S extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    D_C_S.init({


        doctorId: DataTypes.INTEGER,
        clinicId: DataTypes.INTEGER,
        specialtyID: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'D_C_S',
    });
    return D_C_S;
};