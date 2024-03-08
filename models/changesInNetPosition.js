import { connectToMongo } from "./connectToMongo.js";


/**
 * @function computeChangesinNetPosition
 * Fetches changes in net positions for all instruments from the latest weekly report.
 * 
 * @returns {Promise<Object[string]>} An array of strings containing the changes in net positions.
 */
export const computeChangesinNetPosition = async () => {
    const changesInNetPosition = [];
    const client = await connectToMongo();

    try {
        // Fetch the market codes from the DB
        const instrumentsColl = client.db('COTTradeViz').collection('instruments');
        const marketCodes = await instrumentsColl.find().project({
            '_id': 0,
            'name': 0,
            'classification': 0,
        }).toArray();

        // Fetch the COT data from the DB
        const options = {
            sort: { 'data.reportWeek': -1 }, // Allows retrieval of the latest report week's data
            projection: {
                '_id': 0,
                'data.date': 1,
                'data.currencyName': 1,
                'data.marketCode': 1,
                'data.chngLongPos': 1,
                'data.chngShortPos': 1,
            },
        };
        const cotDataColl = client.db('COTTradeViz').collection('cot_data_2024');
        const cotData = await cotDataColl.findOne({}, options);

        // Iterate through both data sets and link each change in net positions figure to its associated instrument
        cotData.data.forEach(document => {
            let shortName = ''
            for (const instrument of marketCodes) {
                if (document.marketCode === instrument.market_code) {
                    shortName = instrument.short_name;
                    break;
                }
            };
            const changeInNetPosition = (parseInt(document.chngLongPos)) - (parseInt(document.chngShortPos));
            changesInNetPosition.push(`${shortName} -> ${changeInNetPosition}`);
        });
        console.log(changesInNetPosition);
        return changesInNetPosition;
    } catch (error) {
        throw error;
    } finally {
        client.close();
    }
};