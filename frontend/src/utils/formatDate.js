import dayjs from "dayjs";

export const formatTimestamp = (timestamp) => {
  const date = dayjs(timestamp);
  const now = dayjs();

  if (date.isSame(now, "day")) {
    // Today just show time only
    return date.format("hh:mm A");
  } else if (date.isSame(now.subtract(1, "day"), "day")) {
    // Yesterday"
    return `Yesterday ${date.format("hh:mm A")}`;
  } else {
    //show full date and time
    return date.format("MMM D, YYYY hh:mm A");
  }
};
