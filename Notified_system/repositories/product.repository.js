const pool = require('../config/db');

class ProductRepository {
    async updateStock(itemId, count) {
        const query = 'UPDATE products SET stock_count = $1 WHERE item_id = $2';
        return pool.query(query, [count, itemId]);
    }
}

module.exports = new ProductRepository();