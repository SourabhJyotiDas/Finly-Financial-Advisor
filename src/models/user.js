import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
   name: String,
   email: { type: String, unique: true, required: true },
   phone: String,
   image: String,
   gender: { type: String, enum: ["male", "female", "others"], default: "male" },
   password: String,
   provider: String,
   financialGoals: String,
   income: Number,
   role: { type: String, enum: ["user", "premium-user", "owner"], default: "user" },
   emailVerified: { type: Boolean, default: false },
   verificationCode: Number
}, { timestamps: true });


const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
