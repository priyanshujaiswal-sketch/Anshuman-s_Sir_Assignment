const pool = require('../config/db');

class NotificationLogRepository {
    async createLog(subscriptionId, channel, status, message) {
        const query = `
            INSERT INTO notification_logs
            (subscription_id, channel, status, message, sent_at)
            VALUES ($1, $2, $3, $4, NOW())
        `;
        return pool.query(query, [subscriptionId, channel, status, message]);
    }
}

module.exports = new NotificationLogRepository();