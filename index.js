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

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.ngsjczb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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


    const booksCollection = client.db('BookBeacon').collection('Books')

    // Endpoint to count books based on category/type
    app.get('/countBooks', async (req, res) => {
        const { category, search , publication,minPrice,maxPrice } = req.query;
        
        // Initialize query object
        const minPriceNum =  parseInt(minPrice);
        const maxPriceNum = parseInt(maxPrice)
      
          // Initialize query object
          const query = {};
          console.log(minPriceNum);
  
          if (minPriceNum !=="undefined" && maxPriceNum !== "undefined") {
              query.price = { $gte: minPriceNum, $lte: maxPriceNum };
          }



        if(publication){
            query.publication = publication
        }
    
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
        const { skip = 0, limit = 10, search, category, sort, publication,minPrice,maxPrice } = req.query;
        const skipNum = parseInt(skip);
        const limitNum = parseInt(limit);
      const minPriceNum =  parseInt(minPrice);
      const maxPriceNum = parseInt(maxPrice)
    
        // Initialize query object
        const query = {};
        console.log(minPriceNum);

        if (minPriceNum !=="undefined" && maxPriceNum !== "undefined") {
            query.price = { $gte: minPriceNum, $lte: maxPriceNum };
        }
    
        // Add category filter if provided

        if(publication){
            query.publication = publication
        }
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
            // Initialize sorting object
            const sortOptions = {};
    
            // Add sorting based on the sort query parameter
            if (sort) {
                if (sort === "priceLow") {
                    sortOptions.price = 1; // Sort by price in ascending order (low to high)
                } else if (sort === "priceHigh") {
                    sortOptions.price = -1; // Sort by price in descending order (high to low)
                } else if (sort === "newestDate") {
                    sortOptions.publicationDate = -1; // Sort by publication date in descending order (new to old)
                } else if (sort === "oldestDate") {
                    sortOptions.publicationDate = 1; // Sort by publication date in ascending order (old to new)
                }
            }
    
            const result = await booksCollection.find(query)
                .sort(sortOptions)
                .skip(skipNum)
                .limit(limitNum)
                .toArray();
    
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
