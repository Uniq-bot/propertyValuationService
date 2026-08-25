const express = require("express");

const valuationRouter = require("./routes/valuation");

const app = express();

app.use(express.json());

app.use(
  "/api",
  valuationRouter
);

app.listen(3000, () => {
  console.log(
    "Server running at http://localhost:3000"
  );
});