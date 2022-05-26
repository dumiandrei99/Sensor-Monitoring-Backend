const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Sensor extends Model{
        // Method called by index.js to make the actual mapping
        static associate(models){
            // define association here
        }
    };

    Sensor.init({
        uuid:{
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey:true,
        },

        sensorName:{
            type:DataTypes.STRING,
            allowNull:false,
            unique: true,
        },

        description:{
            type:DataTypes.STRING,
            allowNull:false,
        },

        maxValue:{
            type:DataTypes.FLOAT,
            allowNull:false
        },
    }, {
        sequelize, // connection instance
        tableName:'sensors',
        modelName: 'Sensor' // Name of the model mapped in DB
    });

    Sensor.associate = model => {
        Sensor.belongsTo(model.Device,{foreignKey:'deviceNameFK'});
        Sensor.hasOne(model.MonitoredValue, {
            foreignKey:'sensorUUID',
            onDelete:'cascade',
            onUpdate:'cascade',
        });
    }

    return Sensor;
};