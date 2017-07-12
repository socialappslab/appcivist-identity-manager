//user

curl -X POST -H "Content-Type: application/json" -d '
{
    "userId": "user@universe.u",
    "name": "Test User"
}' "http://localhost:3024/users"

//identity

curl -X POST -H "Content-Type: application/json" -d '
{
    "userId": "user@universe.u",
    "serviceId": "facebookmessengerbotappcivist",
    "identity": "1446417348757530",
    "enabled": true
}' "http://localhost:3024/identities"

//preference

curl -X POST -H "Content-Type: application/json" -d '
{
    "userId": "user@universe.u",
    "serviceId": "facebookmessengerbotappcivist"
}' "http://localhost:3024/preferences"

curl http://localhost:3024/preferences

//update preference

curl -X PUT -H "Content-Type: application/json" -d '
{
    "serviceId": "anewservice"
}' "http://localhost:3024/preferences/ser@universe.u"

curl http://localhost:3024/preferences


//message

curl -X POST -H "Content-Type: application/json" -d '{
  "to": {
    "name": "user@universe.u"
  },
  "message": {
    "text": "hello, world!"
  }
}' "http://localhost:3024/messages"
