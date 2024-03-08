import compression from 'compression';
import cookieParser from 'cookie-parser';
import { dirname } from 'path';
import dotenv from 'dotenv';
import express from 'express';
import { fileURLToPath } from 'url';
import mapRoutes from './routes/index.js';
import { MongoClient, ServerApiVersion } from 'mongodb';
import morgan from 'morgan';
import path from 'path';



const app = express();
dotenv.config({ path: './config.env' });
const port = process.env.PORT || 3000;

// Convert import.meta.url to a file path
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirName = dirname(currentFilePath);
app.use('/public', express.static(path.join(currentDirName, "public")));

// Logger middleware (before session)
app.use(morgan('dev'));

// Static files middleware
// app.use(express.static(publicDirPath, { index: 'homepage.ejs' }));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression middleware
app.use(compression());

// Cookie parsing middleware
app.use(cookieParser());

// Setting wiev engine as EJS
app.set('view engine', 'ejs');

export const connectToMongo = async () => {
    const client = new MongoClient(process.env.MONGODB_CONN_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        console.log('Connection to MongoDB server established successfully');
        app.locals.mongoClient = client
    } catch (error) {
        console.error('Error connecting to MongoDB: ', error);
    }
}


mapRoutes(app);
const startServer = async () => {
    try {
        // Start Express server after connecting to MongoDB
        app.listen(port, () => {
            console.log(`Server has started and is listening on PORT http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

startServer();