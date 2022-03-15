import {Job} from "../../main/models/job.model";
import {Like} from "../../main/models/like.model";
import {Application} from "../../main/models/application.model";

export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  organizationName?: string;
  email: string;
  password?: string;
  role: string;
  jobs?: Job[];
  likes?: Like[];
  applications?: Application[];
}
