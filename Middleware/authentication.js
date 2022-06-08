const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const config = require("dotenv").config;

function authenticateToken(req, res, next){

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(token == null)   return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {

        if(err) return res.sendStatus(403);

        req.email = payload.email;

        next();

    });

}

module.exports = {authenticateToken};