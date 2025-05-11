import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true }, // You can define an enum here if needed
  date: { type: Date, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

const Expense = mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);

export default Expense;
