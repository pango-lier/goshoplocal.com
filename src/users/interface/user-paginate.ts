import { IPaginate } from 'src/paginate/paginate.interface';

export interface UserPaginateInterface extends IPaginate {
  name?: string;
}
