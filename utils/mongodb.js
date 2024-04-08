// mongodb.js
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://sarvag:mUsgWnuspL5CghIv@talentmapp.iks0k0t.mongodb.net/?retryWrites=true&w=majority&appName=talentmapp";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
 serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
 }
});

// Function to connect to the database and perform a query
async function connectToDatabaseAndQuery(query) {
 if (!client.isConnected()) {
    await client.connect();
 }

 const db = client.db("tm-mvp"); // Specify your database name here
 const collection = db.collection('profile'); // Specify your collection name here

 // Perform the query
 const result = await collection.find(query).toArray();

 return result;
}

// Export the function for use in your application
module.exports = { connectToDatabaseAndQuery };
