const express = require("express");
const router = express.Router();

const controller = require("../controllers/notification.controller");

router.post("/subscribe", (req, res) => controller.subscribe(req, res));
router.post("/restock", (req, res) => controller.restock(req, res));
router.post("/recover", (req, res) => controller.recover(req, res));

module.exports = router;