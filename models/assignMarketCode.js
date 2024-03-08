import { connectToMongo } from "./connectToMongo.js";


/**
 * @function assignMarketCode
 * Links the user selection with its given CFTC contract market code.
 * 
 * @module cottradeviz-2.0/assignMarketCode
 * @param {string} selectedCurrency - A string of the short name of a selectedCurrency
 * @returns {Promise<string>} The market code assigned to the selected currency.
 */
export const assignMarketCode = async (selectedCurrency) => {
    let marketCode = ''

    try {
        // Connect to mongoDB cluster and retrieve list of market codes and short names from instruments collection
        const client = await connectToMongo();
        const instrumentsColl = client.db('COTTradeViz').collection('instruments');
        const marketCodes = await instrumentsColl.find().project({
            '_id': 0,
            'name': 0,
            'classification': 0,
        }).toArray();
        console.log('Market codes successfully fetched from DB')
        client.close();

        // Loop through the fetched documents and assign market code accordingly
        for (const instrumentObject of marketCodes) {
            if (instrumentObject.short_name === selectedCurrency) {
                marketCode = instrumentObject.market_code;
                break;
            }
        }
        return marketCode;
    } catch (error) {
        throw error;
    }
}
