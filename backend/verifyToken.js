var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var Auth = require('./controllers/chal_auth.controller');

function verifyToken(req, res, next) {

  // check header or url parameters or post parameters for token
  const tokenCookie = req.cookies.token;
  //console.log(req.cookies)
  //console.log(tokenCookie)
  if (!tokenCookie) return res.status(403).send({ err: 'No token available, please login.'});

  const deserialise = tokenCookie.split(',');

	const token = deserialise[0]
  // verifies secret and checks exp
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    if (err) return res.status(400).append("set-cookie", Auth.setCookie("token", null, 1)).send({ err: 'The token expired.'});

    // check if token has client ip
    if (decoded.id === undefined) return res.status(500).append("set-cookie", Auth.setCookie("token", null, 1)).send({ err: 'Failed to authenticate token.'});
    // check if buddy
    (decoded.buddy === undefined) ? req.buddy = false : req.buddy = true;

    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });

}

module.exports = verifyToken;
