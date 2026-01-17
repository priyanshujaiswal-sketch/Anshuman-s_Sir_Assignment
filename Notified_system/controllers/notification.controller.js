const service = require("../services/notification.service"); 

class NotificationController {

  async subscribe(req, res) {
    try {
        let { userId, itemId, email, phone, pushToken, channels } = req.body;
        
        if (!userId) {
            if (email) userId = `guest_email_${email}`;
            else if (phone) userId = `guest_phone_${phone}`;
            else if (pushToken) userId = `guest_push_${pushToken}`;
            else return res.status(400).json({ error: "Contact info required." });
        }

        const data = { userId, itemId, email, phone, pushToken, channels };
        const result = await service.subscribe(data);
        
        if (!result) return res.status(200).json({ message: "Already subscribed." });
        
        res.status(201).json({ 
            message: "Subscribed successfully", 
            id: result.subscription_id 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
  }

  async restock(req, res) {
    try {
        const { itemId, newStockCount } = req.body;
        const result = await service.processRestock(itemId, newStockCount);
        
        res.status(200).json({ 
            message: "Restock processed", 
            ...result 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
  }

  async recover(req, res) {
    try {
        await service.recoverCrash();
        res.status(200).json({ 
            message: "Crash recovery completed - pending users notified" 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new NotificationController();