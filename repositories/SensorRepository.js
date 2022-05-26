const { Sensor } = require('../models');
const { MonitoredValue } = require('../models');
const { associateDeviceToSensor } = require('../services/DeviceService');

module.exports = {
    findSensorByDeviceName: function findSensorByDeviceName(deviceName) { 
        return Sensor.findOne({
            where:{
                deviceNameFK: deviceName
            }
        }).then(sensor =>{
            if(!sensor)
                return null;
            return sensor
        })
    },

    findSensorByUUID: function findSensorByUUID(uuid) { 
        return Sensor.findOne({
            where:{
                uuid: uuid
            }
        }).then(sensor =>{
            if(!sensor)
                return null;
            return sensor.sensorName
        })
    },

    getAllSensors: function getAllSensors() {
        return Sensor.findAll()
        .then(sensors=>{
            return sensors
        })   
        
    },

    searchBySensorName: function searchBySensorName(sensorName){
        return Sensor.findOne({
            where:{
                sensorName: sensorName
            }
        }).then(sensor =>{
            if(!sensor)
                return null;
            return sensor
        })
    },

    createSensor: function createSensor(sensorName, description, maxValue) {
        const sensor =  Sensor.create({sensorName, description, maxValue});
        return sensor;
    },

    deleteSensor: function deleteSensor(sensorName) {
        return Sensor.destroy({
            where: {
                sensorName: sensorName
            }
        })
    },

    updateSensor: function updateSensor(uuid, sensorName, description, maxValue) {
        return Sensor.update(
            {   
                sensorName: sensorName,
                description: description,
                maxValue: maxValue,
            },
            {
                where: {
                    uuid: uuid,
            }
        }).then(sensor=>{
            if(!sensor)
                return null;
            return sensor
        })   
    },

    isSensorAssociated: function isSensorAssociated(sensorName){
        return Sensor.findOne({
            where:{
                sensorName: sensorName
            }
        }).then(sensor =>{
            if(!sensor.deviceNameFK)
                return false;
            return true
        })
    },

    isDeviceAssociated: function isDeviceAssociate(deviceName){
        return Sensor.findOne({
            where:{
                deviceNameFK: deviceName,
            }
        }).then(sensor => {
            if(!sensor)
                return false
            return true
        })
    },

    associateDeviceToSensor: function associateDeviceToSensor(deviceName, sensorName){
        return Sensor.update(
            {   
                deviceNameFK: deviceName,
            },
            {
                where: {
                    sensorName: sensorName,
            }
        }).then(sensor=>{
            if(!sensor)
                return null;
            return sensor
        })   
    },

    insertSensorValue: function insertSensorValue(timestamp, energyConsumption, sensorUUID){
        
        const monitoredValue =  MonitoredValue.create({timestamp, energyConsumption, sensorUUID});
        return monitoredValue;
      
    },

    getSensorValues: function getSensorValues(sensorUUID) {
        return MonitoredValue.findAll({
            where: {
                sensorUUID: sensorUUID
            }
        })
        .then(monitoredValues=>{
            return monitoredValues
        })   
    }

}