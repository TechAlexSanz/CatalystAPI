import { Role } from './Role';

export type User = {
  code: number;
  password: string;
  profileImage?: string;
  role: Role;
};
