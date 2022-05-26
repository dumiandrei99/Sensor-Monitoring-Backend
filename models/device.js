const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Device extends Model{
        // Method called by index.js to make the actual mapping
        static associate(models){
            // define association here
        }
    };

    Device.init({

        uuid:{
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },

        deviceName:{
            type:DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey:true,
        },

        address:{
            type:DataTypes.STRING,
            allowNull: false, 
        },

        description:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        maxEnergyConsumption:{
            type:DataTypes.FLOAT,
            allowNull:false
        },
        averageEnergyConsumption:{
            type:DataTypes.FLOAT,
            allowNull:false
        },
    }, {
        sequelize, // connection instance
        tableName:'devices',
        modelName: 'Device' // Name of the model mapped in DB
    });

    Device.associate = model => {
        Device.belongsTo(model.User,{foreignKey:'usernameFK'});
        Device.hasOne(model.Sensor, {
            foreignKey:'deviceNameFK',
            onUpdate: "cascade",
        });
    }

    return Device;
};