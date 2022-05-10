const { request } = require("express");
const express = require("express");
const router = express.Router();
const User = require("../Models/userModel");

// Login request handling
router.post("/login", (req, res) => {
    
    //Check if Email or Password are missing
    if(!req.body.email || !req.body.password)   return res.status(400).json({"authenticated": false});

    //Search for Database Entries with the given email, if none exist, return no authentication
    User.find({Email: req.body.email})
    .then(result => {
        if(result.length == 0){
            return res.json({"authenticated": false});
        }
        
        //Check if password is right
        if(result[0].Password === req.body.password){
            return res.json({"authenticated": true});
        }
        return res.json({"authenticated": false});
    })
    .catch(err => res.status(500).send(err));

    

});

// Create User Request Handling
router.post("/create", (req, res) => {

    //Check if the request contains all necessary elements
    if(!req.body.email || !req.body.password || !req.body.name) return res.status(400).send();

    //Check whether the given Email Adress already exists
    User.find({Email: req.body.email})
    .then(result => {

        if(result.length != 0)return res.status(200).json({"exists": "email"});

        //Check whether the given Name already exists
        User.find({Name: req.body.name})
        .then(result => {

            if(result.length != 0)return res.status(200).json({"exists": "name"});
            //Create new User
            const newUser = new User({
                Email: req.body.email,
                Password: req.body.password,
                Name: req.body.name
            });
            newUser.save()
            .then(result => {
                res.status(201).send();
            })
            .catch(err => res.status(500).send(err));
        })
        .catch(err => res.status(500).send(err));
    })
    .catch(err => res.status(500).send(err));

})

module.exports = router;