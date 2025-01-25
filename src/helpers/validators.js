import { getCurrentDate, formatDate } from "./helpers";
export const validateItem = (item) => {
  // checks if item has required props and correct type
  if (!item.itemName || typeof item.itemName !== "string") {
    throw new Error("Invalid itemName");
  }
  if (!item.description || typeof item.description !== "string") {
    throw new Error("Invalid description");
  }
  if (
    !item.pricePerDay ||
    typeof parseFloat(item.pricePerDay) !== "number" ||
    parseFloat(item.pricePerDay) <= 0
  ) {
    throw new Error("Invalid pricePerDay");
  }
  return true;
};

export const validateSearchCriteria = (criteria) => {
  // checks search criteria for price range and item name
  if (criteria.minPrice && isNaN(parseFloat(criteria.minPrice))) {
    throw new Error("Invalid minPrice - must be a number");
  }
  if (criteria.maxPrice && isNaN(parseFloat(criteria.maxPrice))) {
    throw new Error("Invalid maxPrice - must be a number");
  }
  if (
    criteria.minPrice &&
    criteria.maxPrice &&
    parseFloat(criteria.minPrice) > parseFloat(criteria.maxPrice)
  ) {
    throw new Error("minPrice cannot be greater than maxPrice");
  }
  if (criteria.itemName && typeof criteria.itemName !== "string") {
    throw new Error("Invalid itemName - must be a string");
  }
  return true;
};

export const validateRentalInfo = (rentInfo) => {
  // validation of rental request:
  // - checks if id exists and is a string
  // - adds default start date (today if not provided)
  // - validates end date is provided and after start date
  // - prevents past date rentals
  console.log(rentInfo);
  if (!rentInfo.id || typeof rentInfo.id !== "string") {
    throw new Error("Invalid id - must provide a valid item id");
  }

  const requestedStart = formatDate(rentInfo.rentalStart) || getCurrentDate();
  const requestedEnd = formatDate(rentInfo.rentalEnd);

  if (!requestedEnd) {
    throw new Error("Must provide rental end date");
  }

  if (requestedStart < getCurrentDate()) {
    throw new Error("Rental start date cannot be in the past");
  }

  if (requestedEnd <= requestedStart) {
    throw new Error("Rental end date must be after start date");
  }

  return {
    formattedDates: {
      rentalStart: requestedStart,
      rentalEnd: requestedEnd,
    },
  };
};

export const validateReturnInfo = (returnInfo) => {
  // validates return request has valid item ID
  if (!returnInfo.id || typeof returnInfo.id !== "string") {
    throw new Error("Invalid id - must provide a valid item id");
  }
  return true;
};
