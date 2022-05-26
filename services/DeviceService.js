const DeviceRepo = require('../repositories/DeviceRepository');
const SensorRepo = require('../repositories/SensorRepository');
const DeviceValidators = require('../validators/DeviceValidator');

module.exports = {

    createDevice: async function createDevice(deviceName, address, description,  maxEnergyConsumption, averageEnergyConsumption) {
        const validationMessage = DeviceValidators.validate(deviceName, address, description, maxEnergyConsumption, averageEnergyConsumption)
        if (validationMessage === 'valid') {
            const isDeviceInDB = await DeviceRepo.searchByDeviceName(deviceName).then(device=>{
                return device
            })
            
            if(isDeviceInDB) {
                return "Device already exists !"
            } else {
                DeviceRepo.createDevice(deviceName, address, description, maxEnergyConsumption, averageEnergyConsumption)
                return "Device created sucessfully !"
            }
        }

        return validationMessage
    },


    getDevice: async function getDevice() {
        const devices = await DeviceRepo.getAllDevices()
        return devices
    },

    deleteDevice: async function deleteDevice(deviceName) {
        const sensor = await SensorRepo.findSensorByDeviceName(deviceName)
        
        if(sensor) {
            return 'A sensor is associated with this device. Please remove it before deleting this device.'
        } else {
            const device = await DeviceRepo.searchByDeviceName(deviceName);
            if(device) {
                await DeviceRepo.deleteDevice(deviceName)
                return 'Device deleted sucessfully !'
            } else {
                return "Device you are trying to delete does not exist !"
            }
        }
    },

    updateDevice: async function updateDevice(uuid, deviceName, address, description,  maxEnergyConsumption, averageEnergyConsumption) {
        const validationMessage = DeviceValidators.validate(deviceName, address, description,  maxEnergyConsumption, averageEnergyConsumption)

        if (validationMessage === 'valid') {
            
            const isDeviceInDB = await DeviceRepo.searchByDeviceName(deviceName).then(device=>{
                return device
            })
            
            // if the user & email we are trying to update are introduced in DB for another entry, we return error messages
            if(isDeviceInDB && isDeviceInDB.uuid !== uuid) {
                return 'Device already exists!'
            } else { // if the user & email introduced are not in DB, we create the user
                const updatedDevice = await DeviceRepo.updateDevice(uuid, deviceName, address, description,  maxEnergyConsumption, averageEnergyConsumption);
                if(updatedDevice[0] !== 0){
                    return 'Device updated sucessfully !'
                }
                return "UUID not found in DB !";
            }
        }
        
        return validationMessage
    },
    
    associateDeviceToSensor: async function associateDeviceToSensor(deviceName, sensorName){
        const device = await DeviceRepo.searchByDeviceName(deviceName);
        const sensor = await SensorRepo.searchBySensorName(sensorName);

        if(!device)
            return "Device doesn't exist"
        
        if(!sensor)
            return "Sensor doesn't exist"


        const isSensorAssociated = await SensorRepo.isSensorAssociated(sensorName);
        const isDeviceAssociated = await SensorRepo.isDeviceAssociated(deviceName);

        if(isDeviceAssociated)
            return "Device already associated to another sensor"
            
        if(isSensorAssociated)
            return "Sensor already associated to another device"
        
        await SensorRepo.associateDeviceToSensor(deviceName, sensorName)

        return "success";
    }

}   