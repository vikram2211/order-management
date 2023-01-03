const customerModel = require("../models/Costumer");
const jwt = require('jsonwebtoken');

const { isEmail } = require("validator");

const {
    isValid,
    isValidName,
    isValidPassword,
    isValidRequestBody,
} = require("../util/validator");




//*****************************************************Customer-Creation****************************************************************//


const createCustomer = async function (req, res) {

    try {
        let data = req.body;

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, msg: "please fill all the fields." })
        }

        const { name, email, password } = data;

        if (!isValid(name)) {
            return res.status(400).send({ status: false, msg: "please provide a name." })
        }

        if (!isValidName(name)) {
            return res.status(400).send({ status: false, msg: "please provide a valid name." })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "please provide  email." })
        }

        if (!isEmail(email)) {
            return res.status(400).send({ status: false, msg: "please provide a valid email." })
        }

        const emailExist = await customerModel.findOne({ email: email });

        if (emailExist) {
            return res.status(400).send({ status: false, msg: "Email already exist." })
        }


        if (!isValid(password)) {
            return res.status(400).send({ status: false, msg: "please provide  password." })
        }

        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, msg: "Password must be between 8-15 characters." })
        }

        let savedData = await customerModel.create(data);
        res.status(201).send({ status: true, msg: "Customer created successfully", data: savedData })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }

}


//*****************************************************Customer-Login****************************************************************//

const loginUser = async function (req, res) {
    try {
        let data = req.body;
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, msg: "please fill all the fields." })
        }
        const { email, password } = data;

        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "please provide  email." })
        }

        if (!isEmail(email)) {
            return res.status(400).send({ status: false, msg: "please provide a valid email." })
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, msg: "please provide  password." })
        }

        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, msg: "Password must be between 8-15 characters." })
        }

        let customerFind = await customerModel.find({ email, password });

        if (!customerFind) {
            return res.status(401).send({
                status: false,
                message: "Invalid Credentials.",
            });
        };

        let token = jwt.sign(
            { customerId: customerFind._id },
            "This-is-a-Secret-Key-for-Login(!@#$%^&*(</>)))",
            {
                expiresIn: "24h"
            }
        );

        const customerData = {
            customerId: customerFind._id,
            token: token
        }

        return res.status(200).send({ status: true, msg: "Customer loggin successfully.", data: customerData })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}



module.exports = createCustomer;
module.exports = loginUser;