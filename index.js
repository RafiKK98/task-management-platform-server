const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://rafikk1998rk:1ukNWENZPf4oOvhE@my-cluster.qrwmyur.mongodb.net/?retryWrites=true&w=majority";

app.use(cors())
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
app.get('/', (req, res) => {
    res.send('Hello from Server!');
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const db = client.db('taskManagement');
        const taskCollection = db.collection('tasks');

        app.get('/tasks', async (req, res) => {
            const cursor = taskCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        });
        app.get('/tasks/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const cursor = taskCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        });
        app.get('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await taskCollection.findOne(filter);
            res.send(result)
        });

        app.post('/tasks', async (req, res) => {
            const newTask = req.body;
            const result = await taskCollection.insertOne(newTask);
            res.send(result);
        });
        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedProduct = req.body;
            const product = {
                $set: {
                    title: updatedProduct.title,
                    description: updatedProduct.description,
                    deadline: updatedProduct.deadline,
                    priority: updatedProduct.priority,
                }
            }
            const result = await taskCollection.updateOne(filter, product, options);
            res.send(result);
        });

        app.patch('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id : new ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: `Completed`
                },
            };
            const result = await taskCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id : new ObjectId(id)};
            const result = await taskCollection.deleteOne(filter);
            res.send(result);
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

app.listen(port, () => {
    console.log(`Server listening on http://locahost:${port}`);
});