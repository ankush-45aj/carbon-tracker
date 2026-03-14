const mongoose = require("mongoose");

const CarbonSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  date: String,

  transport: Number,

  electricity: Number,

  lpg: Number,

  transportCO2: Number,

  electricityCO2: Number,

  lpgCO2: Number,

  homeEnergyCO2: Number,

  flights: Number,
  waste: Number,
  meatMeals: Number,

  flightsCO2: Number,
  wasteCO2: Number,
  meatCO2: Number,

  totalCO2: Number

});

module.exports = mongoose.model("CarbonData", CarbonSchema);