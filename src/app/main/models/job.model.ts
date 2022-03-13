import {JobType} from "./job-type.model";
import {JobCategory} from "./job-category.model";

export interface Job {
  id: number;
  organizationId: number;
  title: string;
  description: string;
  jobTypeId: number;
  jobCategoryId: number;
  jobType?: JobType;
  jobCategory?: JobCategory;
}
