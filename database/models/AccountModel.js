const { Schema, model } = require("mongoose");

// Petition Schema
const PetitionSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: "" },
  location: { type: String, required: true },
  category: {
    type: [String],
    enum: [
      "Environment",
      "Economic Justice",
      "Women's Rights",
      "Education",
      "Disability",
      "Sports",
      "Entertainment and Media",
      "Digital Rights",
    ],
    required: true,
    validate: {
      validator: (v) => v.length > 0,
      message: "At least one category must be selected.",
    },
  },
  scope: {
    type: String,
    enum: ["Local", "Global", "National"],
    required: true,
  },
  authors: [{ type: String, required: true }],
  targetEntities: [{ type: String, required: true }],
  targetSupporters: {
    type: Number,
    required: true,
    min: [1, "Target supporters must be at least 1"],
  },
  supporters: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "Account" },
      signedAt: { type: Date, default: Date.now },
    },
  ],
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "success", "closed"],
    default: "active",
  },
  createdAt: { type: Date, default: Date.now },
  targetDate: {type: Date},
  verified: {
    type: String,
    enum: ['Y', 'N'],
    default: 'N', // Default to "N" (unverified)
  },
});

// Middleware to update the status if supporters reach the target
PetitionSchema.pre("save", function (next) {
  if (this.supporters.length >= this.targetSupporters) {
    this.status = "success";
  }
  next();
});

// Account Schema
const AccountSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  signedPetitions: [{ type: Schema.Types.ObjectId, ref: "Petition" }],
  createdPetitions: [{ type: Schema.Types.ObjectId, ref: "Petition" }], // New field for petitions created
});

// Export Models
const Petition = model("Petition", PetitionSchema);
const Account = model("Account", AccountSchema);

module.exports = { Petition, Account };
