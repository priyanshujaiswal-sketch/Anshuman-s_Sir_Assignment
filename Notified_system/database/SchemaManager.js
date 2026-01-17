const pool = require('../config/db');
const initialProducts = require('./initial_products');

class SchemaManager {
    
    async init() {
        try {
            console.log("🏗️  SchemaManager: Starting database setup...");
            await this.createProductsTable();
            await this.createSubscriptionsTable();
            
            await this.createNotificationLogsTable(); 
            
            await this.createIndices();
            await this.seedInitialData();
            
            console.log("✅ SchemaManager: Database fully setup with Log Table!");
            process.exit(0);
        } catch (err) {
            console.error("❌ SchemaManager Failed:", err);
            process.exit(1);
        }
    }

    async createProductsTable() {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                item_id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                stock_count INT DEFAULT 0,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("   - Products table checked.");
    }

    async createSubscriptionsTable() {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS subscriptions (
                subscription_id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                item_id INT REFERENCES products(item_id) ON DELETE CASCADE,
                email VARCHAR(255),
                phone VARCHAR(20),
                push_token VARCHAR(255),
                notify_email BOOLEAN DEFAULT FALSE,
                notify_sms BOOLEAN DEFAULT FALSE,
                notify_push BOOLEAN DEFAULT FALSE,
                status VARCHAR(50) DEFAULT 'PENDING',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("   - Subscriptions table checked.");
    }

    async createNotificationLogsTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS notification_logs (
                log_id SERIAL PRIMARY KEY,
                subscription_id INT REFERENCES subscriptions(subscription_id) ON DELETE SET NULL,
                channel VARCHAR(50), -- EMAIL, SMS, PUSH
                status VARCHAR(50),  -- SENT, FAILED
                message TEXT,
                sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await pool.query(query);
        console.log("   - Notification Logs table created.");
    }

    async createIndices() {
        await pool.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS idx_one_pending_sub 
            ON subscriptions (user_id, item_id) 
            WHERE status = 'PENDING'
        `);
        console.log("   - Indices applied.");
    }

    async seedInitialData() {
        const query = `INSERT INTO products (item_id, name, stock_count) VALUES ($1, $2, $3) ON CONFLICT (item_id) DO NOTHING`;
        for (const item of initialProducts) {
            await pool.query(query, [item.id, item.name, item.stock]);
        }
        console.log("   - Data seeded.");
    }
}

if (require.main === module) {
    new SchemaManager().init();
}

module.exports = SchemaManager;