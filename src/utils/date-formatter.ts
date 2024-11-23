import * as dateFnsTz from "date-fns-tz";

// TODO: Change this to date-fns
// export const formatEventDate = (startDate: Date, endDate: Date): string => {
//   const optionsDate = {
//     weekday: "long",
//     month: "long",
//     day: "numeric",
//   } as const;
//   const optionsTime = { hour: "numeric", hour12: true } as const;

//   const formattedDate =
//     startDate.toLocaleDateString("en-US", optionsDate) +
//     " · " +
//     startDate.toLocaleTimeString("en-US", optionsTime).toLowerCase() +
//     " - " +
//     endDate.toLocaleTimeString("en-US", optionsTime).toLowerCase() +
//     " PDT";

//   return formattedDate;
// };

export const newYorkTimeZone = "America/New_York";

// TODO: Change this to date-fns
// export function getEventDateAndTime(date: Date) {
//   const dayOfWeek = new Intl.DateTimeFormat("en-US", {
//     weekday: "short",
//     timeZone: newYorkTimeZone,
//   }).format(date);
//   const day = date.getDate();
//   const month = new Intl.DateTimeFormat("en-US", {
//     month: "short",
//     timeZone: newYorkTimeZone,
//   }).format(date);
//   const year = new Intl.DateTimeFormat("en-US", {
//     year: "numeric",
//     timeZone: newYorkTimeZone,
//   }).format(date);

//   const suffix = getDaySuffix(day);

//   const time = new Intl.DateTimeFormat("en-US", {
//     hour: "numeric",
//     minute: "numeric",
//     hour12: true,
//     timeZone: newYorkTimeZone,
//   }).format(date);

//   return {
//     date: `${dayOfWeek}, ${day}${suffix} ${month} ${year}`,
//     time: time,
//   };
// }

function getOrdinalSuffix(day: number) {
  if (day % 10 === 1 && day % 100 !== 11) return "ST";
  if (day % 10 === 2 && day % 100 !== 12) return "ND";
  if (day % 10 === 3 && day % 100 !== 13) return "RD";
  return "TH";
}
export function getEventDateAndTime(date: Date) {
  const day = dateFnsTz.format(date, "d", {
    timeZone: newYorkTimeZone,
  });
  const ordinalSuffix = getOrdinalSuffix(parseInt(day));
  const dateString = dateFnsTz
    .format(date, `EEE, d'${ordinalSuffix}' MMM yyyy`)
    .toUpperCase();

  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: newYorkTimeZone,
  }).format(date);

  return {
    date: dateString,
    time: time,
  };
}

function getDaySuffix(day: number) {
  if (day > 3 && day < 21) return "th"; // covers 11th to 19th
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
