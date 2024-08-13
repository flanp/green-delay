const triBool = [-1, 0, 1] // false, don't know, true

const roles = {
    U: 'Utilizador',
    W: 'Colaborador',
    A: 'Administrador'
};

const streamCategories = {
    E: 'Europa',
    A: 'América',
    O: 'Outros'
};

const streamRatings = {
    F: 'Feed',
    D: 'Delay',
    FSF: 'feed / sinal fraco',
    FS: 'feed / substituída',
    FT: 'feed / teste',
    FSS: 'feed / sem som',
    PFC: 'PFC',
    PFCI: 'PFCi'
};

const dbModels = {
    user: 'User',
    stream: 'Stream'
};

module.exports = {
    triBool,
    roles,
    streamCategories,
    streamRatings,
    dbModels
};