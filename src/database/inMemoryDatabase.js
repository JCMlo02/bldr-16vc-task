export const database = {
  items: [
    {
      id: "example-id",
      itemName: "Example Item",
      description: "Example description",
      pricePerDay: 10,
      isRented: false,
      isReturned: true,
      rentalStart: null,
      rentalEnd: null,
      rentalSchedule: [
        {
          rentalId: "schedule-id",
          rentalStart: "2024-02-01",
          rentalEnd: "2024-02-05",
        },
      ],
    },
  ],
};
