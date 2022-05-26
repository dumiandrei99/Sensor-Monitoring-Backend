var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

module.exports = {

    isFieldEmpty: function isFieldEmpty(string) {
        if ( string == null || string.length < 3 )
            return true
        return false
    },

    isPasswordValid: function passwordCheck(string) {
        if(string == null || string.length < 7) {
            return true
        }
        return false
    },

    isEmailValid: function isEmailValid(email) {
        if (!email)
            return false;
    
        if(email.length>254)
            return false;
    
        var valid = emailRegex.test(email);
        if(!valid)
            return false;
    
        return true;
    },

    isNum: function isNum(string) {
        return !isNaN(string)
    },

    isBirthDateValid: function birthDate(string) {
        
        splitString = string.split('/')
        
        if(splitString.length === 3) {
            if( module.exports.isNum(splitString[0]) && module.exports.isNum(splitString[1]) && module.exports.isNum(splitString[2]) ) 
                return true
            return false
        }
        return false
    },


    validate: function validate(username, password, email, firstName, lastName, birthDate, address){
        
        if (module.exports.isFieldEmpty(username)) {
            return 'Username field must have at least 3 characters';
        }
        
        if(module.exports.isPasswordValid(password)) {
            return 'Password field must have at least 7 characters';
        }

        if(! module.exports.isEmailValid(email)) {
            return 'Email format is not valid';
        }

        if(module.exports.isFieldEmpty(firstName)) {
            return 'First name field must have at least 3 characters';
        }

        if(module.exports.isFieldEmpty(lastName)) {
            return 'Last name field must have at least 3 characters';
        }
        
        if(! module.exports.isBirthDateValid(birthDate)) {
            return 'Valid date format is DD/MM/YEAR, with only / inbetween';
        }
        
        if(module.exports.isFieldEmpty(address)) {
            return 'Address field must have at least 3 characters';
        }


        return 'valid';
    },

    validateNoPassword: function validateNoPassword(username, email, firstName, lastName, birthDate, address){
        
        if (module.exports.isFieldEmpty(username)) {
            return 'Username field must have at least 3 characters';
        }

        if(! module.exports.isEmailValid(email)) {
            return 'Email format is not valid';
        }

        if(module.exports.isFieldEmpty(firstName)) {
            return 'First name field must have at least 3 characters';
        }

        if(module.exports.isFieldEmpty(lastName)) {
            return 'Last name field must have at least 3 characters';
        }
        
        if(! module.exports.isBirthDateValid(birthDate)) {
            return 'Valid date format is DD/MM/YEAR, with only / inbetween or UTC format';
        }
        
        if(module.exports.isFieldEmpty(address)) {
            return 'Address field must have at least 3 characters';
        }


        return 'valid';
    }

}