import {JobType} from "./job-type.model";
import {JobCategory} from "./job-category.model";
import {User} from "../../auth/models/user.model";

export interface Job {
  id: number;
  userId: number;
  title: string;
  description: string;
  jobTypeId: number;
  jobCategoryId: number;
  jobType?: JobType;
  jobCategory?: JobCategory;
  user?: User
}
