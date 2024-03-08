import AppController from '../controllers/AppController.js';
import DataController from '../controllers/DataController.js';


// Define routes
const mapRoutes = (app) => {
    app.get('/', AppController.getHomePage);
    app.get('/cot-table', AppController.getCotTablePage);
    app.get('/cot-table/:currency', DataController.fetchCotData);
}

export default mapRoutes;