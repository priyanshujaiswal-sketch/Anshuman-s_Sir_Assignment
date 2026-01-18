const expenseService = require("../services/expense.service");

class ExpenseController {
  async addExpense(req, res) {
    try {
      const { groupId, amount, paidBy } = req.body;
      const result = await expenseService.addExpense(groupId, amount, paidBy);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new ExpenseController();
