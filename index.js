const express = require('express')
const cors = require('cors')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors())
app.use(express.json())
app.use(cookieParser())

const uri = "mongodb+srv://bannah76769:PVgRlyOvTFNd4ZnC@cluster0.ngsjczb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const booksCollection = client.db('BookBeacon').collection('Books')

    // Endpoint to count books based on category/type
    app.get('/countBooks', async (req, res) => {
        const { category, search } = req.query;
        
        // Initialize query object
        const query = {};
    
        // Add category filter if provided
        if (category) {
            query.category = category;
        }
    
        // Add search filter if provided
        if (search) {
            const searchRegex = new RegExp(search, 'i'); // 'i' for case-insensitive search
            query.$or = [
                { title: searchRegex },
                { author: searchRegex }
            ];
        }
    
        try {
            // Count the documents based on the constructed query
            const count = await booksCollection.countDocuments(query);
            res.send({ count });
        } catch (error) {
            console.error("Error counting books documents:", error);
            res.status(500).json({ message: 'Failed to count books documents', error });
        }
    });
    
    // Endpoint to get books with pagination and filtering by category/type
    app.get('/books', async (req, res) => {
        const { skip = 0, limit = 10, search, category } = req.query;
        const skipNum = parseInt(skip);
        const limitNum = parseInt(limit);
        
        // Initialize query object
        const query = {};
    
        // Add type filter if provided
        if (category) {
            query.category = category;
        }
    
        // Add search filter if provided
        if (search) {
            const searchRegex = new RegExp(search, 'i'); // 'i' for case-insensitive search
            query.$or = [
                { title: searchRegex },
                { author: searchRegex }
            ];
        }
    
        try {
            const result = await booksCollection.find(query).skip(skipNum).limit(limitNum).toArray();
            res.send(result);
        } catch (error) {
            console.error("Error fetching books:", error);
            res.status(500).json({ message: 'Failed to fetch books', error });
        }
    });
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('books store')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
