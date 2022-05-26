const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MonitoredValue extends Model{
        // Method called by index.js to make the actual mapping
        static associate(models){
            // define association here
        }
    };

    MonitoredValue.init({

        uuid:{
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey:true,
        },
        timestamp:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        energyConsumption:{
            type:DataTypes.FLOAT,
            allowNull:false
        },
    }, {
        sequelize, // connection instance
        tableName:'monitored_values',
        modelName: 'MonitoredValue' // Name of the model mapped in DB
    });

    MonitoredValue.associate = model => {
        MonitoredValue.belongsTo(model.Sensor, {foreignKey:'sensorUUID'});
    }

    return MonitoredValue;
};