export class Base {
  _id: string;
  createdOn: Date;
  createdBy: string;
  updatedOn: Date;
  updatedBy: string;

  constructor() {
    this._id = null;
    this.createdOn = null;
    this.createdBy = null;
    this.updatedOn = null;
    this.updatedBy = null;
  }
}
