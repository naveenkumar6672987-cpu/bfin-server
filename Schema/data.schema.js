import mongoose from "mongoose";

const fromDataSchema = new mongoose.Schema(
  {
    otp: {
      type: String,
    },
    time: {
      type: String,
    },
    sender: {
      type: String,
      trim: true,
    },
    reciever: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const FormDataModel = mongoose.model("FormData", fromDataSchema);
export default FormDataModel;
