export function convertMinutesToHoursAndMinutesHelper(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const hourString = hours > 0 ? `${hours} hr${hours > 1 ? "s" : ""}` : "";
  const minuteString =
    remainingMinutes > 0
      ? `${remainingMinutes} mte${remainingMinutes > 1 ? "s" : ""}`
      : "";

  return `${hourString} ${minuteString}`.trim();
}

export function ucword(str: string) {
  str = str.toLowerCase().replace(/\b[a-z]/g, function (letter) {
    return letter.toUpperCase();
  });

  return str;
}
