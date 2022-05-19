# How to use

To use, you need to change the name of config.js.example to config.js and replace username and password with valid credentials
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
- 200 in any other case

#### *Body:*
    {
        "authenticated": Boolean
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
- 200 if "email" already exists
- 201 if added successfully

---

### **/users/profs**
 
### ***Request:***

#### *HTTP-Method:* Get

### ***Response:***

#### *Status-Code:* 200

#### *Body:*
    [
        {
            "_id": String,  //Can be ignored
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

#### *Body:*
   {
       "email": String,
       "password": String,
       "prof": Integer
   }

### ***Response:***

#### *Status-Code:*
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

### **/ratings/create**

### ***Request:***

#### *HTTP-Method:* Post

#### *Body:* 

    {
        "prof": Integer,
        "module": Integer,
        "stars": {
            "Tempo": Integer(Range 1 - 5),
            "Nachvollziehbarkeit": Integer(Range 1 - 5),
            "Anschaulichkeit": Integer(Range 1 - 5),
            "Interaktivität": Integer(Range 1 - 5)
        },
        //The following are optional. However, either all of them or none of them must be sent.
        "title": String(Range 1-50),
        "comment": String(Range 1-2000),
        "anonymous": Boolean
    }

### ***Response:***

#### *Status-Code:* 
- 400 if not all required JSON keys are sent, they have the wrong type, are out of Range or Prof/Module dont exist
- 201 if added successfully

---

### **/users/profile/view**
 
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
- 200 in any other case

#### *Body:*
    {
        "_id": String //Can be ignored
        "email": String,
        "forename": String,
        "surname": String
    }
