const pool = require("../db/postgres");

class BalanceService {
  async getUserBalances(userId) {
    const result = await pool.query(
      `
      SELECT user_id, owes_to, amount
      FROM balances
      WHERE user_id = $1 OR owes_to = $1
      `,
      [userId]
    );

    return result.rows;
  }
}

module.exports = new BalanceService();
