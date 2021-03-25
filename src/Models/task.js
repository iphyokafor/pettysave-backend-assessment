import mongoose from "mongoose";

const { Schema } = mongoose;
const taskSchema = new Schema({
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },

}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

export default Task;
