const DeviceService = require('../services/DeviceService');

module.exports = function(app, jwt){
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
        //get devices route
        app.get('/devices', verifyJWT, async(req,res) => {
            try{
                const devices = await DeviceService.getDevice()
                return res.json(devices)
            } catch(err) {
                return res.status(500).json(err);
            }
        })
    
        // create devices route
        app.post('/createDevice', verifyJWT, async(req,res) => {
            const {deviceName, address, description,  maxEnergyConsumption, averageEnergyConsumption} = req.body;
            try{
                const device = await DeviceService.createDevice(deviceName, address, description,  maxEnergyConsumption, averageEnergyConsumption);
                return res.json(device);
            } catch(err) { 
                return res.status(500).json(err);
            }
        })
    
        // delete device route
        app.post('/deleteDevice', verifyJWT, async(req,res) => {
            const {deviceName} = req.body;
            try{
                const message = await DeviceService.deleteDevice(deviceName);
                return res.json(message)
            } catch (err) {
                return res.status(500).json(err)
            }
        })
    
        // update device route
        app.post('/updateDevice', verifyJWT, async(req,res) => {
            const {uuid, deviceName, address, description,  maxEnergyConsumption, averageEnergyConsumption} = req.body;
            try{
                const message = await DeviceService.updateDevice(uuid, deviceName, address, description, String(maxEnergyConsumption), String(averageEnergyConsumption));
                return res.json(message);
            } catch(err) { 
                return res.status(500).json(err);
            }
        })

        // associate device to sensor
        app.post('/associate', verifyJWT, async(req,res) => {
            const {deviceName, sensorName} = req.body;
            try{
                const status = await DeviceService.associateDeviceToSensor(deviceName, sensorName);
                return res.json(status);
            } catch(err) { 
                return res.status(500).json(err);
            }
        })
}