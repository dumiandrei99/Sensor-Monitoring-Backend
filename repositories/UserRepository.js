const { User } = require('../models');

module.exports = {

    createUser:  function createUser(username, password, email, isAdmin, firstName, lastName, birthDate, address){
        const user =  User.create({username, password, email, isAdmin, firstName, lastName, birthDate, address});
        return user;
    },

    searchUserByUsername: function searchUserByUsername(username) {
        return User.findOne({
            where:{
                username: username
            }
        }).then(user =>{
            if(!user)
                return null;
            return user
        })
    },

    searchUserByEmail: function searchUserByEmail(email) {
        return User.findOne({
            where:{
                email: email
            }
        }).then(user =>{
            if(!user)
                return null;
            return user
        })
    },

    getAllUsers: function getAllUsers() {
        return User.findAll()
        .then(users=>{
            return users
        })   
    },

    deleteUser: function deleteUser(username) {
        return User.destroy({
            where: {
                username: username
            }
        })
    },

    updateUser: function updateUser(uuid, username, email, isAdmin, firstName, lastName, birthDate, address) {
        return User.update(
            {   
                username: username,
                email: email,
                isAdmin: isAdmin,
                firstName: firstName,
                lastName: lastName,
                birthDate: birthDate,
                address: address
            },

            {
                where: {
                    uuid: uuid,
            }
        }).then(user=>{
            if(!user)
                return null;
            return user
        })   
    },

    searchUserByUsernameAndPassword: function searchUserByUsernameAndPassword(username, password) {
        return User.findOne({
            where:{
                username: username,
                password: password
            }
        }).then(user =>{
            if(!user)
                return null;
            return user
        })
    },

    findAdminRightsByUsername: function findAdminRightsByUsername (username){
        return User.findOne({
            where:{
                username: username,
            }
        }).then(user =>{
            if(!user)
                return null;
            return user.isAdmin
        })
    }
}