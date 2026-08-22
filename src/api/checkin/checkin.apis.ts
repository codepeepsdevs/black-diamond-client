import { request } from "@/utils/axios-utils";
import { AxiosResponse } from "axios";
import {
  CheckInByIdResponse,
  CheckInByQRCodeRequest,
  CheckInByQRCodeResponse,
  CheckInStatsResponse,
  GetTicketsForEventResponse,
  TicketCheckInInfo,
  UndoCheckInResponse,
  GetTicketByCheckinCodeResponse,
} from "./checkin.types";

export const checkInByQRCode = async (data: CheckInByQRCodeRequest) => {
  return await request<CheckInByQRCodeResponse>({
    url: `/checkin/qr-code`,
    method: "post",
    data,
  });
};

export const checkInById = async (ticketId: string) => {
  return await request<CheckInByIdResponse>({
    url: `/checkin/ticket/${ticketId}`,
    method: "post",
  });
};

export const undoCheckIn = async (ticketId: string) => {
  return await request<UndoCheckInResponse>({
    url: `/checkin/undo/${ticketId}`,
    method: "post",
  });
};

export const getEventTickets = async ({
  eventId,
  page,
  limit,
  search,
}: {
  eventId: string;
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const params = new URLSearchParams();
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  if (search) params.set("search", search);
  return await request<GetTicketsForEventResponse>({
    url: `/checkin/event/${eventId}/tickets?${params.toString()}`,
    method: "get",
  });
};

export const getCheckInStats = async (eventId: string) => {
  return await request<CheckInStatsResponse>({
    url: `/checkin/event/${eventId}/stats`,
    method: "get",
  });
};

export const getTicketByCheckinCode = async (checkinCode: string) => {
  return await request<GetTicketByCheckinCodeResponse>({
    url: `/checkin/ticket/code/${encodeURIComponent(checkinCode)}`,
    method: "get",
  });
};
