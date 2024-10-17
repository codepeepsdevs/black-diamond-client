import { DateRangeData } from "@/constants/types";

export interface IUpdateUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  bio?: string;
}

export type UsersStatsData = DateRangeData;

export type UsersStatsResponse = {
  usersCount: number;
  upTrend: boolean;
};
