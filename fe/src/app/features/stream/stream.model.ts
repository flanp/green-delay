import { Base } from 'src/app/core/models/base.model';

export class Stream extends Base {
  id: number;
  title: string;
  startDate: Date;
  startTime: Date;
  publisherId: string;
  publisherName: string;
  subscriberIds: string[];
  isActive: boolean;
  category: string;
  rating: string;
  statsLink: string;

  constructor(id?: number, title?: string) {
    super();
    this.id = id;
    this.title = title;
    this.publisherId = undefined;
    this.publisherName = undefined;
    this.subscriberIds = [];
    this.isActive = false;
    this.category = undefined;
    this.rating = undefined;
    this.statsLink = undefined;
  }
}
