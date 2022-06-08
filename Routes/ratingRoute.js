const express = require("express");
const router = express.Router();
const Rating = require("../Models/ratingModel");
const User = require("../Models/userModel");
const {authenticateToken} = require("../Middleware/authentication")

//Function to Check if Number is out of given Range
function outOfRange(x, min, max){
    return (x < min || x > max)
}

//Create Rating Request Handling
router.post("/create", authenticateToken, (req, res) =>{
    
    //Check if the request contains all necessary keys and right types
    if(!Number.isInteger(req.body.prof) || !Number.isInteger(req.body.module) || Array.isArray(req.body.stars) || typeof req.body.stars != "object" || 
    !Number.isSafeInteger(req.body.date)) return res.sendStatus(400);
    
    //Check if Numbers in the Object are Integers
    if(!Number.isInteger(req.body.stars.Tempo) || !Number.isInteger(req.body.stars.Nachvollziehbarkeit) || !Number.isInteger(req.body.stars.Anschaulichkeit) ||
    !Number.isInteger(req.body.stars.Interaktivität) || !Number.isInteger(req.body.stars.Corona))   return res.sendStatus(400);
    
    //Check if the Numbers in the Object are in the right range
    if(outOfRange(req.body.stars.Tempo, 1, 5) ||
    outOfRange(req.body.stars.Nachvollziehbarkeit, 1, 5) || 
    outOfRange(req.body.stars.Anschaulichkeit, 1, 5) || 
    outOfRange(req.body.stars.Interaktivität, 1, 5) || 
    outOfRange(req.body.stars.Corona, 1, 5))
    return res.sendStatus(400);
    
    //Check if date is in the future
    //-1000 because of possible unsynchronized time
    if(req.body.date-1000 > Math.round(Date.now()/1000))   return res.sendStatus(400);
    
    //Check if Module is in Range
    if(outOfRange(req.body.module, 0, 20))  return res.sendStatus(400);
    
    //Check if a professor with the given id exists
    User.find({id: req.body.prof})
    .then(result => {
        if(result.length == 0) return res.status(400).send();
        
        //If rating was submitted with comment or title
        if((typeof req.body.title == "string" && req.body.title != "" || typeof req.body.comment == "string" && req.body.comment != "") && typeof req.body.anonymous == "boolean"){
            
            //If one of these three is present, all have to be present and they have to be the right type
            if(typeof req.body.title != "string" || typeof req.body.comment != "string" || typeof req.body.anonymous != "boolean") return res.sendStatus(400);
            
            //Check if Comment or title are longer than the maximum length
            if(outOfRange(req.body.comment.length, 1, 2000) || outOfRange(req.body.title.length, 1, 50)) return res.sendStatus(400);

            //Search User to add Name
            User.find({email: req.email}).then(user => {
                
                if(user.length != 1) return res.sendStatus(400);

                const newRating = new Rating({
                    prof: req.body.prof,
                    module: req.body.module,
                    title: req.body.title,
                    comment: req.body.comment,
                    anonymous: req.body.anonymous,
                    stars: req.body.stars,
                    date: req.body.date,
                    authorEmail: req.email,
                    authorName: user[0].forename + " " + user[0].surname
                });
                
                newRating.save()
                .then(result => {
                    res.sendStatus(201);
                })
                .catch(err => res.status(500).send(err));
                
            }).catch(err => res.status(500).send(err));


        }else{

            //If no comment or title is present, just save the rating
            const newRating = new Rating({
                prof: req.body.prof,
                module: req.body.module,
                stars: req.body.stars,
                date: req.body.date,
                authorEmail: req.email,
            });

            newRating.save()
            .then(result => {
                res.sendStatus(201);
            })
            .catch(err => res.status(500).send(err));


        }
    })
    .catch(err => res.status(500).send(err));

});

router.post("/getStars", authenticateToken, (req, res) => {

    //Check if the request contains all necessary keys and right types
    if(!Number.isInteger(req.body.prof) || !Number.isInteger(req.body.module)) return res.sendStatus(400);

    if(outOfRange(req.body.module, 0, 20)) return res.status(400).send();

    User.find({id: req.body.prof}).then(resultProf => {

        if(resultProf.length != 1) return res.sendStatus(400);

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
            console.log(stars.Tempo);
            console.log(stars.Corona);

            //Add up all stars
            //-1 to get Stars from 0 to 4: Otherwise the lowest percentage would be 25%
            for(let i = 0; i < result.length; i++){
                stars.Tempo += result[i].stars.Tempo-1;
                stars.Nachvollziehbarkeit += result[i].stars.Nachvollziehbarkeit-1;
                stars.Anschaulichkeit += result[i].stars.Anschaulichkeit-1;
                stars.Interaktivität += result[i].stars.Interaktivität-1;
                stars.Corona += result[i].stars.Corona-1 ? result[i].stars.Corona-1 : 0;
            }

            //Calculate the average in percent
            // (Sum of all stars / number of ratings) * 25: 25 because stars can be 0-4
            stars.Tempo = Math.round(stars.Tempo / result.length * 25);
            stars.Nachvollziehbarkeit = Math.round(stars.Nachvollziehbarkeit / result.length * 25);
            stars.Anschaulichkeit = Math.round(stars.Anschaulichkeit / result.length * 25);
            stars.Interaktivität = Math.round(stars.Interaktivität / result.length * 25);
            stars.Corona = Math.round(stars.Corona / result.length * 25);

            res.status(200).json(stars);

        }).catch(err => res.status(500).send(err));
    }).catch(err => res.status(500).send(err));

});

router.post("/getComments", authenticateToken, (req, res) => {

    //Check if the request contains all necessary keys and right types
    if(!Number.isInteger(req.body.prof) || !Number.isInteger(req.body.module)) return res.sendStatus(400);

    if(outOfRange(req.body.module, 0, 20)) return res.sendStatus(400);

    User.find({id: req.body.prof}).then(resultProf => {
        if(resultProf.length != 1) return res.status(400).send();

        Rating.find({prof: req.body.prof, module: req.body.module, comment: {$exists: true}}).then(result => {
            if(result.length == 0)  return res.status(200).json([]);

            let comments = [];
            for(let i = 0; i < result.length; i++){

                comments.push({
                    title: result[i].title,
                    comment: result[i].comment,
                    name: result[i].anonymous ? "" : result[i].authorName,
                    date: result[i].date
                });

            }

            res.status(200).json(comments);

        }).catch(err => res.status(500).send(err));
    }).catch(err => res.status(500).send(err));


});

module.exports = router;