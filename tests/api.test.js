import request from "supertest";
import app from "../src/server.js";

describe("API Tests", () => {
  let itemId;

  it("should create a new item", async () => {
    const response = await request(app).post("/items").send({
      itemName: "Test Item",
      description: "Test Description",
      pricePerDay: 20,
    });
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("id");
    itemId = response.body.data.id;
  });

  it("should search for items", async () => {
    const response = await request(app)
      .get("/items")
      .query({ itemName: "Test" });
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it("should rent an item", async () => {
    const response = await request(app).put("/items/rent").send({
      id: itemId,
      rentalStart: Date.now(),
      rentalEnd: "02-30-2025",
    });
    expect(response.status).toBe(200);
    expect(response.body.data.rentalDetails).toHaveProperty("itemId", itemId);
  });

  it("should return an item", async () => {
    const response = await request(app)
      .put("/items/return")
      .send({ id: itemId });
    console.log(response);
    expect(response.status).toBe(200);
    expect(response.body.data.returnDetails).toHaveProperty("itemId", itemId);
  });
  it("should schedule a rental for an item", async () => {
    const response = await request(app).put("/items/rent").send({
      id: itemId,
      rentalStart: "03-01-2025",
      rentalEnd: "03-15-2025",
    });
    expect(response.status).toBe(200);
    expect(response.body.data.rentalDetails).toHaveProperty("itemId", itemId);
  });
  it("should not let you schedule due to overlap", async () => {
    const response = await request(app).put("/items/rent").send({
      id: itemId,
      rentalStart: "03-04-2025",
      rentalEnd: "03-14-2025",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Item is already scheduled for rental during this period"
    );
  });
});
