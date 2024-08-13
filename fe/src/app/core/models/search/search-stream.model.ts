import { Pagination } from './pagination.model';

export class SearchStream extends Pagination {
  id: number;
  category: string;

  constructor() {
    super();
  }
}
