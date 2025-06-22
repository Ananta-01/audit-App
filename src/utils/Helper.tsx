export default function formatTimestamp(timestamp: string): string {
  // Clean Unicode narrow spaces
  const clean = timestamp.replace(/\u202F|\u00A0/g, ' ');

  // Use regex to split the string reliably
  const [datePart, timePartRaw] = clean.split(', ');
  if (!datePart || !timePartRaw) return 'Invalid Date';

  const [month, day, year] = datePart.split('/');
  const [timePart, meridian] = timePartRaw.split(' '); // e.g., "2:57:48" and "PM"

  const [hoursStr, minutesStr] = timePart.split(':');

  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (meridian === 'PM' && hours < 12) hours += 12;
  if (meridian === 'AM' && hours === 12) hours = 0;

  const date = new Date(Number(year), Number(month) - 1, Number(day), hours, minutes);

  if (isNaN(date.getTime())) return 'Invalid Date';

  // Format output
  const finalHours = date.getHours() % 12 || 12;
  const finalMinutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  const monthName = date.toLocaleString('default', { month: 'long' });

  return `${date.getDate()} ${monthName} ${date.getFullYear()} - ${finalHours}:${finalMinutes} ${ampm}`;
}
