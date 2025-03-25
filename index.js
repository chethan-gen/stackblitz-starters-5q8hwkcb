const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
require('dotenv').config()
const MenuItem = require('./MenuItem')
const router = express.Router();


const app = express();
app.use(express.json())

const port = 3010;

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.get("/menu",async(req,res)=>{
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Error searching menu items", error: error.message })
  }
})

app.post("/menu",async(req,res)=>{
  try {
    const {name,description,price} = req.body;
    if(!name || !price){
      res.status(400).json({ message: "Please fill in all required fields" });
    }
    const newMenuItem = new MenuItem({
      name,
      price,
      description
      });
      const savedMenuItem = await newMenuItem.save();
      res.status(201).json({ message: "Item added successfully", menuItem: savedMenuItem });
  } catch (error) {
    res.status(500).json({ message: "Error creating new item", error: error.message })
  }
})

mongoose.connect(process.env.MongoDB_URL,{
  useNewUrlParser : true,
  useUnifiedTopology: true
})
.then(()=> console.log("The database is connected"))
.catch((err) => console.log("The database is not connected",err))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
