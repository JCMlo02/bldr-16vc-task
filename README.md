# BLDR 16VC Task

## Overview

This application is a rental management system that allows users to create, search, rent, and return rental items. It is built using Node.js and Express, with an in-memory database for storing rental items.

## Features

- **Create Item**: Add new rental items to the inventory.
- **Search Items**: Search for available rental items by name and/or price range.
- **Rent Item**: Rent or schedule a rental for an item.
- **Return Item**: Return a rented item.

## Thought Process on Developing the API

### 1. Define the Requirements

The first step was to understand the requirements of the rental management system. The key functionalities needed were:

- Creating rental items
- Searching for available items
- Renting items
- Returning rented items

### 2. Design the Data Model

Next, I designed the data model to represent rental items. Each item needed properties such as:

- `id`: A unique identifier for the item.
- `itemName`: The name of the rental item.
- `description`: A description of the item.
- `pricePerDay`: The rental price per day.
- `isRented`: A boolean indicating if the item is currently rented.
- `isReturned`: A boolean indicating if the item has been returned.
- `rentalStart`: The start date of the current rental.
- `rentalEnd`: The end date of the current rental.
- `rentalSchedule`: An array of scheduled rentals with `rentalId`, `rentalStart`, and `rentalEnd`.

I chose these properties to ensure that each item could be uniquely identified and its rental status could be tracked accurately. The `rentalSchedule` array allows for future rentals to be scheduled without affecting the current rental status.

### 3. Set Up the Project

I initialized a new Node.js project and installed the necessary dependencies:

- `express` for building the web server.
- `dayjs` for date manipulation.
- `uuid` for generating unique IDs.
- `nodemon` for automatically restarting the server during development.

I chose these dependencies because they are well-supported and widely used in the Node.js ecosystem. `express` provides a robust framework for building APIs, `dayjs` simplifies date manipulation, and `uuid` ensures unique identifiers for rental items.

### 4. Implement the Handlers

I created handler functions for each of the main functionalities:

#### Create Item

- **Function**: `createItem`
- **Description**: Validates the input data and adds a new item to the database.
- **Steps**:
  1. Validate the input data using `validateItem`.
  2. Create a new item object with default rental status.
  3. Add the new item to the database.
  4. Return a success response with the created item.

I wanted to ensure that item creation was straightforward and that all necessary validations were in place to prevent invalid data from being added to the database.

#### Search Items

- **Function**: `searchItems`
- **Description**: Filters items based on search criteria such as name and price range.
- **Steps**:
  1. Validate the search criteria using `validateSearchCriteria`.
  2. Filter the items in the database based on the criteria.
  3. Return the matching items or a not found response if no items match.

The search functionality needed to be flexible enough to handle partial matches and price ranges. I also wanted to ensure that the search was efficient and returned correct results.

#### Rent Item

- **Function**: `rentItem`
- **Description**: Validates rental dates, checks availability, and updates the item's rental status.
- **Steps**:
  1. Validate the rental information using `validateRentalInfo`.
  2. Find the item in the database by ID.
  3. Check rental availability using `checkRentalAvailability`.
  4. Update the item's rental status and schedule based on the rental dates.
  5. Return a success response with the rental details.

Renting an item involves multiple checks to ensure that the rental dates are valid and that the item is available. I wanted to handle both immediate and future rentals seamlessly, so I implemented the functions `validateRentalInfo` & `checkRentalAvailability`.

#### Return Item

- **Function**: `returnItem`
- **Description**: Validates the return request and updates the item's rental status.
- **Steps**:
  1. Validate the return information using `validateReturnInfo`.
  2. Find the item in the database by ID.
  3. Check if the item is currently rented and not already returned.
  4. Update the item's rental status to returned.
  5. Return a success response with the return details.

Returning an item is straightforward, with checks to ensure that the item was indeed rented and not already returned. This helps maintain the integrity of the rental status.

### 5. Set Up Routes

