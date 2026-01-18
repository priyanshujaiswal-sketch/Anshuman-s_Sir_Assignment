const { v4: uuidv4 } = require("uuid");
const pool = require("../db/postgres");
const EqualSplit = require("../strategies/EqualSplit");
const ExactSplit = require("../strategies/ExactSplit");

class ExpenseService {

  async addExpense(groupId, amount, paidBy, splitType = "EQUAL", splitsFromReq = []) {
    const expenseId = uuidv4();

    // 1️⃣ Create expense entry
    await pool.query(
      `
      INSERT INTO expenses (id, group_id, amount, paid_by)
      VALUES ($1, $2, $3, $4)
      `,
      [expenseId, groupId, amount, paidBy]
    );

    let splits;

    // 2️⃣ Decide split strategy
    if (splitType === "EXACT") {

      const strategy = new ExactSplit();
      splits = strategy.split(amount, splitsFromReq);

    } else {
      // Default = EQUAL split
      const usersResult = await pool.query(
        `SELECT user_id FROM group_members WHERE group_id = $1`,
        [groupId]
      );

      const users = usersResult.rows.map(r => r.user_id);

      const strategy = new EqualSplit();
      splits = strategy.split(amount, users);
    }

    // 3️⃣ Save expense_splits + update balances
    for (const split of splits) {

      // save split
      await pool.query(
        `
        INSERT INTO expense_splits (expense_id, user_id, amount)
        VALUES ($1, $2, $3)
        `,
        [expenseId, split.userId, split.amount]
      );

      // update balances (skip payer)
      if (split.userId !== paidBy) {
        await pool.query(
          `
          INSERT INTO balances (user_id, owes_to, amount)
          VALUES ($1, $2, $3)
          ON CONFLICT (user_id, owes_to)
          DO UPDATE SET amount = balances.amount + EXCLUDED.amount
          `,
          [split.userId, paidBy, split.amount]
        );
      }
    }

    return { message: "Expense added successfully" };
  }
}

module.exports = new ExpenseService();
