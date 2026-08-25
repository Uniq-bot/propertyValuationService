import express from "express";
import cors from "cors";
import valuationRouter from "./routes/valuation.js";
import inflationRouter from "./routes/inflation.js";
const app = express();
app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
  res.json({
    message: "Nepal Property Valuation API",
    version: "1.0.0"
  });
});

app.use("/api/valuation", valuationRouter);

app.use("/api/inflation", inflationRouter );

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Valuation server running on http://localhost:${PORT}`);
});