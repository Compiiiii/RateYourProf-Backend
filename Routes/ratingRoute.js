const express = require("express");
const router = express.Router();
const Rating = require("../Models/ratingModel");
const User = require("../Models/userModel");

//Function to Check if Number is out of given Range
function outOfRange(x, min, max){
    return (x < min || x > max)
}

//Create Rating Request Handling
router.post("/create", (req, res) =>{
    
    //Check if the request contains all necessary keys and right types
    if(!req.body.stars || typeof req.body.prof != "number" || typeof req.body.module != "number" || Array.isArray(req.body.stars) || typeof req.body.stars != "object")   
    return res.status(400).send();
    
    //Check if the Object contains all necessary keys and right types
    if(!req.body.stars.Tempo || !req.body.stars.Nachvollziehbarkeit || !req.body.stars.Anschaulichkeit || !req.body.stars.Interaktivität || 
    typeof req.body.stars.Tempo != "number" || typeof req.body.stars.Nachvollziehbarkeit != "number" || typeof req.body.stars.Anschaulichkeit != "number" || 
    typeof req.body.stars.Interaktivität != "number" || typeof req.body.stars.Corona != "number")  return res.status(400).send();
    
    //Check if the Numbers in the Object are in the right range
    if(outOfRange(req.body.stars.Tempo, 1, 5) ||
    outOfRange(req.body.stars.Nachvollziehbarkeit, 1, 5) || 
    outOfRange(req.body.stars.Anschaulichkeit, 1, 5) || 
    outOfRange(req.body.stars.Interaktivität, 1, 5) || 
    outOfRange(req.body.stars.Corona, 1, 5))    
    return res.status(400).send();
    
    //Check if Numbers in the Object are Integers
    if(!Number.isInteger(req.body.stars.Tempo) || !Number.isInteger(req.body.stars.Nachvollziehbarkeit) || !Number.isInteger(req.body.stars.Anschaulichkeit) ||
    !Number.isInteger(req.body.stars.Interaktivität) || !Number.isInteger(req.body.stars.Corona))   return res.status(400).send();
    
    //Check if Module is in Range
    if(outOfRange(req.body.module, 0, 20))  return res.status(400).send();
    
    //Check if Module and Prof are Integers
    if(!Number.isInteger(req.body.module) || !Number.isInteger(req.body.prof))  return res.status(400).send();

    //Check if a professor with the given id exists
    User.find({id: req.body.prof})
    .then(result => {
        if(result.length == 0) return res.status(400).send();
        
        //If rating was submitted with comment
        if(req.body.title || req.body.comment || req.body.anonymous){
            
            //If one of these three is present, all have to be present and they have to be the right type
            if(!req.body.title || !req.body.comment || typeof req.body.title != "string" || typeof req.body.comment != "string" || typeof req.body.anonymous != "boolean") return res.status(400).send();
            
            //Check if Comment or title are longer than the maximum length
            if(outOfRange(req.body.comment.length, 1, 2000) || outOfRange(req.body.title.length, 1, 50)) return res.status(400).send();

            const newRating = new Rating({
                prof: req.body.prof,
                module: req.body.module,
                title: req.body.title,
                comment: req.body.comment,
                anonymous: req.body.anonymous,
                stars: req.body.stars
            });

            newRating.save()
            .then(result => {
                res.status(201).send();
            })
            .catch(err => res.status(500).send(err));

        }else{
            //If rating was submitted without comment
            const newRating = new Rating({
                prof: req.body.prof,
                module: req.body.module,
                stars: req.body.stars
            });

            newRating.save()
            .then(result => {
                res.status(201).send();
            })
            .catch(err => res.status(500).send(err));

        }
    })
    .catch(err => res.status(500).send(err));

});

module.exports = router;