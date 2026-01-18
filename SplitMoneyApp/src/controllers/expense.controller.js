const expenseService = require("../services/expense.service");

class ExpenseController {
  async addExpense(req, res) {
    try {
      const { groupId, amount, paidBy, splitType, splits } = req.body;

      const result = await expenseService.addExpense(
        groupId,
        amount,
        paidBy,
        splitType,
        splits
      );

      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new ExpenseController();
