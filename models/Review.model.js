const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  // Validaciones de base de datos
  {
    show: {
    type: String
    },
    star:{
        type:Number,
        min:1,
        max:5,
        required:true,
    },
    title: {
      type: String,
      required: true,
    },
    review: {
        type:String
      },
    user: {
      type: Schema.Types.ObjectId, // Esto sera un ID que apunta a otro documento de la DB
      ref: "User",
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Review = model("Review", reviewSchema);

module.exports = Review;
