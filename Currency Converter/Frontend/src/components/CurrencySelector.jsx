import Currencies from "../util/currencies";

const CurrencySelector = ({ label, value, onChange, name = "currency-selector", id = "currency-selector" }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label htmlFor={id} style={{ fontWeight: "bold", marginBottom: "0.2rem" }}>
                {label}
            </label>
            <select
                name={name}
                id={id}
                value={value}
                onChange={onChange}
                style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid #bbb",
                    fontSize: "1rem",
                    background: "#fafbfc",
                    cursor: "pointer"
                }}
            >
                {Object.keys(Currencies).map((currency) => (
                    <option key={currency} value={currency}>
                        {Currencies[currency].flag} {currency} – {Currencies[currency].name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CurrencySelector;