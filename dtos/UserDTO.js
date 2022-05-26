module.exports = {

    toDTO: function toDTO(user) { 
        return {
            uuid: user.uuid,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            birthDate: user.birthDate,
            address: user.address
        }
    }
}