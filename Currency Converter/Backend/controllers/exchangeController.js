const ExchangeRateService = require("../service/exchangeRateService");

exports.convertCurrency = (req, res) => {
  try {
    const { amount, sourceCurrency, targetCurrency } = req.body;

    if (!amount || !sourceCurrency || !targetCurrency) {
      return res.status(400).json({
        status: "error",
        message: "Required fields are missing"
      });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      return res.status(400).json({
        status: "error",
        message: "Amount must be a number"
      });
    }

    const targetAmount = ExchangeRateService.convert(
      numericAmount,
      sourceCurrency,
      targetCurrency
    );

    res.json({
      status: "success",
      targetAmount
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};
