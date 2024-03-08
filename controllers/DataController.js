import { connectToMongo } from '../models/connectToMongo.js';
import { assignMarketCode } from '../models/assignMarketCode.js';
import { fetchCotData } from '../models/fetchCotData.js';
// import { changesInNetPosition } from '../models/changesInNetPosition.js';

// Define a variable to store fetched data for selectHistoricCotDatapoint method
let cachedData = null;


/**
 * Represents a class for controlling data through out the app.
 * @module cottradeviz-2.0/controllers/DataController.js
 * @class
 */
class DataController {
    /**
     * Fetch COT data from the database
     * @param {Object} request - The HTTP request object.
     * @param {Object} response - The HTTP response object.
     * @returns {Object} An object containing the COT data fetched based on market code.
     */
    static async fetchCotData(request, response) {
        const selectedCurrency = request.params.currency;
        const marketCode = await assignMarketCode(selectedCurrency);
        const headerProperties = ['Date', 'Long Positions', 'Short Positions',
            '+/- Longs', '+/- Shorts', '% long', '% short', 'Net Positions']
        try {
            const client = await connectToMongo();
            const cotDataColl = client.db('COTTradeViz').collection('cot_data_2024');

            const cotData = await cotDataColl.aggregate([
                {
                    $project: {
                        filteredData: {
                            $filter: {
                                input: '$data',
                                as: 'item',
                                cond: { $eq: ['$$item.marketCode', marketCode] }
                            }
                        }
                    }
                }
            ]).project({
                '_id': 0,
                'year': 0,
                'week': 0,
                'classification': 0,
                'filteredData.currencyName': 0,
                'filteredData.marketCode': 0,
                'filteredData.numLongTraders': 0,
                'filteredData.numShortTraders': 0,
            }).sort({ 'filteredData.reportWeek': 1 }).toArray();

            client.close();

            response.render('cot-table', { showTable: true, headerProperties, cotData });
        } catch (error) {
            throw error('Error encountered while trying to fetch COT data');
        }
    }

    /**
     * Feeds COT data to the historic data visualiser.
     * @param {Object} request - The HTTP request object.
     * @param {Object} response - The HTTP response object
     */
    static async selectHistoricCotDatapoint(request, response) {
        if (!cachedData || cachedData.currency !== request.params.currency) {
            // Fetch data only when the currency changes or if data is not cached
            cachedData = {
                currency: request.body.currency,
                data: await fetchCotData(request.body.currency)
            };
        }

        const reqDataPoint = request.body.datapoint;
        const arrOfDataPoint = [];

        // Extract the requested data point from cached data
        cachedData.data.forEach((dataObject) => {
            arrOfDataPoint.push(dataObject[reqDataPoint]);
        });

        // Respond with the extracted data points
        response.send(arrOfDataPoint);
    }
}

export default DataController;