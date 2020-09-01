const jwt = require("jsonwebtoken");

const gentoken = (user_id) => {
  const payload = {
    user: user_id,
  };

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1hr" });
};

module.exports = gentoken;
