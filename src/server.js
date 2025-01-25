import express from "express";
import apiRoutes from "./routes/api.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/", apiRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
