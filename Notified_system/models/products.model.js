class Product {
  constructor({ item_id, name, stock_count, last_updated }) {
    this.itemId = item_id;
    this.name = name;
    this.stockCount = stock_count;
    this.lastUpdated = last_updated;
  }
}

module.exports = Product;