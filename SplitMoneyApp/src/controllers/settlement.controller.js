const settlementService = require("../services/settlement.service");

class SettlementController {
  async settle(req, res) {
    try {
      const { fromUser, toUser, amount } = req.body;
      const result = await settlementService.settlePayment(
        fromUser,
        toUser,
        amount
      );
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new SettlementController();
