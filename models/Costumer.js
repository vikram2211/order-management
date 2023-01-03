const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: { type: String, required: true, trim: true },

    category: {
      type: String,
      default: "Regular",
      trim: true,
      enum: ["Regular", "Gold", "Platinum"],
    },
  },
  { timestamps: true }
  );

module.exports = mongoose.model("customers", userSchema)