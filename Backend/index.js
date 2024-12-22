const express= require('express')
const cors =require('cors');
const Transaction =require('./models/transaction');
const { default: mongoose } = require('mongoose');
require('dotenv').config()

const app=express();
const PORT = 8000;


app.use(cors());
app.use(express.json());

app.get("/api/test",(req,res)=>{
    res.json('test on')
})

app.post("/api/transaction",async(req,res)=>{
   
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log("Connected to MongoDB");
    }).catch(err => {
        console.error("MongoDB connection error:", err);
    });

    // const {name,description,datetime,price}=req.body
    // const transaction=await Transaction.create({name,description,datetime,price})
    // res.json(transaction);
    const { price, name, description, datetime } = req.body;

    // Validate and sanitize the price input
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
        return res.status(400).json({ error: "Invalid price value" });
    }

    // Create a new transaction object
    const newTransaction = new Transaction({
        price: parsedPrice,
        name,
        description,
        datetime
    });

    try {
        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(500).json({ error: "Failed to save transaction" });
    }
})

app.get('/api/transaction',async(req,res)=>{
    await mongoose.connect(process.env.MONGO_URL)
    const transaction=await Transaction.find();
    res.json(transaction);
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});