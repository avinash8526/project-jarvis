After cloning the repo follow these steps

* run `npm install`
* install nodemon to monitor file changes `npm install -g nodemon`

## Debug ##

* DEBUG=project-jarvis:* nodemon  --debug-brk bin/www
* DEBUG=expres:* nodemon  --debug-brk bin/www

##Intellij##

* Install node js plugin
* Create node js remote debugging configuration

## Dependency ##
* You need to create a test facebook page and a test app
* Add following information to profile file

```
* export WIT_TOKEN=""
* export FB_PAGE_ID=""
* export FB_PAGE_TOKEN=""
* export FB_VERIFY_TOKEN="<your verification string>"
```