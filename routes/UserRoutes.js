const UserService = require('../services/UserService');

module.exports = function(app, jwt) {

    const verifyJWT = (req, res, next) => {
        const token = req.header("x-access-token");
        if(!token) {
            res.send("Not authorized");
        } else {
            jwt.verify(token, "jwt", (err, decoded) => {
                if(err){
                    res.send({auth:false, message:"Failed to authenticate"});
                } else {
                    req.userId = decoded.id;
                    next();
                }
            })
        }
    }

    //get users route
    app.get('/users', verifyJWT, async(req,res) => {
        try{
            const users = await UserService.getUsers()
            return res.json(users)
        } catch(err) {
            return res.status(500).json(err);
        }
    })

    // create users route
    app.post('/createUser', async(req,res) => {
        const {username, password, email, firstname, lastname, birthDate, address} = req.body;
        try{
            const user = await UserService.createUser(username, password, email, firstname, lastname, birthDate, address);
            return res.json(user);
        } catch(err) { 
            return res.status(500).json(err);
        }
    })

    // delete user route
    app.post('/deleteUser', verifyJWT, async(req,res) => {
        const {username} = req.body;
        try{
            const message = await UserService.deleteUser(username);
            return res.json(message)
        } catch (err) {
            return res.status(500).json(err)
        }
    })

    // update user route
    app.post('/updateUser', verifyJWT, async(req,res) => {
        const {uuid, username, email, firstName, lastName, birthDate, address} = req.body;
        try{
            const message = await UserService.updateUser(uuid, username, email, firstName, lastName, birthDate, address);
            return res.json(message);
        } catch(err) { 
            return res.status(500).json(err);
        }
    })

    app.post('/loginUser', async(req, res) => {
        const {username, password} = req.body;
        try{
            const status = await UserService.loginUser(jwt, username, password);
            return res.json(status);
        } catch(err) { 
            return res.status(500).json(err);
        }
    })

    app.post('/map', verifyJWT,async(req,res) => {
        const{username, deviceName} = req.body;
        try{
            const status = await UserService.mapUserToDevice(username, deviceName);
            return res.json(status);
        } catch(err) { 
            return res.status(500).json(err);
        }
    })
}