const monggose = require('mongoose');
const ObjectId = monggose.Schema.Types.ObjectId;

const orderSchema = new monggose.Schema({
    customerID: {
        type: ObjectId,
        ref: "customers",
        required: true, 
        trim: true
    },
    totalOrders: {
        type: Number,
        default: "1"
    },
    discount: {
        type: String,
        default: "0%",
        trim: true
    }
},
    { timestamps: true });

module.exports = monggose.model("orders", orderSchema);