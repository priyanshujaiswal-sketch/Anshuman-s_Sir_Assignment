const { v4: uuidv4 } = require("uuid");
const pool = require("../db/postgres");
const EqualSplit = require("../strategies/EqualSplit");

class ExpenseService {

  async addExpense(groupId, amount, paidBy) {
    const expenseId = uuidv4();

    // 1️⃣ Get group members
    const usersResult = await pool.query(
      "SELECT user_id FROM group_members WHERE group_id = $1",
      [groupId]
    );

    const users = usersResult.rows.map(r => r.user_id);

    // 2️⃣ Create expense
    await pool.query(
      `INSERT INTO expenses (id, group_id, amount, paid_by)
       VALUES ($1, $2, $3, $4)`,
      [expenseId, groupId, amount, paidBy]
    );

    // 3️⃣ Split expense
    const splitStrategy = new EqualSplit();
    const splits = splitStrategy.split(amount, users);

    // 4️⃣ Save splits + update balances
    for (const split of splits) {
      await pool.query(
        `INSERT INTO expense_splits (expense_id, user_id, amount)
         VALUES ($1, $2, $3)`,
        [expenseId, split.userId, split.amount]
      );

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
