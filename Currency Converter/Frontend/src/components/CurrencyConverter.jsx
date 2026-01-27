import { useRef, useState } from "react";
import CurrencySelector from "./CurrencySelector";

const CurrencyConverter = () => {
  const amountInput = useRef();
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const convertHandler = () => {
    setLoading(true);
    setError("");
    setConvertedAmount("");
    fetch("http://localhost:3001/api/convert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountInput.current.value,
        sourceCurrency: fromCurrency,
        targetCurrency: toCurrency,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setConvertedAmount(data.targetAmount);
        } else {
          setError(data.message || "Conversion failed");
        }
      })
      .catch(() => setError("Request failed"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 bg-white rounded-lg shadow overflow-hidden">
      <h1 className="text-2xl font-bold mb-6 text-center">Currency Converter</h1>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="amount-input">
            Amount
          </label>
          <input
            id="amount-input"
            type="number"
            min="0"
            ref={amountInput}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter amount here..."
          />
        </div>
        {/* Setting min-w-0 to flex children and wrapper to avoid overflow */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <CurrencySelector
              name="from-currency"
              id="from-currency"
              label="From"
              value={fromCurrency}
              onChange={e => setFromCurrency(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-0">
            <CurrencySelector
              name="to-currency"
              id="to-currency"
              label="To"
              value={toCurrency}
              onChange={e => setToCurrency(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={convertHandler}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mt-2"
          disabled={loading}
        >
          {loading ? "Converting..." : "Convert"}
        </button>
        {error && (
          <div className="text-red-600 text-center font-medium mt-2">{error}</div>
        )}
        {convertedAmount !== "" && (
          <div className="text-3xl font-bold text-center mt-4">
            {convertedAmount}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
