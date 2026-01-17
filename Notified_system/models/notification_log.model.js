class NotificationLog {
    constructor({ log_id, subscription_id, channel, status, message, sent_at }) {
        this.id = log_id;
        this.subscriptionId = subscription_id;
        this.channel = channel;
        this.status = status;
        this.message = message;
        this.sentAt = sent_at;
    }
}
module.exports = NotificationLog;