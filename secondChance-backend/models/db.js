require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

// MongoDB connection URL with authentication options
const url = process.env.MONGO_URL;
const dbName = process.env.MONGO_DB;

let dbInstance = null;

async function connectToDatabase() {
    if (dbInstance) {
        return dbInstance;
    }

    const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Task 1: Connect to MongoDB
    await client.connect();
    console.log("Connected successfully to MongoDB");

    // Task 2: Connect to the specified database and store in dbInstance
    dbInstance = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);

    // Task 3: Return the database instance
    return dbInstance;
}

module.exports = connectToDatabase;
