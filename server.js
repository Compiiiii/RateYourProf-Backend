const mongoose = require("mongoose");
const express = require("express");
const config = require("./config");
const User = require("./Models/userModel");

const app = express();
const PORT = process.env.PORT || 8000;
const dbURI = `mongodb+srv://${config.user}:${config.password}@cluster0.idco2.mongodb.net/RateYourProf?retryWrites=true&w=majority`

//Middleware to read JSON Bodies
app.use(express.json())

// Connect to MongoDB and if successful, start Server
mongoose.connect(dbURI)
.then(() => {

    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));

})
.catch((err) => console.log("Could not connect to MongoDB: \n" + err));

app.use("/users", require("./Routes/userRoute"));
