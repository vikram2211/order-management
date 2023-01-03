const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("../util/validator");

//-------------------------------------------------------------------------
//                        1. Authentication.
//-------------------------------------------------------------------------

const authentication = async function (req, res, next) {
  try {
    const token = req.header("Authorization");
    // const token = req.header("Authorization", "Bearer ");

    if (!token) {
      return res.status(400).send({
        status: false,
        message: `Missing authentication token in request`,
      });
    }
    let splitToken = token.split(" ");

    jwt.verify(
      splitToken[1],
      "This-is-a-Secret-Key-for-Login(!@#$%^&*(</>)))",
      (error, decodedToken) => {
        if (error) {
          return res.status(401).send({
            status: false,
            message: error.message,
          });
        }

        req.customerID = decodedToken.customerID; // Set userId in Request for use in Authorization.
        next();
      }
    );
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//-------------------------------------------------------------------------
//                          2. Authorization.
//-------------------------------------------------------------------------

const authorization = async function (req, res, next) {
  try {
    // console.log("Authorization.");

    const customerID_Params = req.params.customerID.trim();

    if (!isValidObjectId(customerID_Params)) {
      return res.status(400).send({
        status: false,
        message: "customerID in Params Not a valid Mongoose ObjectID.",
      });
    }

    if (req.customerID !== customerID_Params) {
      return res.status(403).send({
        status: false,
        message:
          "Unauthorised Access: You are NOT authorised to place the Order.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { authentication, authorization };