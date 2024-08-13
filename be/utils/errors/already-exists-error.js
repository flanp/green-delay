module.exports = AlreadyExistsError;

function AlreadyExistsError(message) {
    this.name = 'AlreadyExistsError';
    this.message = message || 'Já existe';
}