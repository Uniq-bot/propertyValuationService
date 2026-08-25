import express from "express";

const router = express.Router();

router.post("/:number", (req, res) => {
  const { currentAmount } = req.body;

  const currentYear = new Date().getFullYear();
  const maxYear = currentYear + 10;

  const number = Number(req.params.number);
  const inflationRate = number / 100;

  let amount = Number(currentAmount);

  const results = [];

  for (let year = currentYear; year <= maxYear; year++) {
    results.push({
      year,
      amount: Math.round(amount),
    });

    amount = amount * (1 + inflationRate);
  }

  res.json({
    currentAmount,
    inflationRate: number,
    years: results,
  });
});

export default router;