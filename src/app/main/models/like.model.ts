import {Job} from "./job.model";
import {User} from "../../auth/models/user.model";

export interface Like {
  id: number;
  userId?: number;
  jobId?: number;
}
