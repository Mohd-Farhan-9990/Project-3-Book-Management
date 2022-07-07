const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Book",
      trim: true,
    },
    reviewedBy: {
      type: String,
      required: true,
      default: "Guest",
      trim: true,
    },
    reviewedAt: {
      type: Date,
      required: true,
    },
    rating: {
      type: Number,
      minlength: 1,
      maxlength: 5,
      required: true,
    },
    review: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("review", reviewSchema);
