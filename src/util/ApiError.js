module.exports = class APIError extends Error {
    constructor(message) {
      super(message);
    }
  }