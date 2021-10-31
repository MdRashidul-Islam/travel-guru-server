const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require('dotenv').config();


const app = express();
const port =process.env.PORT ||5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1wea1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){

  try{
    await client.connect();
    const database=client.db('travel_guru');
    const  RoomCollection=database.collection('rooms');
    const  OrderCollection=database.collection('orderProduct');
    const  WellnessCollection=database.collection('wellness');
    const  ClubCollection=database.collection('club');
    
    //POST
    app.post('/rooms', async(req, res) => {
     const room= req.body;
     const result= await RoomCollection.insertOne(room)
      res.json(result) 
    })


    //GET API
    app.get('/rooms', async (req, res) => {
      const cursor= RoomCollection.find({});
      const rooms= await cursor.toArray();
      res.send(rooms);
    })


    //Get full info of a single room
    app.get('/rooms/:id', async (req, res) => {
      const id= req.params.id;
      const query= {_id: ObjectId(id)};
      const result= await RoomCollection.findOne(query);
      res.json(result);
    })

    //my order post
    app.post('/myOrder', async(req, res) => {
      const order= req.body;
      const result= await OrderCollection.insertOne(order)
      console.log(result)
       res.json(result) 
     })

     app.get('/myOrder', async(req, res) => {
      const cursor= OrderCollection.find({});
      const result= await cursor.toArray();
      res.send(result);
     })


     //get clubs api
     app.get("/club", async (req, res)=>{
      const result= await  ClubCollection.find({}).toArray();
      res.send(result);
    })


    //my order
    app.get("/myOrder/:email", async (req, res)=>{
      const result= await RoomCollection.find({email: req.params.email}).toArray();
      res.send(result);
    })

    //get WELLNESS
    app.get("/wellness", async (req, res)=>{
      const result= await  WellnessCollection.find({}).toArray();
      res.send(result);
    })

    //placeOrder product 
    app.post('/myBooking', async(req, res)=>{
     const booking= req.body;
     console.log(booking)
     const result= await OrderCollection.insertOne(booking)
     res.json(result)
    })


    // GET API
    app.get('/myBooking', async (req, res) => {
      const cursor= OrderCollection.find({});
      const result= await cursor.toArray();
      res.send(result);
    });

    

    //delete Api
    app.delete('/myBooking/:id', async(req, res)=> {
      const id=req.params.id;
      const query ={_id: ObjectId(id)};
      const result = await OrderCollection.deleteOne(query);
      console.log(result)
      res.send(result)

    })

   

   

    // placeOrder get 
    app.get('/myBooking/:email', async (req, res)=>{
      const cursor= OrderCollection.find({email: req.params.email});
      const result= await cursor.toArray();
      // const result= await OrderCollection.find({email: req.params.email}).toArray();
      console.log(result);
      res.send(result);
    })

    
    
  }
 finally{
//  await client.close();
 }
}
run().catch(console.dir);



app.get("/", (req, res) => {
  res.send("Hello Travel-Guru");
});


app.listen(port, () => {
  console.log("Running Port", port);
});