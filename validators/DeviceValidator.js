module.exports = {

    isFieldEmpty: function isFieldEmpty(string) {
        if ( string == null || string.length < 3 )
            return true
        return false
    },

    isNumFieldEmpty: function isNumFieldEmpty(string) {
        if ( string == null || string.length < 1 )
            return true
        return false
    },

    isNum: function isNum(string) {
        return !isNaN(string)
    },

    validate: function validate(deviceName, address, description, maxEnergyConsumption, averageEnergyConsumption) {
                
        if (module.exports.isFieldEmpty(deviceName)) {
            return 'Device name field must have at least 3 characters';
        }
        
        if(module.exports.isFieldEmpty(description)) {
            return 'Description field must have at least 3 characters';
        }

        if(module.exports.isFieldEmpty(address)) {
            return 'Address field must have at least 3 characters';
        }

        if(module.exports.isNumFieldEmpty(maxEnergyConsumption)) {
            return 'Maximum Energy Consumption field must have at least 1 character';
        }

        if(module.exports.isNumFieldEmpty(averageEnergyConsumption)) {
            return 'Average Energy Consumption field must have at least 1 character';
        }

        if(!module.exports.isNum(maxEnergyConsumption)){
            return 'Value for Maximum Energy Consumption must be a number!'
        }

        if(!module.exports.isNum(averageEnergyConsumption)){
            return 'Value for Average Energy Consumption must be a number!'
        }

        return "valid";
    }
}