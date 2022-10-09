const mongoose = require("mongoose");
// Mongoose plugin that lets you create fields which autoincrement their value every time a new document is inserted in a collection
const AutoIncrement = require("mongoose-sequence")(mongoose);

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Start the
noteSchema.plugin(AutoIncrement, {
  // The field name
  inc_field: "ticket",
  id: "ticketNums",
  // Start from this number
  start_seq: 500,
});

module.exports = mongoose.model("Note", noteSchema);
