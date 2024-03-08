import dotenv from 'dotenv';
import { env } from 'process';
import { MongoClient, ServerApiVersion } from 'mongodb';


// Set path to .env file
dotenv.config({ path: '../.env' });


/**
 * @function connectToMongo
 * Establishes a connection to MongoDB cluster.
 * 
 * @module cottradeviz-2.0/models
 * @throws {Error} Will throw an error if there was an error connecting to the cluster.
 * @returns {Promise<MongoClient>} A promise that resolves to a MongoClient object upon successful connection.
 */
export const connectToMongo = async () => {
    const client = new MongoClient(env.MONGODB_CONN_URI || 'mongodb+srv://Kaygeea:F8RFiyR7z4dYmIhM@cottradeviz1.irtd55g.mongodb.net/?retryWrites=true&w=majority&appName=cottradeviz1', {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    try {
        await client.connect();
        console.log('Connection to MongoDB cluster established successfully');
        return client;
    } catch (error) {
        throw new Error('Error connecting to MongoDB: ', error);
    }
};
