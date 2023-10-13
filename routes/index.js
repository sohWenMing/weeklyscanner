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

const apiKey = "1GLJ4HTZ9LG7RPHF"

router.get("/", (req, res) => {

    const dataByPair = {};

    const requests = pairs.map((pair) => {
        const url = `https://www.alphavantage.co/query?function=FX_WEEKLY&from_symbol=${pair[0]}&to_symbol=${pair[1]}&apikey=${apiKey}`;
        return fetchData(url).then((result) => {
            const timeSeriesData = result.data['Time Series FX (Weekly)'];
            const pairKey = `${pair[0]}-${pair[1]}`;

            const data = [];

            const dateKeys = Object.keys(timeSeriesData).slice(0, 5);

            for (const date of dateKeys) {
                if(timeSeriesData.hasOwnProperty(date)) {
                    const entry = timeSeriesData[date];
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
        for (data of dataArray) {
            console.log("fresh data here");
            console.log(data);
        }
        res.render("index", {dataArray: dataArray});
    })
    .catch(err => {
        console.log(err);
        res.status(500).send(err);
    });

    });
    


module.exports = router;