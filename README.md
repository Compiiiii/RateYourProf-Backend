# How to use

To use, you need to change the name of .env.example to .env and replace username, password and the JWT-Secret with valid values.
You might also need to change the dbURI String in server.js to connect to your own Database

---

## API Calls

---

### **/users/login**
 
### ***Request:***

#### *HTTP-Method:* Post

#### *Body:* 

    {
        "email": String,
        "password": String
    }

### ***Response:***

#### *Status-Code:* 
- 400 if not all required JSON keys are sent or have the wrong type
- 401 if login failed
- 200 if login succeeded

#### *Body(Only if Status is 200):*
    {
        "jwt": String(JSON Web Token)
    }

---

### **/users/create**

### ***Request:***

#### *HTTP-Method:* Post

#### *Body:* 

    {
        "email": String,
        "password": String,
        "forename": String,
        "surname": String
    }

### ***Response:***

#### *Status-Code:* 

- 400 if not all required JSON keys are sent or have the wrong type
- 401 if email already exists
- 201 if added successfully

#### *Body(Only if Status is 201):* 

    {
        "jwt": String(JSON Web Token)
    }

---

### **/users/profs**
 
### ***Request:***

#### *HTTP-Method:* Get

#### *Header:* Authorization: "Bearer **JWT**"

### ***Response:***

#### *Status-Code:* 
- 401 if JWT is missing
- 403 if JWT is invalid
- 200 in any other case

#### *Body:*
    [
        {
            "forename": String,
            "surname": String,
            "title": String,
            "id": Integer
        },
        {
            And so on...
            The Array-Size equals the number of professors
        }
    ]

---

### **/users/profs/modules**
 
### ***Request:***

#### *HTTP-Method:* Post

#### *Header:* Authorization: "Bearer **JWT**"

#### *Body:*

    {
        "prof": Integer
    }

### ***Response:***

#### *Status-Code:*
- 401 if JWT is missing
- 403 if JWT is invalid
- 400 if not all required JSON keys are sent, they have the wrong type, or the Prof-ID does not exist
- 200 in any other case

#### *Body:*
    [
        {
            "name": String,     //Module Name
            "id": Integer       //Array Index
        },
        {
            ...
        }
    ]

---

### **/users/profile/view**
 
### ***Request:***

#### *HTTP-Method:* Get

#### *Header:* Authorization: "Bearer **JWT**"

### ***Response:***

#### *Status-Code:* 
- 401 if JWT is missing
- 403 if JWT is invalid
- 200 in any other case

#### *Body:*
    {
        "email": String,
        "forename": String,
        "surname": String
    }

---

### **/users/profile/edit**
 
### ***Request:***

#### *HTTP-Method:* Put

#### *Header:* Authorization: "Bearer **JWT**"

#### *Body:* 

    {
        "forename": String,
        "surname": String,
        "password": String  //Optional: Only send when password was changed
    }

### ***Response:***

#### *Status-Code:* 
- 401 if JWT is missing
- 403 if JWT is invalid
- 400 if not all required JSON keys are sent or have the wrong type
- 200 if the profile was changed successfully

---

### **/ratings/create**

### ***Request:***

#### *HTTP-Method:* Post

#### *Header:* Authorization: "Bearer **JWT**"

#### *Body:* 

    {
        "prof": Integer,
        "module": Integer(Range 0-20),
        "stars": {
            "Tempo": Integer(Range 1 - 5),
            "Nachvollziehbarkeit": Integer(Range 1 - 5),
            "Anschaulichkeit": Integer(Range 1 - 5),
            "Interaktivität": Integer(Range 1 - 5),
            "Corona": Integer(Range 1-5)
        },
        "date": Integer(Unix Time),
        "anonymous": Boolean,
        //The following are optional. However, either all of them or none of them must be sent.
        "title": String(Length 1-50),
        "comment": String(Length 1-2000),
    }

### ***Response:***

#### *Status-Code:* 
- 401 if JWT is missing
- 403 if JWT is invalid
- 400 if not all required JSON keys are sent, they have the wrong type, are out of Range or Prof/Module dont exist
- 201 if added successfully

---

### **/ratings/getStars**

### ***Request:***

#### *HTTP-Method:* Post

#### *Header:* Authorization: "Bearer **JWT**"

#### *Body:* 

    {
        "prof": Integer,
        "module": Integer(Range 0-20),  //The id of the module received when calling /users/profs/modules
    }

### ***Response:***

#### *Status-Code:* 
- 401 if JWT is missing
- 403 if JWT is invalid
- 400 if not all required JSON keys are sent, they have the wrong type, are out of Range or Prof does not exist
- 200 in any other case

#### *Body:*
    {   //Empty Object if no Ratings exist for the requested module
        Name: String,
        Tempo: Integer(Range 0-100),
        Nachvollziehbarkeit: Integer(Range 0-100),
        Anschaulichkeit: Integer(Range 0-100),
        Interaktivität: Integer(Range 0-100),
        Corona: Integer(Range 0-100)
    }

---

### **/ratings/getComments**

### ***Request:***

#### *HTTP-Method:* Post

#### *Header:* Authorization: "Bearer **JWT**"

#### *Body:* 

    {
        "prof": Integer,
        "module": Integer(Range 0-20),  //The id of the module sent when calling /users/profs/modules
    }

### ***Response:***

#### *Status-Code:*
- 401 if JWT is missing
- 403 if JWT is invalid
- 400 if not all required JSON keys are sent, they have the wrong type, are out of Range or Prof does not exist
- 200 in any other case

#### *Body:*
    [//Empty Array if no Comments exist for the requested module
        {
            title: String,
            comment: String,
            name: String, //Empty String if anonymous was set to true on creation of the request//Does not exist if anonymous is false but rating was created before JWT were impelemented
            date: Integer(Unix Time)
        }
    ]
