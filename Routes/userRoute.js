const express = require("express");
const router = express.Router();
const User = require("../Models/userModel");

// Login request handling
router.post("/login", (req, res) => {
    
    //Check if Email or Password are missing or wrong type
    if(!req.body.email || !req.body.password || typeof req.body.email != "string" || typeof req.body.password != "string")   return res.status(400).json({"authenticated": false});

    //Search for Database Entries with the given email, if none exist, return no authentication
    User.find({Email: req.body.email})
    .then(result => {
        if(result.length == 0) return res.json({"authenticated": false});
        
        //Check if password is right
        if(result[0].password === req.body.password){
            return res.json({"authenticated": true});
        }
        return res.json({"authenticated": false});
    })
    .catch(err => res.status(500).send(err));

});

// Create User Request Handling
router.post("/create", (req, res) => {

    //Check if the request contains all necessary elements and correct types
    if(!req.body.email || !req.body.password || !req.body.forename || !req.body.surname || 
    typeof req.body.email != "string" || typeof req.body.password != "string" || typeof req.body.forename != "string" || typeof req.body.surname != "string") 
    return res.status(400).send();

    //Check whether the given Email Adress already exists
    User.find({Email: req.body.email})
    .then(result => {

        if(result.length != 0)return res.status(200).send();

        //Create new User
        const newUser = new User({
            email: req.body.email,
            password: req.body.password,
            forename: req.body.forename,
            surname: req.body.surname
        });
        newUser.save()
        .then(result => {
            res.status(201).send();
        })
        .catch(err => res.status(500).send(err));
        
    })
    .catch(err => res.status(500).send(err));

});

//Get all Professors
router.get("/profs", (req, res) => {

    User.find({id: {$exists: true}})
    .then(result => {
        
        result.forEach(item => {
            
            item.password = undefined;
            item.__v = undefined;
            item.modules = undefined;
            item.email = undefined;

        });
        
        res.json(result);

    })
    .catch(err => res.status(500).send(err));

});

router.post("/profile/view", (req, res) => {

    //Check if Email or Password are missing or wrong type
    if(!req.body.email || !req.body.password || typeof req.body.email != "string" || typeof req.body.password != "string")   return res.status(400).send();

    User.find({email: req.body.email})
    .then(result => {
        if(result.length != 1)  return res.status(400).send();
        
        ////     WICHTIG: Eigentlich noch ein Passwortcheck, wird aber erstmal weggelassen, da später eh durch Sessions ersetzt

        result[0].password = undefined;
        result[0].__v = undefined;
        result[0].id = undefined;
        result[0].modules = undefined;
        
        res.json(result);
    })

})

module.exports = router;