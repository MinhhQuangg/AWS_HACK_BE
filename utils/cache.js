const cache = new Map();

const setMessages = (sessionId, messages) => {
  cache.set(sessionId, { messages, timestamp: Date.now() });
}

const getMessages = (sessionId) => {
  const data = cache.get(sessionId);
  if (!data) return null;
  const isExpired = (Date.now() - data.timestamp) > 10 * 60 * 1000;
  return isExpired ? null : data.messages;
}

module.exports = { setMessages, getMessages };