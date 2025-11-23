const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },



    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },


    phone: {
      type: String,
      required: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },


    isActive: {
      type: Boolean,
      default: false, // Après activation par email
    },

    activationCode: {
      type: String, // token d'activation envoyé par email
    },

    resetPasswordToken: {
      type: String, // token pour reset mot de passe
    },

    resetPasswordExpires: {
      type: Date, // expiration du token
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
