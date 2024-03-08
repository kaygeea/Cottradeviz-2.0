import { connectToMongo } from "./connectToMongo.js";
import { assignMarketCode } from "./assignMarketCode.js";


/**
 * @function fetchCotData
 * Fetches all available COT Data for a particular selected currency.
 * 
 * @returns {Promise<Object[]>} An array of objects containing the COT data for the given instrument.
 */
export const fetchCotData = async (selectedCurrency) => {
    // Define function variables
    let ArrOfCotData = [];
    const marketCode = await assignMarketCode(selectedCurrency);
    const cotUrl = 'https://publicreporting.cftc.gov/resource/jun7-fc8e.json';
    const header = { 'X-App-Token': 'OvQJx8soXa21Iwes5jdJMFmVh' };

    const apiQueryString = `?$where=cftc_contract_market_code in ('${marketCode}')&$order=report_date_as_yyyy_mm_dd&$limit=100000`;
    const COTEndpoint = cotUrl + apiQueryString;

    try {
        const response = await fetch(COTEndpoint, { header })
        if (!response.ok) {
            throw new Error('Network response was not okay. Please try again later.')
        }
        const jsonCOT = await response.json();

        // Parse COT data
        for (const cotData of jsonCOT) {
            const netPositions = (parseInt(cotData.noncomm_positions_long_all)) -
                (parseInt(cotData.noncomm_positions_short_all));
            const chngNetPos = (parseInt(cotData.change_in_noncomm_long_all)) -
                (parseInt(cotData.change_in_noncomm_short_all));
            const date = `${new Date(cotData.report_date_as_yyyy_mm_dd).toDateString().slice(4, 15)}`;
            const cotObject = {
                date,
                reportWeek: cotData.yyyy_report_week_ww,
                currencyName: cotData.commodity_name,
                marketCode: cotData.cftc_contract_market_code,
                longPos: parseInt(cotData.noncomm_positions_long_all),
                shortPos: parseInt(cotData.noncomm_positions_short_all),
                chngLongPos: parseInt(cotData.change_in_noncomm_long_all),
                chngShortPos: parseInt(cotData.change_in_noncomm_short_all),
                chngNetPos,
                pctLongPos: parseInt(cotData.pct_of_oi_noncomm_long_all),
                pctShortPos: parseInt(cotData.pct_of_oi_noncomm_short_all),
                numLongTraders: parseInt(cotData.traders_noncomm_long_all),
                numShortTraders: parseInt(cotData.traders_noncomm_short_all),
                netPositions,
            }
            ArrOfCotData.push(cotObject);
        }
        return ArrOfCotData;
    } catch (error) {
        throw new Error('Error encountered while attempting to fetch data:', error);
    }
};
