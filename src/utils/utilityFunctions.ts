import { CalendarEvent, TicketType } from "@/constants/types";
import { AxiosError } from "axios";
import * as dateFns from "date-fns";

export function formatShareUrl(url: string): string {
  const first30: string = url.slice(0, 30);
  return url.length > 30 ? `${first30}...` : first30;
}

export function createFuzzyRegex(filter: string) {
  // Escape special regex characters in the input
  const escapedFilter = filter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Convert the string into a regex pattern that allows other characters in between
  const regexPattern = escapedFilter.split("").join(".*");

  // Create a case-insensitive regex using the pattern
  return new RegExp(regexPattern, "i");
}

export function fuzzyMatch(filterString: string, text: string) {
  const regex = createFuzzyRegex(filterString);
  return regex.test(text);
}

export function getApiErrorMessage(
  e: AxiosError<Error>,
  defaultMessage: string
) {
  const errorMessage = e.response?.data.message || defaultMessage;
  const descriptions = Array.isArray(errorMessage)
    ? errorMessage
    : [errorMessage];

  return descriptions;
}

export function getPDTDate(startDate: Date, endDate: Date) {
  return `${dateFns.format(startDate, "EEEE, MMMM d · haaa")} - ${dateFns.format(endDate, "haaa 'PDT'")}`;
}

export function getLowestTicket(ticketTypes: TicketType[]) {
  return ticketTypes.length > 0
    ? ticketTypes.reduce((minTicket, currTicket) => {
        return minTicket.price > currTicket.price ? currTicket : minTicket;
      })
    : null;
}

// Utility function to convert Date object into the required format
const formatDateForCalendar = (date: Date) => {
  const pad = (num: number) => (num < 10 ? "0" + num : num);

  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1); // Months are zero-based, so add 1
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
};

export const createICSFile = (event: CalendarEvent) => {
  const { title, startDate, endDate, details, location } = event;
  console.log(
    "start date - ",
    startDate.toLocaleTimeString(),
    "end date -",
    endDate.toLocaleTimeString()
  );
  const formattedStartDate = formatDateForCalendar(startDate);
  const formattedEndDate = formatDateForCalendar(endDate);

  // Create the ICS file content
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:BlackDiamond Event - ${title}
DTSTART:${formattedStartDate}
DTEND:${formattedEndDate}
DESCRIPTION:${details}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

  // Create a Blob from the ICS content
  const blob = new Blob([icsContent], { type: "text/calendar" });

  // Create a download link for the ICS file
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${title}-calendar.ics`;
  link.click();
};

export const createGoogleCalendarLink = (event: CalendarEvent) => {
  const { title, startDate, endDate, details, location } = event;
  console.log(
    "start date - ",
    startDate.toLocaleTimeString(),
    "end date -",
    endDate.toLocaleTimeString()
  );
  const formattedStartDate = formatDateForCalendar(startDate);
  const formattedEndDate = formatDateForCalendar(endDate);

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`BlackDiamond Event - ${title}`)}&dates=${formattedStartDate}/${formattedEndDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

  return googleCalendarUrl;
};

export function formatPurchaseDate(date: Date) {
  const timeFormat = "h:mma"; // '5:45pm' format
  const formattedTime = dateFns.format(date, timeFormat);

  if (dateFns.isToday(date)) {
    return `Today at ${formattedTime}`;
  } else {
    // Use a more general date format if it's not today
    const dateFormat = "MMMM d, yyyy"; // e.g., 'October 12, 2024'
    return `${dateFns.format(date, dateFormat)} at ${formattedTime}`;
  }
}
