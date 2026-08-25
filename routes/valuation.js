import express from "express";
import valuateProperty from "../valuationEngine.js";


const router = express.Router();

router.post("/", (req, res) => {

  try {

    const property = req.body;

    if (!property.landAreaAana) {
      return res.status(400).json({
        error: "landAreaAana is required"
      });
    }

    if (
      property.governmentRate == null ||
      property.marketRate == null ||
      property.distressedRate == null
    ) {
      return res.status(400).json({
        error:
          "governmentRate, marketRate and distressedRate are required"
      });
    }

    const result =
      valuateProperty(property);

    res.json(result);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Valuation failed",
      message: error.message
    });
  }
});

export default router;