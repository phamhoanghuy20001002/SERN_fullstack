'use strict';
const { INTEGER } = require('sequelize');
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class markdown extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            markdown.belongsTo(models.User, { foreignKey: 'doctorId' })

        }
    };
    markdown.init({
        contentHTML: DataTypes.TEXT('long'),
        contentMarkDown: DataTypes.TEXT('long'),
        doctorId: DataTypes.INTEGER,
        specialityId: DataTypes.INTEGER,
        clinicId: DataTypes.INTEGER,
        description: DataTypes.TEXT('long'),
    }, {
        sequelize,
        modelName: 'markdown',
    });
    return markdown;
};