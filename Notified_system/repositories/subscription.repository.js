const pool = require('../config/db');

class SubscriptionRepository {
    
    async create(userId, itemId, email, phone, pushToken, notifyEmail, notifySms, notifyPush) {
        const query = `
            INSERT INTO subscriptions 
            (user_id, item_id, email, phone, push_token, notify_email, notify_sms, notify_push, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING')
            ON CONFLICT (user_id, item_id) WHERE status = 'PENDING' DO NOTHING
            RETURNING subscription_id;
        `;
        const params = [userId, itemId, email, phone, pushToken, notifyEmail, notifySms, notifyPush];
        return pool.query(query, params);
    }

    async getPendingByItem(itemId) {
        const query = `SELECT * FROM subscriptions WHERE item_id = $1 AND status = 'PENDING'`;
        return pool.query(query, [itemId]);
    }

    async markNotified(ids) {
        const query = `UPDATE subscriptions SET status = 'NOTIFIED' WHERE subscription_id = ANY($1::int[])`;
        return pool.query(query, [ids]);
    }

    async getPendingWithStock() {
        const query = `
            SELECT s.* 
            FROM subscriptions s
            JOIN products p ON s.item_id = p.item_id
            WHERE s.status = 'PENDING' AND p.stock_count > 0
        `;
        return pool.query(query);
    }
}

module.exports = new SubscriptionRepository();