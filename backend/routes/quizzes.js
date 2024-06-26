const { error } = require("console");
const express = require("express");
const router = express.Router();
const fs = require("fs").promises;

router.get("/", async (req, res) => {
  try {
    const data = await fs.readFile("../backend/data.json", "utf8");
    res.status(200).send(data);
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: e.message });
  }
});

module.exports = router;
