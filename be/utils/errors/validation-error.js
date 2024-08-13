module.exports = ValidationError;

function ValidationError(message) {
    this.name = 'ValidationError';
    this.message = message || 'Erro de validação';
}