const fs = require('fs'); 
const path = require('path');
const subRepo = require('../repositories/subscription.repository');
const productRepo = require('../repositories/product.repository');
const logRepo = require('../repositories/notification_log.repository');
const { sendEmail, sendSMS, sendPush } = require("../utils/provider.util");

class NotificationService {

    constructor() {
        this.logDir = path.join(__dirname, '../notifications');
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir);
        }
    }

    async subscribe(data) {
        const { userId, itemId, email, phone, pushToken, channels } = data;
        
        const notifyEmail = channels?.email || false;
        const notifySms = channels?.sms || false;
        const notifyPush = channels?.push || false;

        const result = await subRepo.create(
            userId, itemId, email, phone, pushToken, 
            notifyEmail, notifySms, notifyPush
        );
        
        return result.rows[0];
    }

    async processRestock(itemId, newStock) {
        await productRepo.updateStock(itemId, newStock);

        // console.log("SERVER CRASH...");
        // process.exit(1);
        
        const result = await subRepo.getPendingByItem(itemId);
        const subscribers = result.rows;

        if (subscribers.length === 0) return { count: 0 };

        const { successIds, fileLogs } = await this._sendNotifications(subscribers, itemId);

        if (successIds.length > 0) {
            await subRepo.markNotified(successIds);
        }

        this._logToFile(itemId, fileLogs);

        return { count: successIds.length };
    }

    async _sendNotifications(users, itemId) {
        const successIds = [];
        const fileLogs = []; 
        const msg = `Item ${itemId} is in stock!`;

        for (const user of users) {
            let sent = false;
            let userLogEntry = { userId: user.user_id, channels: [] }; // For JSON file
            
            // Try email first
            if (user.notify_email && user.email) {
                 try { 
                     await sendEmail(user.email, msg);
                     await logRepo.createLog(user.subscription_id, 'EMAIL', 'SENT', msg);
                     sent = true; 
                     userLogEntry.channels.push('EMAIL');
                 } catch (e) {
                     await logRepo.createLog(user.subscription_id, 'EMAIL', 'FAILED', e.message);
                 }
            }

            // If email not sent, try SMS
            if (!sent && user.notify_sms && user.phone) {
                 try { 
                     await sendSMS(user.phone, msg);
                     await logRepo.createLog(user.subscription_id, 'SMS', 'SENT', msg);
                     sent = true; 
                     userLogEntry.channels.push('SMS');
                 } catch (e) {
                     await logRepo.createLog(user.subscription_id, 'SMS', 'FAILED', e.message);
                 }
            }

            // If email and SMS not sent, try push
            if (!sent && user.notify_push && user.push_token) {
                 try { 
                     await sendPush(user.push_token, msg);
                     await logRepo.createLog(user.subscription_id, 'PUSH', 'SENT', msg);
                     sent = true; 
                     userLogEntry.channels.push('PUSH');
                 } catch (e) {
                     await logRepo.createLog(user.subscription_id, 'PUSH', 'FAILED', e.message);
                 }
            }

            if (sent) {
                successIds.push(user.subscription_id);
                fileLogs.push(userLogEntry);
            }
        }
        
        return { successIds, fileLogs };
    }

    _logToFile(itemId, data) {
        if (data.length === 0) return;
        const fileName = `restock_${itemId}_${Date.now()}.json`;
        fs.writeFileSync(path.join(this.logDir, fileName), JSON.stringify(data, null, 2));
    }

    async recoverCrash() {
        const result = await subRepo.getPendingWithStock();
        if (result.rows.length === 0) {
            console.log("[Recovery] No pending notifications to recover.");
            return;
        }

        const subscribers = result.rows;
        const groupedByItem = {};

        // Group subscribers by itemId
        for (const user of subscribers) {
            if (!groupedByItem[user.item_id]) {
                groupedByItem[user.item_id] = [];
            }
            groupedByItem[user.item_id].push(user);
        }

        // Process each item and send notifications
        for (const itemId in groupedByItem) {
            const users = groupedByItem[itemId];
            const { successIds, fileLogs } = await this._sendNotifications(users, itemId);

            if (successIds.length > 0) {
                await subRepo.markNotified(successIds);
                this._logToFile(itemId, fileLogs);
            }
        }

        console.log(`[Recovery] Recovered and notified ${subscribers.length} pending users.`);
    }
}

module.exports = new NotificationService();