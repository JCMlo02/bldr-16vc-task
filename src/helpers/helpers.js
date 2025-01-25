import dayjs from "dayjs";

// date funcs to ensure consistent date formatting
export const getCurrentDate = () => dayjs().format("YYYY-MM-DD");
export const formatDate = (date) => dayjs(date).format("YYYY-MM-DD");

export const isDateRangeOverlapping = (start1, end1, start2, end2) => {
  // checks if two rental periods overlap
  // returns true if there is any overlap, allowing same-day transitions
  return start1 < end2 && start2 < end1;
};

export const checkRentalAvailability = (item, startDate, endDate) => {
  const currentDate = getCurrentDate();

  // Special handling for rentals starting today
  if (startDate === currentDate && !item.isReturned) {
    throw new Error("Item is currently rented and not available");
  }

  // Check future rental schedules
  if (item.rentalSchedule && item.rentalSchedule.length > 0) {
    // checks if rental request is on the schedule
    const matchingSchedule = item.rentalSchedule.find(
      (rental) =>
        rental.rentalStart === startDate && rental.rentalEnd === endDate
    );

    // if rental was scheduled and starts today, allow it to rent
    if (matchingSchedule && startDate === currentDate) {
      return true;
    }

    // checks for any conflicting rentals in the schedule
    const hasConflict = item.rentalSchedule.some((rental) =>
      isDateRangeOverlapping(
        rental.rentalStart,
        rental.rentalEnd,
        startDate,
        endDate
      )
    );

    if (hasConflict) {
      throw new Error(
        "Item is already scheduled for rental during this period"
      );
    }
  }
  return true;
};
