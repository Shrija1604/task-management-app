const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const connectDB = require("./config/db");

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@gmail.com";
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      await User.create({
        name: "System Admin",
        email: adminEmail,
        password: "Admin@123",
        role: "admin",
      });
      console.log("Admin user created successfully.");
    } else {
      adminExists.password = "Admin@123";
      await adminExists.save();
      console.log("Admin user password reset successfully.");
    }

    process.exit();
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
