const UserRepo = require('../repositories/UserRepository');
const DeviceRepo = require('../repositories/DeviceRepository');
const UserValidators = require('../validators/UserValidator')
const UserDTO = require('../dtos/UserDTO')

module.exports = {

    createUser : async function createUser(username, password, email, firstname, lastname, birthDate, address) {

        // validating the input from the user in the backend
        const validationMessage = UserValidators.validate(username, password, email, firstname, lastname, birthDate, address)

        if (validationMessage === 'valid') {

            // logic to transform date of birth sent from the user to UTC
            splitDate = birthDate.split("/")
            UTCDate = Date.UTC(splitDate[2], splitDate[1] - 1, splitDate[0])

            // check if the username is in DB
            const isUserNameInDB = await UserRepo.searchUserByUsername(username).then(user=>{
                return user
            })

            //check if the email is in DB
            const isEmailInDB = await UserRepo.searchUserByEmail(email).then(user=>{
                return user
            })

            // if the user & email introduced are in DB, we return error messages
            if(isUserNameInDB) {
                return 'Username already exists!'
            } else if (isEmailInDB) { // error message if the user exists in the DB
                return 'Email already exists!'
            } else { // if the user & email introduced are not in DB, we create the user
                UserRepo.createUser(username, password, email, 'false', firstname, lastname, UTCDate, address);
                return 'User created successfully !'
            }
            
        }
        // error message if the user did not introduce the right format for certain fields
        return validationMessage
    },

    getUsers: async function getUsers() {
        const users = await UserRepo.getAllUsers()
        var usersDTO = Array.apply(null, Array(users.length)).map(function () {})
        
        users.forEach((user, index) => {
            usersDTO[index] = UserDTO.toDTO(user)
        })
        return usersDTO
    },

    deleteUser: async function deleteUser(username) { 
        const device = await DeviceRepo.findDeviceByUsername(username)
        if(device) {
            return 'At least one device is associated with this username. Please remove all devices for this user before deleting it.'
        } else {
            await UserRepo.deleteUser(username)
            return 'User deleted sucessfully !'
        }
    },

    updateUser: async function updateUser(uuid, username, email, firstname, lastname, birthDate, address) {
        const validationMessage = UserValidators.validateNoPassword(username, email, firstname, lastname, birthDate, address)

        if (validationMessage === 'valid') {

            // logic to transform date of birth sent from the user to UTC
            splitDate = birthDate.split("/")
            UTCDate = Date.UTC(splitDate[2], splitDate[1] - 1, splitDate[0])
            
            //andrei9921 -> andrei99213
            const isUserNameInDB = await UserRepo.searchUserByUsername(username).then(user=>{
                return user
            })
            
            //check if the email is in DB
            const isEmailInDB = await UserRepo.searchUserByEmail(email).then(user=>{
                return user
            })

            // if the user & email we are trying to update are introduced in DB for another entry, we return error messages
            if(isUserNameInDB && isUserNameInDB.uuid !== uuid) {
                return 'Username already exists!'
            } else if (isEmailInDB && isEmailInDB.uuid !== uuid) { // error message if the user exists in the DB
                return 'Email already exists!'
            } else { // if the user & email introduced are not in DB, we create the user
                const updatedUser = await UserRepo.updateUser(uuid, username, email, 'false', firstname, lastname, UTCDate, address);
                if(updatedUser[0] !== 0){
                    return 'User updated sucessfully !'
                }
                return "UUID not found in DB !";
            }
        }   
        return validationMessage
    },

    loginUser: async function loginUser(jwt, username, password){
        const user = await UserRepo.searchUserByUsername(username).then(user=>{
            return user
        })

        if(user) {
            const doesPasswordMatch = await UserRepo.searchUserByUsernameAndPassword(username,password).then(user => {
                return user
            })

            if (doesPasswordMatch){
                const id = user.uuid;
                const token = jwt.sign({id}, "jwt", {
                    expiresIn: 300,
                })
                const isAdmin = await UserRepo.findAdminRightsByUsername(username);
                if(isAdmin){
                    return ({auth: true, token: token, role: "ADMIN"});
                } else {
                    return ({auth: true, token: token, role: "REGULAR"});
                }
            }
            return ({auth:false,token:'-', role:"The username and password combination is incorrect"});
        }
        return ({auth:false, token:'-',role:"Username doesn't exist!"});
    },

    mapUserToDevice: async function mapUserToDevice(username, deviceName) {
        const user = await UserRepo.searchUserByUsername(username);
        const device = await DeviceRepo.searchByDeviceName(deviceName);

        const devices = await DeviceRepo.getAllDevices();
        for(let i = 0; i < devices.length; i ++) {
            console.log(devices[i].deviceName);
        }

        if(!user)
            return "User doesn't exist"
        
        if(!device)
            return "Device doesn't exist"
        
        const isDeviceMapped = await DeviceRepo.isDeviceMapped(deviceName)
        
        if(isDeviceMapped)
            return "Device is already mapped to an user";
        
        await DeviceRepo.mapUserToDevice(username, deviceName);
        return "success"
    }
}