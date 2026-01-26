const axios = require("axios");

class ExchangeRateService {
  constructor() {
    this.rates = null;
    this.apiKey = process.env.EXCHANGE_RATE_API_KEY;
    this.baseURL = "https://v6.exchangerate-api.com/v6/";
  }

  async getRates() {
    try {
      if (!this.apiKey) {
        throw new Error("Missing EXCHANGE_RATE_API_KEY");
      }

      const url = `${this.baseURL}${this.apiKey}/latest/INR`;
      const response = await axios.get(url);

      if (response.status === 200 && response.data.result === "success") {
        this.rates = response.data.conversion_rates;
        console.log("Exchange rates loaded");
      } else {
        throw new Error("Failed to fetch exchange rates");
      }
    } catch (err) {
      console.error("Error fetching exchange rates:", err.message);
      throw err;
    }
  }

  convert(amount, sourceCurrency, targetCurrency) {
    if (!this.rates) {
      throw new Error("Rates not loaded");
    }

    const sourceRate = this.rates[sourceCurrency];
    const targetRate = this.rates[targetCurrency];

    if (!sourceRate || !targetRate) {
      throw new Error("Invalid currency code");
    }

    return amount * (targetRate / sourceRate);
  }
}

module.exports = new ExchangeRateService();
