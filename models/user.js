
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model{
        // Method called by index.js to make the actual mapping
        static associate(models){
            // define association here
        }
    };

    User.init({

        uuid:{
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        username:{
            type:DataTypes.STRING,
            allowNull:false,
            primaryKey:true,
            unique:true,
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false
        },
        isAdmin:{
            type:DataTypes.BOOLEAN,
            allowNull:false
        },
        firstName:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName:{
            type: DataTypes.STRING,
            allowNull:false,
        },
        birthDate:{
            type:DataTypes.DATE,
            allowNull:false
        },
        address:{
            type:DataTypes.STRING,
            allowNull:false
        },
    }, {
        sequelize, // connection instance
        tableName:'users',
        modelName: 'User' // Name of the model mapped in DB
    });

    User.associate = model => {
        User.hasMany(model.Device,{
            foreignKey:'usernameFK',
            onUpdate: "cascade",
        });
    }

    return User;
};