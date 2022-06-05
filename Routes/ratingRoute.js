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
    if(!req.body.stars || typeof req.body.prof != "number" || typeof req.body.module != "number" || Array.isArray(req.body.stars) || typeof req.body.stars != "object" || 
    !Number.isSafeInteger(req.body.date))
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

    //Read Email out of JWT

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
                stars: req.body.stars,
                date: req.body.date
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
                stars: req.body.stars,
                date: req.body.date
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

router.post("/getStars", (req, res) => {

    //Session check

    //Check if the request contains all necessary keys and right types
    if(!Number.isInteger(req.body.prof) || !Number.isInteger(req.body.module)) return res.status(400).send();

    if(outOfRange(req.body.module, 0, 20)) return res.status(400).send();

    User.find({id: req.body.prof}).then(resultProf => {
        if(resultProf.length != 1) return res.status(400).send();

        Rating.find({prof: req.body.prof, module: req.body.module}).then(result => {
            if(result.length == 0)  return res.status(200).json({});

            
            //Initialize Variables
            let stars = {
                Name: resultProf[0].modules[req.body.module],
                Tempo: 0,
                Nachvollziehbarkeit: 0,
                Anschaulichkeit: 0,
                Interaktivität: 0,
                Corona: 0
            };

            //Add up all stars
            //-1 to get Stars from 0 to 4: Otherwise the lowest percentage would be 25%
            for(let i = 0; i < result.length; i++){
                stars.Tempo += result[i].stars.Tempo-1;
                stars.Nachvollziehbarkeit += result[i].stars.Nachvollziehbarkeit-1;
                stars.Anschaulichkeit += result[i].stars.Anschaulichkeit-1;
                stars.Interaktivität += result[i].stars.Interaktivität-1;
                stars.Corona += result[i].stars.Corona-1;
            }

            //Calculate the average in percent
            // (Sum of all stars / number of ratings) * 25: 25 because stars can be 0-4
            stars.Tempo = Math.round(stars.Tempo / result.length * 25);
            stars.Nachvollziehbarkeit = Math.round(stars.Nachvollziehbarkeit / result.length * 25);
            stars.Anschaulichkeit = Math.round(stars.Anschaulichkeit / result.length * 25);
            stars.Interaktivität = Math.round(stars.Interaktivität / result.length * 25);
            stars.Corona = Math.round(stars.Corona / result.length * 25);

            res.status(200).json(stars);

        });
    });

});

router.post("/getComments", (req, res) => {

    //Session check

    //Check if the request contains all necessary keys and right types
    if(!Number.isInteger(req.body.prof) || !Number.isInteger(req.body.module)) return res.status(400).send();

    if(outOfRange(req.body.module, 0, 20)) return res.status(400).send();

    //Dont forget to return Name of email adress when JWT are implemented
    User.find({id: req.body.prof}).then(resultProf => {
        if(resultProf.length != 1) return res.status(400).send();

        Rating.find({prof: req.body.prof, module: req.body.module, comment: {$exists: true}}).then(result => {
            if(result.length == 0)  return res.status(200).json([]);

            let comments = [];
            for(let i = 0; i < result.length; i++){
                comments.push({
                    title: result[i].title,
                    comment: result[i].comment,
                    name: result[i].anonymous ? "" : resultProf[0].email,
                    date: result[i].date
                });
            }

            res.status(200).json(comments);

        });
    });


});

module.exports = router;