import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    deck: {
      type: String,
      enum: ["miscellaneous", "children"],
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    // multiple questions per each flashcard
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
