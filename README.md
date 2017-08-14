# appcivist-identity-manager
Manager of identities for notifications and messages of AppCivist

## Setup
### Install node  
I have been using v0.10.15 for initial development and testing

### Install MongoDB and create collection
I have been using v2.4.5 for initial development and testing
Run mongo: 
```
mongod &
```

Create collection in mongo: 
```
mongo
db.createCollection('entitymanagerservice')
```

### Pull from GitHub
Get a local copy of the project (using git or copy the zip) and then use the node package manager to install needed prereqs defined in package.json ...
```
npm install
```

Setup  environment variables on your OS. The project required this two environment variables: 

```
USNB_MONGO_URI_ENTITY_MANAGER = mongodb://[host]:27017/entitymanagerservice
USNB_ENTITY_MANAGER_PORT = any port you want to use (8889)
```

then start the server ...
```
node start.js
```

### Entity Management API ###

Register a user:

```
curl -X POST -H "Content-Type: application/json" -d '{
    "userId": "user@universe.u",
    "name": "Test User"
}' "http://localhost:3025/users"
```

Register social interaction services identities for that user:

```
curl -X POST -H "Content-Type: application/json" -d '{
    "userId": "user@universe.u",
    "serviceId": "facebookmessengerbot",
    "identity": "184858454541",
    "enabled": true
}' "http://localhost:3025/identities"


curl -X POST -H "Content-Type: application/json" -d '{
    "userId": "user@universe.u",
    "serviceId": "email",
    "identity": "user@universe.u",
    "enabled": true
}' "http://localhost:3025/identities"
```

In the case of Facebook Messenger, it will be the bot itself who will register
the Facebook Messenger identity following [checkbox plugin](https://developers.facebook.com/docs/messenger-platform/plugin-reference/checkbox-plugin)
or the [account linking](https://developers.facebook.com/docs/messenger-platform/account-linking/v2.10) processes.

Set the preferred social interaction for that user:

```
curl -X POST -H "Content-Type: application/json" -d '{
    "userId": "user@universe.u",
    "serviceId": "facebookmessengerbot"
}' "http://localhost:3025/preferences"
```

Change it:

```
curl -X PUT -H "Content-Type: application/json" -d '{
    "serviceId": "email"
}' "http://localhost:3025/preferences/user@universe.u"
```
