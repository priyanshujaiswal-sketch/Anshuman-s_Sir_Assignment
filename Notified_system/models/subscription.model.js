class Subscription {
  constructor({ subscription_id, user_id, item_id, email, phone, status }) {
    this.id = subscription_id;
    this.userId = user_id;
    this.itemId = item_id;
    this.email = email;
    this.phone = phone;
    this.status = status;
  }
}
module.exports = Subscription;