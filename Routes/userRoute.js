const express = require("express");
const router = express.Router();
const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("../Middleware/authentication")
const bcrypt = require("bcrypt");

//Removes every unnecessary Object Key
//Meaning: Every key in keys String array in object gets copied to the new object
function removeObjectKeys(object, keys) {

    const newObject = {};

    keys.forEach(item => {
        newObject[item] = object[item];
    });
    
    return newObject;

}

function mapResultsToReducedObjects(result){

    return result.map(item => {
        return removeObjectKeys(item, ["id", "forename", "surname", "title"]);
    });

}

// Login request handling
router.post("/login", (req, res) => {
    
    //Check if Email or Password are missing or wrong type
    if(typeof req.body.email != "string" || typeof req.body.password != "string")   return res.sendStatus(400);

    //Search for Database Entries with the given email, if none exist, return no authentication
    User.find({email: req.body.email})
    .then(result => {
        if(result.length != 1) return res.sendStatus(401);
        
        //Check if password is right
        if(bcrypt.compareSync(req.body.password, result[0].password)){
            //Create JWT with email
            const token = jwt.sign({email: result[0].email}, process.env.JWT_SECRET);

            return res.status(200).json({"jwt": token});
        }
        return res.sendStatus(401);
    })
    .catch(err => res.status(500).send(err));

});

// Create User Request Handling
router.post("/create", (req, res) => {

    //Check if the request contains all necessary elements and correct types
    if(typeof req.body.email != "string" || typeof req.body.password != "string" || typeof req.body.forename != "string" || typeof req.body.surname != "string") return res.sendStatus(400);
    
    //Check whether the given Email Adress already exists
    User.find({email: req.body.email})
    .then(result => {

        if(result.length != 0)  return res.sendStatus(401);

        //Create new User
        const newUser = new User({
            email: req.body.email,
            password: req.body.password,//createHash(req.body.password),
            forename: req.body.forename,
            surname: req.body.surname
        });
        //Notwendig, da modules einfach so geaddet wird
        newUser.modules = undefined;

        newUser.save()
        .then(result2 => {
            //Create JWT with email
            const token = jwt.sign({email: req.body.email}, process.env.JWT_SECRET);
            res.status(201).json({"jwt": token});
        })
        .catch(err => res.status(500).send(err));
        
    })
    .catch(err => res.status(500).send(err));

});

//Get all Professors
router.get("/profs", authenticateToken, (req, res) => {

    User.find({id: {$exists: true}})
    .then(result => {
        
        result = mapResultsToReducedObjects(result);
        
        res.json(result);

    })
    .catch(err => res.status(500).send(err));

});

//Get all Modules of one Professor
router.post("/profs/modules", authenticateToken, (req, res) => {

    //Check if Prof is number
    if(!Number.isInteger(req.body.prof))   return res.sendStatus(400);

    //Search for Prof with that ID
    User.find({id: req.body.prof})
    .then(result => {

        //Check if one Prof was found
        if(result.length != 1)  return res.sendStatus(400);

        //Map every Array item to an Object with its Name and Array Index
        const mapped = result[0].modules.map(m => {

            return {name: m, id: result[0].modules.indexOf(m)}
            
        });

        res.json(mapped);

    })
    .catch(err => res.status(500).send(err));


})

router.get("/profile/view", authenticateToken, (req, res) => {

    //Now we have req.email thanks to authentication Middleware

    User.find({email: req.email})
    .then(result => {
        if(result.length != 1)  return res.sendStatus(400);

        result = result.map(item => {
            return removeObjectKeys(item, ["email", "forename", "surname"]);
        });
        
        res.status(200).json(result);
    })

})

router.put("/profile/edit", authenticateToken, async (req, res) => {

    //Check if keys are missing or wrong type
    if(typeof req.body.forename != "string" || typeof req.body.surname != "string")   return res.sendStatus(400);
    
    if(typeof req.body.password == "string" && req.body.password.length != 0) {
        await User.findOneAndUpdate({email: req.email}, {forename: req.body.forename, surname: req.body.surname, password: req.body.password}, {new: true}, (err, user) => {
            if(err) return res.status(500).send(err);
            if(!user) return res.sendStatus(400);
            return res.sendStatus(200);
        }).clone();
    }
    else{

        await User.findOneAndUpdate({email: req.email}, {forename: req.body.forename, surname: req.body.surname}, {new: true}, (err, user) => {
            if(err) return res.status(500).send(err);
            if(!user) return res.sendStatus(400);
            return res.sendStatus(200);
        }).clone();

    }

})

module.exports = {router, removeObjectKeys, mapResultsToReducedObjects};