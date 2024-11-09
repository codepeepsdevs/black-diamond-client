import { CalendarEvent, TicketType } from "@/constants/types";
import { AxiosError } from "axios";
import * as dateFns from "date-fns";
import * as dateFnsTz from "date-fns-tz";
import { newYorkTimeZone } from "./date-formatter";

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

export function getTimeZoneDateRange(startDate: Date, endDate: Date) {
  const timeZoneAbbr = new Date(startDate || endDate || Date.now())
    .toLocaleTimeString("en-US", {
      timeZoneName: "short",
      timeZone: newYorkTimeZone,
    })
    .split(" ")[2];

  const startDateNY = dateFnsTz.toZonedTime(startDate, newYorkTimeZone);
  const endDateNY = dateFnsTz.toZonedTime(endDate, newYorkTimeZone);

  return `${dateFns.format(startDateNY, "EEEE, MMMM d · haaa")} - ${dateFnsTz.format(endDateNY, `h:mmaaa '${timeZoneAbbr}'`)}`;
}

// export function getUTCDateTimeThroughPlain(date: Date, time: string){
//     // Convert to a format that Date() can parse
//     const newYorkDateString = `${dateFns.format(date, "yyyy-MM-dd")}T${time}`;

//     const newYorkDate = dateFns.parse(
//       newYorkDateString,
//       "yyyy-MM-dd'T'HH:mm",
//       new Date()
//     );
//     // Convert the date from New York time to UTC
//     const newYorkUtcDate = fromZonedTime(newYorkDate, newYorkTimeZone);

//     // Format the UTC date to ISO string
//     const formattedUTCDate = newYorkUtcDate.toISOString();
// }

// export function getZonedDateAndTimeInput(date: Date) {
//   // Convert the UTC date to New York time
//   const newYorkDate = dateFnsTz.toZonedTime(date, newYorkTimeZone);

//   // Format the date and time separately for each input
//   const formattedDate = dateFns.format(newYorkDate, "yyyy-MM-dd"); // Format for date input
//   const formattedTime = dateFns.format(newYorkDate, "HH:mm"); // Format for time input

//   return { formattedDate, formattedTime };
// }

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
