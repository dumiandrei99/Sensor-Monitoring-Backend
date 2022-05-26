const SensorRepo = require('../repositories/SensorRepository');
const SensorValidator = require('../validators/SensorValidator');

module.exports ={

    getSensors: async function getSensors() {
        const sensors = await SensorRepo.getAllSensors();
        console.log(sensors)
        return sensors;
    },

    createSensor: async function createSensor(sensorName, description, maxValue) {
        const validationMessage = SensorValidator.validate(sensorName, description, maxValue);
        if(validationMessage === 'valid'){
            const isSensorInDB = await SensorRepo.searchBySensorName(sensorName).then(sensor=>{
                return sensor
            })

            if(isSensorInDB) {
                return "Sensor already exists !"
            } else {
                SensorRepo.createSensor(sensorName, description, maxValue)
                return "Sensor created sucessfully !" 
            }
        }
        return validationMessage
    },

    deleteSensor: async function deleteSensor(sensorName){
        const sensor = await SensorRepo.searchBySensorName(sensorName);
        if(sensor) {
            await SensorRepo.deleteSensor(sensorName)
            return 'Sensor deleted sucessfully !'
        } else {
            return "Sensor you are trying to delete does not exist !"
        }
    },

    updateSensor: async function updateSensor(uuid, sensorName, description, maxValue){
        const validationMessage = SensorValidator.validate(sensorName, description, maxValue);
        
        if(validationMessage === 'valid'){
            const isSensorInDB = await SensorRepo.searchBySensorName(sensorName).then(sensor=>{
                return sensor
            })
        
            if(isSensorInDB && isSensorInDB.uuid !== uuid) {
                return "Sensor already exists !"
            } else {
                const updatedSensor = await SensorRepo.updateSensor(uuid, sensorName, description, maxValue);
                if(updatedSensor[0] !== 0){
                    return 'Sensor updated sucessfully !'
                }
                return "UUID not found in DB !";
            }

        }

        return validationMessage
    },

    insertSensorValue: async function insertSensorValue(timestamp, energyConsumption, sensorUUID) {
        SensorRepo.insertSensorValue(timestamp, energyConsumption, sensorUUID);
    }


}