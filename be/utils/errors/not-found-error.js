module.exports = NotFoundError;

function NotFoundError(message) {
    this.name = 'NotFoundError';
    this.message = message || 'Não foi encontrado';
}