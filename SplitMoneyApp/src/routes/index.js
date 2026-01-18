const express = require("express");
const userController = require("../controllers/user.controller");
const groupController = require("../controllers/group.controller");
const expenseController = require("../controllers/expense.controller");
const balanceController = require("../controllers/balance.controller");

const settlementController = require("../controllers/settlement.controller");
const router = express.Router();

router.post("/users", (req, res) =>
  userController.createUser(req, res)
);

router.post("/groups", (req, res) =>
  groupController.createGroup(req, res)
);

router.post("/groups/:groupId/users", (req, res) =>
  groupController.addUserToGroup(req, res)
);


router.post("/expenses", (req, res) =>
  expenseController.addExpense(req, res)
);


router.get("/balances/:userId", (req, res) =>
  balanceController.getBalances(req, res)
);


router.post("/settle", (req, res) =>
  settlementController.settle(req, res)
);



module.exports = router;
