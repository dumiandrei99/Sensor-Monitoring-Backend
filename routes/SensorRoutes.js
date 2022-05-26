const SensorService = require('../services/SensorService');
const rpc = require('../services/jsonRPC');

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
        //get sensors route
        app.get('/sensors', verifyJWT,async(req,res) => {
            try{
                const sensors = await SensorService.getSensors()
                return res.json(sensors)
            } catch(err) {
                return res.status(500).json(err);
            }
        })
    
        // create sensor route
        app.post('/createSensor', verifyJWT, async(req,res) => {
            const {sensorName, description, maxValue} = req.body;
            try{
                const sensor = await SensorService.createSensor(sensorName, description, maxValue);
                return res.json(sensor);
            } catch(err) { 
                return res.status(500).json(err);
            }
        })
    
        // delete sensor route
        app.post('/deleteSensor', verifyJWT, async(req,res) => {
            const {sensorName} = req.body;
            try{
                const message = await SensorService.deleteSensor(sensorName);
                return res.json(message)
            } catch (err) {
                return res.status(500).json(err)
            }
        })
    
        // update sensor route
        app.post('/updateSensor', verifyJWT, async(req,res) => {
            const {uuid, sensorName, description, maxValue} = req.body;
            try{
                const message = await SensorService.updateSensor(uuid, sensorName, description, String(maxValue));
                return res.json(message);
            } catch(err) { 
                return res.status(500).json(err);
            }
        })

        app.post('/measurement', async(req,res) => {
            const {uuid, timestamp, energyConsumption} = req.body;
            try{
                console.log("UUID: " + uuid);
                console.log("Timestamp: " + timestamp);
                console.log("Energy Consumption: " + energyConsumption);
                SensorService.insertSensorValue(timestamp, energyConsumption, uuid);
            } catch(err) { 
                return res.status(500).json(err);
            }
        })

        app.ws('/jsonRPC', rpc);
}