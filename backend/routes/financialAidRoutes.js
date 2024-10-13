const express = require("express");
const FinancialAid = require("../models/FinancialAid");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const financialAidData = await FinancialAid.find();
    res.json(financialAidData);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
