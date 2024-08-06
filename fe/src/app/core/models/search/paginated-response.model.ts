export class PaginatedResponse<T> {
  pageSize: number;
  pageNumber: number;
  numberOfRecords: number;
  data: T[];
  hasNext: boolean;

  constructor() {
    this.pageSize = 20;
    this.pageNumber = 0;
    this.numberOfRecords = null;
    this.data = null;
    this.hasNext = false;
  }
}
