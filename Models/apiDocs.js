const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../Config/db');

const ApiDocs = sequelize.define("apiDocs", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    api_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    title: {
        type: DataTypes.STRING,
        unique: true
    },
    link: {
        type: DataTypes.TEXT('long'),
        allowNull: true,  // Allow null for link
    },
    short_desc: { 
        type: DataTypes.STRING,
        allowNull: true
    },
    bannerImage: {
        type: DataTypes.TEXT('long'),
        allowNull: true,  // Allow null for bannerImage
    },
    description: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    hooks: {
        beforeCreate: async (instance, options) => {
            const latestRecord = await ApiDocs.findOne({
                order: [['id', 'DESC']],
            });

            const nextSequence = latestRecord ? latestRecord.id + 1 : 1;
            instance.api_id = `API${String(nextSequence).padStart(4, '0')}`;
        },
    },
});

ApiDocs.sync()

module.exports = ApiDocs;
