const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb function

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nn0l6mi.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toysCollection = client.db("toys").collection("addToys");

    // AddToys
    app.post("/addToys", async (req, res) => {
      const addToy = req.body;
      const result = await toysCollection.insertOne(addToy);
      res.send(result);
    });
    // for all toys
    app.get("/addToys", async (req, res) => {
      const cursor = toysCollection.find().limit(20);
      const result = await cursor.toArray();
      res.send(result);
    });

    // for specific user
    app.get("/myToys", async (req, res) => {
      const sellerEmail = req.query.email;
      const query = { sellerEmail };
      const cursor = toysCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //  for elephant categories toys
    app.get("/categories/elephant", async (req, res) => {
      const query = { category: "Elephant Toys" };
      const cursor = toysCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // for teddy categories toys
    app.get("/categories/teddy", async (req, res) => {
      const query = { category: "Teddy Toys" };
      const cursor = toysCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // for unicorn categories toys
    app.get("/categories/unicorn", async (req, res) => {
      const query = { category: "Unicorn Toys" };
      const cursor = toysCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // for single toys
    app.get("/addToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      res.send(result);
    });
    // delete operations
    app.delete("/myToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    });
    // for update
    app.get('/myToys/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await toysCollection.findOne(query);
      res.send(result)
    })

    app.put('/myToys/:id', async(req, res) =>{
      const id = req.params.id;
      const filter ={ _id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedToy = req.body;
      const toyInfo ={
        $set:{
          description: updatedToy.description,
          productName: updatedToy.productName,
          price: updatedToy.price,
          quantity: updatedToy.quantity,
          sellerName: updatedToy.sellerName,
          photo: updatedToy.photo,
          sellerEmail: updatedToy.sellerEmail,
          rating: updatedToy.rating,
          category: updatedToy.category
        }
      }
      const result = await toysCollection.updateOne(filter, toyInfo, options)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("toys is running");
});

app.listen(port, () => {
  console.log(`toys server is running on port ${port}`);
});
