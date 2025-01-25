import { v4 as uuidv4 } from "uuid";
import { checkRentalAvailability, getCurrentDate } from "../helpers/helpers.js";
import { database } from "../database/inMemoryDatabase.js";
import {
  validateItem,
  validateSearchCriteria,
  validateRentalInfo,
  validateReturnInfo,
} from "../helpers/validators.js";

export const handlers = {
  async createItem(data) {
    // creates a new rental item with default rental status
    try {
      validateItem(data);
      const newItem = {
        id: uuidv4(),
        itemName: data.itemName,
        description: data.description,
        pricePerDay: parseFloat(data.pricePerDay),
        isRented: false,
        isReturned: true,
        rentalStart: null,
        rentalEnd: null,
        rentalSchedule: [],
      };
      database.items.push(newItem);
      return {
        statusCode: 201,
        body: JSON.stringify({
          data: newItem,
          message: "Item created successfully",
        }),
      };
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          data: null,
          message: error.message,
        }),
      };
    }
  },

  async searchItems(searchCriteria) {
    // searches items by name and/or price range
    // returns 404 if no items match criteria
    try {
      validateSearchCriteria(searchCriteria);
      const searchedItems = database.items.filter((item) => {
        let nameMatch = true;
        let priceMatch = true;
        let minPrice = parseFloat(searchCriteria.minPrice);
        let maxPrice = parseFloat(searchCriteria.maxPrice);
        if (searchCriteria.itemName) {
          nameMatch = item.itemName
            .toLowerCase()
            .includes(searchCriteria.itemName.toLowerCase());
        }

        if (minPrice && maxPrice) {
          priceMatch =
            item.pricePerDay >= minPrice && item.pricePerDay <= maxPrice;
        } else if (minPrice && !maxPrice) {
          priceMatch = item.pricePerDay >= minPrice;
        } else if (maxPrice && !minPrice) {
          priceMatch = item.pricePerDay <= maxPrice;
        }

        return nameMatch && priceMatch;
      });

      return {
        statusCode: searchedItems.length ? 200 : 404,
        body: JSON.stringify({
          data: searchedItems ? searchedItems : [],
          message: searchedItems.length
            ? "Items found"
            : "No items found matching criteria",
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          data: null,
          message: `Error searching items: ${error.message}`,
        }),
      };
    }
  },

  async rentItem(rentInfo) {
    // rent items:
    // 1. validate rental dates
    // 2. check rental availability
    // 3. update rental status
    try {
      // validate and format rental dates
      const rentalDates = validateRentalInfo(rentInfo).formattedDates;
      console.log(rentalDates);
      const itemIndex = database.items.findIndex(
        (item) => item.id === rentInfo.id
      );

      if (itemIndex === -1) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            data: null,
            message: "Item not found",
          }),
        };
      }

      const item = database.items[itemIndex];
      // checks if rental request is available by comparing to rental schedule and current rental status
      checkRentalAvailability(
        item,
        rentalDates.rentalStart,
        rentalDates.rentalEnd
      );

      const currentDate = getCurrentDate();

      // handle immediate vs future rentals
      if (rentalDates.rentalStart === currentDate) {
        // for same-day rentals:
        // 1. check if this matches a scheduled rental
        // 2. remove scheduled rental if found
        // 3. mark item as currently rented
        if (item.rentalSchedule) {
          item.rentalSchedule = item.rentalSchedule.filter(
            (rental) =>
              !(
                rental.rentalStart === rentalDates.rentalStart &&
                rental.rentalEnd === rentalDates.rentalEnd
              )
          );
        }

        database.items[itemIndex] = {
          ...item,
          isRented: true,
          isReturned: false,
          rentalStart: rentalDates.rentalStart,
          rentalEnd: rentalDates.rentalEnd,
        };
      } else {
        // for future rentals:
        // add to rental schedule without changing current rental status
        if (!item.rentalSchedule) item.rentalSchedule = [];
        item.rentalSchedule.push({
          rentalId: uuidv4(),
          rentalStart: rentalDates.rentalStart,
          rentalEnd: rentalDates.rentalEnd,
        });
        database.items[itemIndex] = item;
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          data: {
            rentalDetails: {
              itemId: rentInfo.id,
              itemName: item.itemName,
              rentalStart: rentalDates.rentalStart,
              rentalEnd: rentalDates.rentalEnd,
            },
          },
          message:
            rentalDates.rentalStart === currentDate
              ? "Item rented successfully"
              : "Item rental scheduled successfully",
        }),
      };
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          data: null,
          message: error.message,
        }),
      };
    }
  },

  async returnItem(returnInfo) {
    // item return:
    // 1. validate item is currently rented
    // 2. update rental status
    try {
      validateReturnInfo(returnInfo);
      const itemIndex = database.items.findIndex(
        (item) => item.id === returnInfo.id
      );

      if (itemIndex === -1) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            data: null,
            message: "Item not found",
          }),
        };
      }

      const item = database.items[itemIndex];

      if (!item.isRented) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            data: null,
            message: "Item is not currently rented",
          }),
        };
      }

      if (item.isReturned) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            data: null,
            message: "Item has already been returned",
          }),
        };
      }

      const currentDate = getCurrentDate();
      // resets rental information
      database.items[itemIndex] = {
        ...item,
        isRented: false,
        isReturned: true,
        rentalStart: null,
        rentalEnd: null,
      };

      return {
        statusCode: 200,
        body: JSON.stringify({
          data: {
            returnDetails: {
              itemId: returnInfo.id,
              itemName: item.itemName,
              returnDate: currentDate,
            },
          },
          message: "Item returned successfully",
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          data: null,
          message: `Error returning item: ${error.message}`,
        }),
      };
    }
  },
};
