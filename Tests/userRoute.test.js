const { removeObjectKeys, mapResultsToReducedObjects } = require("../Routes/userRoute");
const mongoose = require("mongoose");
const User = require("../Models/userModel");
const config = require("dotenv").config;

test("Should only keep all given Object keys", () => {

    const testObject = {
        a: 55,
        b: 37,
        test: "Test",
        abc: {
            test1: "value",
            test2: "value2"
        },
        array: ["a", 66, "z"],
        bool: true
    };

    expect(removeObjectKeys(testObject, ["a", "abc", "bool"])).toEqual({
        a: 55,
        abc: {
            test1: "value",
            test2: "value2"
        },
        bool: true
    });

});

//Unit Test for mapResultsToReducedObjects
test("Should map all objects in result to the new object returned by removeObjectKeys", () => {
    
        const testData = [
            {
                id: 1,
                forename: "Test",
                surname: "User",
                title: "Mr.",
                email: "testmail@dhbw.de",
                password: "testpassword",
                _id: "5c9d8f9f9f9f9f9f9f9f9f9"
            },
            {
                id: 9,
                forename: "Test2",
                surname: "User2",
                title: "Mr.",
                email: "mymail@mail.com",
                password: "mypassword",
                _id: "0x74630"
            }
        ];
    
        expect(mapResultsToReducedObjects(testData)).toEqual([
            {
                id: 1,
                forename: "Test",
                surname: "User",
                title: "Mr."
            },
            {
                id: 9,
                forename: "Test2",
                surname: "User2",
                title: "Mr."
            }
        ]);
    
});

//Tests the integration of the Database
//Specifically, does what /users/profs call does
//Tests whether all returned objects are reduced to the given keys
test("Should connect to the database and return the desired results", async () => {

    //Load Environment Variables
    config();

    //Connect to the database
    const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.idco2.mongodb.net/RateYourProf?retryWrites=true&w=majority`
    await mongoose.connect(dbURI);
    
    let result = await User.find({id: {$exists: true}})

    expect(Array.isArray(result)).toBe(true);
    
    result = mapResultsToReducedObjects(result);

    result.forEach(element => {
        expect(element).toHaveProperty("id");
        expect(element).toHaveProperty("forename");
        expect(element).toHaveProperty("surname");
        expect(element).toHaveProperty("title");
        expect(Object.keys(element).length).toBe(4);
    });

    mongoose.disconnect();

});
