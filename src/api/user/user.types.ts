import { DateRangeData, User } from "@/constants/types";

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

export type NewUsersTodayStats = {
  newUsersCount: number;
  upTrend: boolean;
};

export type GetUsersData = {
  users: (User & {
    amountSpent: number;
  })[];
  usersCount: number;
  totalUsers: number;
};

export type AdminUsersStats = {
  adminsCount: number;
};

export type DownloadUsersData = Response;
