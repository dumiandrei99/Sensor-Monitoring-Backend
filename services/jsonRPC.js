const { json } = require('body-parser');
const { parse } = require('pg-protocol');
const SensorRepo = require('../repositories/SensorRepository');

const send = (rpc, data) => {
    const dataToSend = JSON.stringify({
        jsonrpc: '2.0',
        ...data
    });
    rpc.send(dataToSend);
}

const getDayFromTimestamp = (timestamp) => {
    const splitTimestamp = timestamp.split(' ');
    const day = splitTimestamp[2]
    return day
}

const getHourFromTimestamp = (timestamp) => { 
    const splitTimestamp = timestamp.split(' ');
    const hour = splitTimestamp[4]
    return hour
}

const getMonthFromTimestamp = (timestamp) => { 
    const splitTimestamp = timestamp.split(' ');
    const month = splitTimestamp[1]
    return month
}


const getEnergyConsumptionAndDayAndHour = (data) => {
    
    let energyConsumptionAndDayAndHour = [];
    const jsonData = JSON.stringify(data)
    const parsedData = JSON.parse(jsonData)


    for (let i = 0 ; i < parsedData.length; i++) {
        
        let day = getDayFromTimestamp(parsedData[i].timestamp);
        let month = getMonthFromTimestamp(parsedData[i].timestamp);
        let hour = getHourFromTimestamp(parsedData[i].timestamp);

        energyConsumptionAndDayAndHour.push({
            'day' : day,
            'month' : month,
            'hour' : hour,
            'energyConsumption' : parsedData[i].energyConsumption
        });
    }

    return energyConsumptionAndDayAndHour;
}


const getMedianPerDayAndHour = (energyConsumptionAndDayAndHour) => {

    // salvam cate date diferite avem in DB pentru masuratorile senzorilor
    let days = [];
    let months = [];
    let medianPerHourAndDay = [];

    for(let i = 0 ; i < energyConsumptionAndDayAndHour.length; i++) {

        if ( !days.includes(energyConsumptionAndDayAndHour[i].day) ) {
            days.push(energyConsumptionAndDayAndHour[i].day)
        }

        if ( !months.includes(energyConsumptionAndDayAndHour[i].month) ) {
            months.push(energyConsumptionAndDayAndHour[i].month);
        }
    }

    for (let i = 0 ; i < days.length; i ++) {
        
        // initializam vectorii de frecventa hours si timesMeasuredAtHour
        let hours = [24];
        let timesMeasuredAtHour = [24];

        // punem 0 la fiecare valoare, de fiecare data cand intram intr-o noua zi
        for (let k = 0 ; k < 24 ; k++) {
            hours[k] = 0;
            timesMeasuredAtHour[k] = 0;
        }

        // pentru fiecare valoare a lui energyConsumptionAndDayAndHour din datele primite
        for (let j = 0 ; j < energyConsumptionAndDayAndHour.length; j++) { 
            // verificam daca valoarea pentru day si month a energyConsumptionAndDayAndHour[i] este aceeasi cu ziua si luna la care ne aflam momentan 
            if(days[i] === energyConsumptionAndDayAndHour[j].day && months.includes(energyConsumptionAndDayAndHour[j].month)) {
                let splitHourArray = energyConsumptionAndDayAndHour[j].hour.split(':');
                // parsam ora la care ne aflam, pentru a avea 0 / 1 / 2 .. / 23 in loc de o ora intreaga precum 13:45:32
                let hour = parseInt(splitHourArray[0])
                //salvam in cei doi vectori de frecventa valoarea de energyConsumption si de cate ori au aparut valori pentru o anumita ora, pentru a face mai apoi media
                hours[hour] += energyConsumptionAndDayAndHour[j].energyConsumption;
                timesMeasuredAtHour[hour] ++;
            }
        }

        for(let j = 0 ; j < 24; j++){
            // initializam timesMeasuredAtHour[j] cu 1 in cazul in care nici o valoare nu a fost masurata la ora respectiva, pentru a putea face mai jos impartirea.
            if ( timesMeasuredAtHour[j] === 0) {
                timesMeasuredAtHour[j] = 1;
            }

            medianPerHourAndDay.push({
                'day': days[i],
                'month': energyConsumptionAndDayAndHour[j].month,
                'hour': j,
                'energyConsumptionMedian': hours[j] / timesMeasuredAtHour[j]
            })
        }
    }

    return medianPerHourAndDay
} 


module.exports = (rpc, req) => {

    rpc.on('message', async (sensorUUID) => {
        const data = await SensorRepo.getSensorValues(sensorUUID)
        console.log(data);
        const energyConsumptionAndDayAndHour = getEnergyConsumptionAndDayAndHour(data)
        const medianPerDayAndMonthAndHour = getMedianPerDayAndHour(energyConsumptionAndDayAndHour);


        send(rpc, {id: sensorUUID, medianPerDayAndMonthAndHour: medianPerDayAndMonthAndHour, result: {status: 'success'}})
    })
}