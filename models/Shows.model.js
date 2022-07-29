const { Schema, model } = require("mongoose");

const showSchema = new Schema(
  // Validaciones de base de datos
  {
    apiId: String,
    status: {
        type: String,
        enum: ["pending", "watching", "watched", "nostatus"],
        default: "nostatus",
    },
    isFav: Boolean,
    user: {
        type: Schema.Types.ObjectId, // Esto sera un ID que apunta a otro documento de la DB
        ref: "User", 
    },
    name: String,
    img: String,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Show = model("Show", showSchema);

module.exports = Show;