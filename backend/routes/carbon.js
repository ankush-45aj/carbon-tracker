const router = require("express").Router();

const CarbonData = require("../models/CarbonData");

router.post("/", async (req, res) => {

  try {

    const data = new CarbonData(req.body);

    await data.save();

    res.json(data);

  } catch (err) {

    res.status(500).json(err);

  }

});

router.get("/:userId", async (req, res) => {

  try {

    const data = await CarbonData.find({ userId: req.params.userId });

    res.json(data);

  } catch (err) {

    res.status(500).json(err);

  }

});

router.get("/", async (req, res) => {
  try {
    const data = await CarbonData.find();
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await CarbonData.findByIdAndDelete(req.params.id);
    res.json("Record has been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;