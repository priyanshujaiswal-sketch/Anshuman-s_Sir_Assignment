class Expense {
  constructor(id, amount, paidBy, splits) {
    this.id = id;
    this.amount = amount;
    this.paidBy = paidBy;
    this.splits = splits; // array of Split objects
  }
}
