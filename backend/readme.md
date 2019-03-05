# How to get it running?

* Install node.js after [downloading](https://nodejs.org/en/download/)
* Install mongodb after [downloading](https://www.mongodb.com/download-center/community)
* cd to the backend directory
* enter `npm install`
* enter `node app.js` or `node start`
* if you want to insert some demo data into the database enter `npm run create-demo-data`

---
* Troubleshoot:
    
    oAuth Sig wrong and using https? Apply following fix in the script `node_modules\ims-lti\hmac-sha1.js`:
    * line 77:
    * `- key = key + "&";`
    * `+ key = (utils.special_encode(key)) + "&";`
    * line 71 (protocol detection was broken for me):
    * `- hitUrl = protocol + '://' + req.headers.host + parsedUrl.pathname;`
    * `+ hitUrl = req.body.custom_fullurl;`