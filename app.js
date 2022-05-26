const express = require('express');
const PORT = process.env.PORT || 5000;
const { sequelize, User } = require('./models');
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
const jwt = require('jsonwebtoken');


const app = module.exports = express();
const expressWs = module.exports = require('express-ws')(app);

app.use(express.json());
app.use(cors(corsOptions))
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    // handle OPTIONS method
    if ('OPTIONS' == req.method) {
        return res.sendStatus(200);
    } else {
        next();
    }
});

require ('./routes/UserRoutes')(app, jwt);
require ('./routes/DeviceRoutes')(app, jwt);
require ('./routes/SensorRoutes')(app, jwt);

app.get('/', async(req,res) => {
    try{
        return res.json("This is the backend")
    } catch(err) {
        return res.status(500).json(err);
    }
})

// doing the syncing with the models in the DB
app.listen(PORT, async() =>{
    console.log('Server up on port ' + PORT);
    await sequelize.sync({ alter: true })
    console.log("Database Synced");
})
