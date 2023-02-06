const jwt = require("jsonwebtoken");
const fs = require("fs");
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    if (token) {
      const blacklisted = JSON.parse(
        fs.readFileSync("./blacklist.json", "utf-8")
      );
      if (blacklisted.includes(token)) {
        return res.send("Please login again");
      }
      const decoded = jwt.verify(token, "coder");
      if (decoded) {
        const userrole = decoded.role;
        req.body.roleofuser = userrole;
        next();
      } else {
        res.send("Please login again");
      }
    } else {
      res.send("Please login again");
    }
  } catch (error) {
    res.send({ error: error });
  }
};

const authorize = (array_of_roles) => {
  return (req, res, next) => {
    const user_role = req.body.roleofuser;
    if (array_of_roles.includes(user_role)) {
      next();
    } else {
      res.send("Not authorized");
    }
  };
};

module.exports = { authenticate, authorize };
