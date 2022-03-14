import {Job} from "./job.model";
import {User} from "../../auth/models/user.model";

export interface Application {
  id: number;
  jobId?: number;
  userId?: number;
  accepted?: Boolean;
  job?: Job;
  user?: User;
}
