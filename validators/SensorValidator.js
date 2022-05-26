module.exports = {

    isFieldEmpty: function isFieldEmpty(string) {
        if ( string == null || string.length < 3 )
            return true
        return false
    },

    isNum: function isNum(string) {
        return !isNaN(string)
    },

    isNumFieldEmpty: function isNumFieldEmpty(string) {
        if ( string == null || string.length < 1 )
            return true
        return false
    },

    validate: function validate (sensorName, description, maxValue) {

        if (module.exports.isFieldEmpty(sensorName)) {
            return 'Sensor name field must have at least 3 characters';
        }

        if (module.exports.isFieldEmpty(description)) {
            return 'Description field must have at least 3 characters';
        }

        if (module.exports.isNumFieldEmpty(maxValue)) {
            return 'Maximum value of energy consumption field must have at least 1 character';
        }

        if (! module.exports.isNum(maxValue)) {
            return 'Maximum value of energy consumption must be a number!';
        }

        return 'valid'
    }
}