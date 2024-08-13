module.exports = ForbiddenError;

function ForbiddenError(message) {
    this.name = 'ForbiddenError';
    this.message = message || 'Permissões inválidas';
}