# How to use

To use, you need to change the name of config.js.example to config.js and replace username and password with valid credentials
You might also need to change the dbURI String in server.js to connect to your own Database

---

## API Calls

### /user

**/user/login**
- ***Send*** HTTP Post Request
- ***Send*** JSON as Body with Elements "email" and "password"
- ***Receive*** Status Code 200 no matter whether successful authentication or not
- ***Receive*** Status Code 400 if not all of the required JSON values are not sent
- ***Receive*** JSON as Body with Element "authenticated" set to true or false

**/user/create**
- ***Send*** HTTP Post Request
- ***Send*** JSON as Body with Elements "email", "password" and "name"
- ***Receive*** Status Code 201 if added successfully
- ***Receive*** Status Code 200 if "email" or "name" already exist
- ***Receive*** JSON as Body with Element "exists" set to the already existing JSON value, i.e. "exists": "email"
- ***Receive*** Status Code 400 if not all of the required JSON values are not sent