module.exports = ConflictError;

function ConflictError(message) {
    this.name = 'ConflictError';
    this.message = message || 'Conflito';
}