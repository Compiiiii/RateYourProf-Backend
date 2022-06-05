const express = require("express");
const router = express.Router();
const User = require("../Models/userModel");

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
    if(!req.body.email || !req.body.password || typeof req.body.email != "string" || typeof req.body.password != "string")   return res.status(400).json({"authenticated": false});

    //Copilot
    // {
    // //Create JSON Web Token
    // const token = req.body.email + ":" + req.body.password;
    // const tokenHash = require("crypto").createHash("sha256").update(token).digest("hex");

    // //Write token to cookie
    // res.cookie("token", tokenHash, {
    //     maxAge: 1000 * 60 * 60 * 24 * 7,
    //     httpOnly: true
    // });

    // //Write token to database
    // User.findOneAndUpdate({email: req.body.email}, {token: tokenHash}, {new: true}, (err, user) => {
    //     if(err) return res.status(500).json({"authenticated": false});
    //     if(!user) return res.status(400).json({"authenticated": false});
    //     return res.status(200).json({"authenticated": true});
    // });
    // }

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
        
        result = mapResultsToReducedObjects(result);
        
        res.json(result);

    })
    .catch(err => res.status(500).send(err));

});

//Get all Modules of one Professor
router.post("/profs/modules", (req, res) => {

    //Check if Email or Password or Profs are missing or wrong type
    if(!req.body.email || !req.body.password || !req.body.prof || typeof req.body.email != "string" || typeof req.body.password != "string" || typeof req.body.prof != "number")   
    return res.status(400).send();

    //Check if Prof is Int
    if(!Number.isInteger(req.body.prof))    return res.status(400).send();

    //Theoretisch noch Email und Passwort authentifizieren, ist aber egal, da eh noch durch sessions ersetzt wird

    //Search for Prof with that ID
    User.find({id: req.body.prof})
    .then(result => {

        //Check if one Prof was found
        if(result.length != 1)  return res.status(400).send();

        //Map every Array item to an Object with its Name and Array Index
        const mapped = result[0].modules.map(m => {

            return {name: m, id: result[0].modules.indexOf(m)}
            
        });

        res.json(mapped);

    })
    .catch(err => res.status(500).send(err));


})

router.post("/profile/view", (req, res) => {

    //Check if Email or Password are missing or wrong type
    if(!req.body.email || !req.body.password || typeof req.body.email != "string" || typeof req.body.password != "string")   return res.status(400).send();

    User.find({email: req.body.email})
    .then(result => {
        if(result.length != 1)  return res.status(400).send();
        
        ////     WICHTIG: Eigentlich noch ein Passwortcheck, wird aber erstmal weggelassen, da später eh durch Sessions ersetzt

        result = result.map(item => {
            return removeObjectKeys(item, ["email", "forename", "surname"]);
        });
        
        res.json(result);
    })

})

router.post("/profile/edit", async (req, res) => {

    //Check if Email or Password are missing or wrong type
    if(typeof req.body.email != "string" || typeof req.body.forename != "string" || typeof req.body.surname != "string")   return res.status(400).send();
    
    if(typeof req.body.password == "string") {
        await User.findOneAndUpdate({email: req.body.email}, {forename: req.body.forename, surname: req.body.surname, password: req.body.password}, {new: true}, (err, user) => {
            if(err) return res.status(500).send();
            if(!user) return res.status(400).send();
            res.status(200).send();
        }).clone();
    }
    else{

        await User.findOneAndUpdate({email: req.body.email}, {forename: req.body.forename, surname: req.body.surname}, {new: true}, (err, user) => {
            if(err) return res.status(500).send();
            if(!user) return res.status(400).send();
            res.status(200).send();
        }).clone();

    }

})

//Damit Express funktioniert, müssen beide Funktionsexporte entfernt werden
module.exports = {router, removeObjectKeys, mapResultsToReducedObjects};