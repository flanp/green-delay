export enum StreamRating {
  'F' = 'Feed',
  'D' = 'Delay',
  'FSF' = 'FSF',
  'FS' = 'FS',
  'FT' = 'FT',
  'FSS' = 'FSS',
  'PFC' = 'PFC',
  'PFCI' = 'PFCi'
}

export const streamRatingsList = [
  { 
    label: 'Avaliação',
    value: null
  },
  {
    label: 'Feed',
    value:  'F'
  },
  {
    label: 'Delay',
    value:  'D'
  },
  {
    label: 'feed / sinal fraco',
    value:  'FSF'
  },
  {
    label: 'feed / substituída',
    value:  'FS'
  },
  {
    label: 'feed / teste',
    value:  'FT'
  },
  {
    label: 'feed / sem som',
    value:  'FSS'
  },
  {
    label: 'PFC',
    value:  'PFC'
  },
  {
    label: 'PFCi',
    value:  'PFCi'
  }
];
