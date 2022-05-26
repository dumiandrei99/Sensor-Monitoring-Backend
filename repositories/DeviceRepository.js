const { Device } = require('../models');
const { mapUserToDevice } = require('../services/UserService');

module.exports = {
    findDeviceByUsername: function findDeviceByUsername(username) {
        return Device.findOne({
            where:{
                usernameFK: username
            }
        }).then(device =>{
            if(!device)
                return null;
            return device
        })
    },

    searchByDeviceName: function searchByDeviceName(deviceName) {
        return Device.findOne({
            where:{
                deviceName: deviceName
            }
        }).then(device =>{
            if(!device)
                return null;
            return device
        })
    },

    createDevice: function createDevice(deviceName, address, description, maxEnergyConsumption, averageEnergyConsumption){
        const device =  Device.create({deviceName, address, description, maxEnergyConsumption, averageEnergyConsumption});
        return device;
    },

    
    getAllDevices: function getAllDevices() {
        return Device.findAll()
        .then(devices=>{
            return devices
        })   
    },

    deleteDevice: function deleteDevice(deviceName) {
        return Device.destroy({
            where: {
                deviceName: deviceName
            }
        })
    },

    updateDevice: function updateDevice(uuid, deviceName, address, description,  maxEnergyConsumption, averageEnergyConsumption){
        return Device.update(
            {   
                deviceName: deviceName,
                address: address,
                description: description,
                maxEnergyConsumption: maxEnergyConsumption,
                averageEnergyConsumption: averageEnergyConsumption,
            },

            {
                where: {
                    uuid: uuid,
            }
        }).then(device=>{
            if(!device)
                return null;
            return device
        })   
    },

    isDeviceMapped: function isDeviceMapped(deviceName){
        return Device.findOne({
            where:{
                deviceName: deviceName
            }
        }).then(device =>{
            if(!device.usernameFK)
                return false;
            return true
        })
    },

    mapUserToDevice: function mapUserToDevice(username, deviceName){
        return Device.update(
            {   
                usernameFK: username,
            },
            {
                where: {
                    deviceName: deviceName,
            }
        }).then(device=>{
            if(!device)
                return null;
            return device
        })   
    }

} 