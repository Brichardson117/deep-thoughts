const jwt = require("jsonwebtoken");

const secert = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secert, { expiresIn: expiration });
  },
  authMiddleware: function ({ req }) {
    //alows tokens to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    //separate "Bearer" from "<tokenvalue>"
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }
    //if no token, return request object as is
    if (!token) {
      return req;
    }

    try {
      //decode and attach user data to request
      const { data } = jwt.verify(token, secert, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Invalid Token");
    }
    //return updated request object
    return req;
  },
};
