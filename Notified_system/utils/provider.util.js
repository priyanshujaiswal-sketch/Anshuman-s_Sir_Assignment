
exports.sendEmail = async (email, message) => {
  if (Math.random() < 0.1) throw new Error("Email Server Timeout");
  console.log(`[EMAIL] To: ${email} | Body: ${message}`);
  return true;
};

exports.sendSMS = async (phone, message) => {
  console.log(`SMS] To: ${phone} | Body: ${message}`);
  return true;
};

exports.sendPush = async (token, message) => {
  console.log(`[PUSH] To: ${token} | Body: ${message}`);
  return true;
};