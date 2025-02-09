class Chat {
  constructor() {
    this.messages = JSON.parse(localStorage.getItem('animuChats')) || {};
  }

  sendMessage(senderId, receiverId, message) {
    const chatId = this.getChatId(senderId, receiverId);
    if (!this.messages[chatId]) {
      this.messages[chatId] = [];
    }

    const newMessage = {
      senderId,
      message,
      timestamp: new Date().toISOString()
    };

    this.messages[chatId].push(newMessage);
    localStorage.setItem('animuChats', JSON.stringify(this.messages));
    return newMessage;
  }

  getMessages(senderId, receiverId) {
    const chatId = this.getChatId(senderId, receiverId);
    return this.messages[chatId] || [];
  }

  getChatId(user1Id, user2Id) {
    return [user1Id, user2Id].sort().join('-');
  }
}
