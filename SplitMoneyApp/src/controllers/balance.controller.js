const balanceService = require("../services/balance.service");

class BalanceController {
  async getBalances(req, res) {
    try {
      const { userId } = req.params;
      const balances = await balanceService.getUserBalances(userId);
      res.status(200).json(balances);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new BalanceController();
