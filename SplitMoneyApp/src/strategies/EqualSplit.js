const SplitStrategy = require("./SplitStrategy");

class EqualSplit extends SplitStrategy {
  split(amount, users) {
    const perUser = amount / users.length;

    return users.map(userId => ({
      userId,
      amount: perUser
    }));
  }
}

module.exports = EqualSplit;
