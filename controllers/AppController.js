/**
 * Represents a class for controlling the app homepage
 * @module cottradeviz-2.0/controllers/AppController.js
 * @class
 */

/**
 * Renders the homepage
 * @param {Object} request - The HTTP request object
 * @param {Object} response - The HTTP response object
 */
class AppController {
    static getHomePage(request, response) {
        // Render the EJS file and send it as the response
        response.render('homepage');
    }

    static getCotTablePage(request, response) {
        response.render('cot-table', { showTable: false });
    }
}

export default AppController;