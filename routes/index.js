const express = require('express');
const router = express.Router();
const axios = require('axios');

const pairs = [
    ['USD', 'JPY'],
    ['USD', 'GBP'],
    ['USD', 'SGD'],
    ['SGD', 'JPY']
]

async function fetchData(link) {    
    try {
        const response = await axios.get(link);
        return response;
    }
    catch (error) {
        console.error('Error:', error)
    }
}

//in this part of the code, the async function returns a promise. so the response has to be dealt with with a .then

const apiKey = "1GLJ4HTZ9LG7RPHF"

router.get("/", (req, res) => {

    const dataByPair = {};
// 
    const requests = pairs.map((pair) => {
        const url = `https://www.alphavantage.co/query?function=FX_WEEKLY&from_symbol=${pair[0]}&to_symbol=${pair[1]}&apikey=${apiKey}`;
        return fetchData(url).then((result) => {
            //return is required here because of arrap.map, fetchData(url) first returns a promise which is dealt with with a .then. so
            //for each result, it's dealing with the timeSeriesData that is gotten back.
            const timeSeriesData = result.data['Time Series FX (Weekly)'];
            if(timeSeriesData) {
                console.log("data gotten.")
            }
            else {
                console.log(timeSeriesData);
            }
            const pairKey = `${pair[0]}-${pair[1]}`;
            const data = [];

            const dateKeys = Object.keys(timeSeriesData).slice(0, 5);
            //gets the first 5 in the Time Series FX(Weekly) - this is because the date
            //is actually the key of the object.

            for (const date of dateKeys) {
                if(timeSeriesData.hasOwnProperty(date)) {
                    const entry = timeSeriesData[date];
                    //pulls the OHLC into entry
                    const { "1. open": open, "2. high": high, "3. low": low, "4. close": close } = entry;
                    data.push({
                        date,
                        open,
                        high,
                        low,
                        close,

                    });
                }
            }
            dataByPair[pairKey] = data;
        });
    });

    Promise.all(requests).then(() => {
        let dataArray = [];
        for (const pair in dataByPair) {
            if (dataByPair.hasOwnProperty(pair)) {
                const dates = dataByPair[pair];
                const dataObject = {pair, dates};
                dataArray.push(dataObject)
            };
        };
        res.render("index", {dataArray: dataArray});
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('an error occured');
    });

    });
    


module.exports = router;