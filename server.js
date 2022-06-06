const mongoose = require("mongoose");
const express = require("express");
const config = require("dotenv").config;

const app = express();
const PORT = process.env.PORT || 8000;

//Load Environment Variables
config();

const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.idco2.mongodb.net/RateYourProf?retryWrites=true&w=majority`

//Middleware to read JSON Bodies
app.use(express.json())

// Connect to MongoDB and if successful, start Server
mongoose.connect(dbURI)
.then(() => {

    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));

})
.catch((err) => console.log("Could not connect to MongoDB: \n" + err));

//Use Express Router 
app.use("/users", require("./Routes/userRoute").router);
app.use("/ratings", require("./Routes/ratingRoute"));