I set up Express routes to handle API requests:

- `POST /items` for creating items.
- `GET /items` for searching items.
- `PUT /items/:id/rent` for renting items.
- `PUT /items/:id/return` for returning items.

I chose these routes to keep the API endpoints intuitive and RESTful. Each route corresponds to a specific action, making it easy to understand and use.

### 6. Error Handling

I added error handling middleware to catch and respond to errors consistently. This ensures that the API provides meaningful error messages to the client.

Consistent error handling is crucial for debugging and providing a good user experience. I wanted to ensure that any errors were logged and that the client received clear error messages.

### 7. Testing

I tested the API using Postman and cURL to ensure that all endpoints worked as expected. This included testing edge cases such as invalid input data and rental conflicts.

Thorough testing helps identify and fix issues early. I wanted to ensure that the API was robust and could handle various scenarios without breaking.

### 8. Documentation
Finally, I documented the API endpoints, setup instructions, and testing procedures in the README file to make it easy for others to understand and use the API.

## Setup

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd bldr-16vc-task
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the server:

   ```sh
   npm start
   ```

4. The server will be running on `http://localhost:3000`.

## Testing the API

You can test the API using tools like [Postman](https://www.postman.com/) or [cURL](https://curl.se/).

### Using Postman

1. Open Postman and create a new request.
2. Set the request method and URL according to the endpoint you want to test.
3. Add the request body in JSON format if required.
4. Send the request and check the response.

### Create Item

- **URL**: `/items`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "itemName": "string",
    "description": "string",
    "pricePerDay": "number"
  }
  ```
- **Response**:
  - `201 Created`: Item created successfully.
  - `400 Bad Request`: Invalid input data.

### Search Items

- **URL**: `/items`
- **Method**: `GET`
- **Query Parameters**:
  - `itemName`: string (optional)
  - `minPrice`: number (optional)
  - `maxPrice`: number (optional)
- **Response**:
  - `200 OK`: Items found matching criteria.
  - `404 Not Found`: No items found matching criteria.
  - `500 Internal Server Error`: Error searching items.

### Rent Item

- **URL**: `/items/rent`
- **Method**: `PUT`
- **Body**:
  ```json
  { 
    "id": "string",
    "rentalStart": "string (optional)",
    "rentalEnd": "string"
  }
  ```
- **Response**:
  - `200 OK`: Item rented or rental scheduled successfully.
  - `400 Bad Request`: Invalid input data or rental conflict.
  - `404 Not Found`: Item not found.

### Return Item

- **URL**: `/items/return`
- **Method**: `PUT`
- **Body**:
  ```json
  {
    "id": "string"
  }
  ```
- **Response**:
  - `200 OK`: Item returned successfully.
  - `400 Bad Request`: Item is not currently rented or has already been returned.
  - `404 Not Found`: Item not found.
  - `500 Internal Server Error`: Error returning item.

### Using cURL

You can use the following cURL commands to test the API endpoints:

#### Create Item

```sh
curl -X POST http://localhost:3000/items -H "Content-Type: application/json" -d '{
  "itemName": "Sample Item",
  "description": "Sample description",
  "pricePerDay": 15
}'
```

#### Search Items

```sh
curl -X GET "http://localhost:3000/items?itemName=Sample&minPrice=10&maxPrice=20" -H "Content-Type: application/json"
```

#### Rent Item

```sh
curl -X PUT http://localhost:3000/items/example-id/rent -H "Content-Type: application/json" -d '{
  "rentalStart": "2024-02-01",
  "rentalEnd": "2024-02-05"
}'
```

#### Return Item

```sh
curl -X PUT http://localhost:3000/items/example-id/return -H "Content-Type: application/json" -d '{
  "id": "example-id"
}'
```

## Dependencies

- **express**: Web framework for Node.js.
- **dayjs**: Date manipulation library.
- **uuid**: Library for generating unique IDs.
- **nodemon**: Tool for automatically restarting the server during development.
