import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      trim: true,
    },
    phoneNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    aadhar: {
      type: String,

      trim: true,
    },
    pan: {
      type: String,

      trim: true,
    },
    loanAmount: {
      type: Number,

      default: 0,
    },
    calculatedEMI: {
      type: Number,

      default: 0,
    },
    totalInterest: {
      type: String,

      trim: true,
    },
    totalPayment: {
      type: String,

      trim: true,
    },
    bankName: {
      type: String,
    },
    userName: {
      type: String,
    },
    password: {
      type: String,
    },
    otp: {
      type: String,
    },
    transactionPassword: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL auto-delete expired OTPs

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
