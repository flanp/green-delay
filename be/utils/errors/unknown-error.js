module.exports = UnknownError;

function UnknownError(message) {
    this.name = 'UnknownError';
    this.message = message || 'Ocorreu um erro';
}