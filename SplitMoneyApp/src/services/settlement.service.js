const { v4: uuidv4 } = require("uuid");
const pool = require("../db/postgres");

class SettlementService {
  async settlePayment(fromUser, toUser, amount) {
    const result = await pool.query(
      `
      SELECT amount FROM balances
      WHERE user_id = $1 AND owes_to = $2
      `,
      [fromUser, toUser]
    );

    if (result.rows.length === 0) {
      throw new Error("No balance exists to settle");
    }

    const currentAmount = Number(result.rows[0].amount);

    if (amount > currentAmount) {
      throw new Error("Settlement amount exceeds balance");
    }

    if (amount === currentAmount) {
      await pool.query(
        `
        DELETE FROM balances
        WHERE user_id = $1 AND owes_to = $2
        `,
        [fromUser, toUser]
      );
    } else {
      await pool.query(
        `
        UPDATE balances
        SET amount = amount - $3
        WHERE user_id = $1 AND owes_to = $2
        `,
        [fromUser, toUser, amount]
      );
    }

    await pool.query(
      `
      INSERT INTO settlements (id, from_user, to_user, amount)
      VALUES ($1, $2, $3, $4)
      `,
      [uuidv4(), fromUser, toUser, amount]
    );

    return { message: "Settlement successful" };
  }
}

module.exports = new SettlementService();
