class ExactSplit {
  split(totalAmount, splits) {
    const sum = splits.reduce((acc, s) => acc + s.amount, 0);

    if (sum !== totalAmount) {
      throw new Error("Split amounts must sum to total expense");
    }

    return splits;
  }
}

module.exports = ExactSplit;
