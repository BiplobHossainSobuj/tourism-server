const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = "mongodb+srv://tourism-management:QDgVpIll2iZBmGNv@cluster0.bswbr7l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bswbr7l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const database = client.db('tourism-management-DB');
    const touristSpotCollection = database.collection('tourists-spots');
    const contriesCollection = database.collection('countries');
    const userCollection = database.collection('users');
    
    app.get('/countries',async(req,res)=>{
      const cursor = contriesCollection.find();
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);
    })
    app.get('/countries/:country_Name',async(req,res)=>{
      const country_Name= req.params.country_Name;
      const query = {country_Name:country_Name}
      const cursor = touristSpotCollection.find(query);
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);
    })
    
    app.get('/mylist/:email', async (req, res) => {
      const email = req.params.email;
      const query = { user_email: email };
      const result = await touristSpotCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    })
    app.get('/update/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.findOne(query);
      console.log(result);
      res.send(result);
    })
    app.put('/update/:id', async (req, res) => {
      const id = req.params.id;
      const doc = req.body;
      const filter = { _id: new ObjectId(id) };
      const option = {upsert:true};
      const updatedDoc = {
        $set:{
          tourists_spot_name:doc.tourists_spot_name,
          country_Name:doc.country_Name,
          spot_image:doc.spot_image,
          location:doc.location,
          description:doc.description,
          average_cost:doc.average_cost,
          seasonality:doc.seasonality,
          travel_time:doc.travel_time,
          totalVisitorsPerYear:doc.totalVisitorsPerYear
        }
      }
      const result = await touristSpotCollection.updateOne(filter,updatedDoc,option);
      console.log(result);
      res.send(result);
    })

    app.get('/allTouristSpot', async (req, res) => {
      const cursor = touristSpotCollection.find();
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);
    })
    app.get('/allTouristSpot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.findOne(query);
      console.log(result);
      res.send(result);
    })
    app.post('/allTouristSpot', async (req, res) => {
      const user = req.body;
      const result = await touristSpotCollection.insertOne(user);
      res.send(result);
    })

    app.delete('/delete/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await touristSpotCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    })


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
  res.send('server is running for toursim management system is going to production');
})

app.listen(port, () => {
  console.log(`server is runnign on ${port}`);
})
