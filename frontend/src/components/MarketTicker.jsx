// Simulated market ticker ribbon (no external API — safe for GitHub Pages).
const SEEDS = [
  { s: "NIFTY", p: "22,455.30", c: "+0.78%" },
  { s: "SENSEX", p: "73,892.10", c: "+0.62%" },
  { s: "BANKNIFTY", p: "48,120.55", c: "-0.14%" },
  { s: "S&P 500", p: "5,432.90", c: "+0.31%" },
  { s: "NASDAQ", p: "17,890.44", c: "+0.55%" },
  { s: "DOW", p: "39,220.11", c: "-0.09%" },
  { s: "BTC", p: "68,220.00", c: "+2.14%" },
  { s: "ETH", p: "3,540.20", c: "+1.05%" },
  { s: "GOLD", p: "2,344.55", c: "+0.22%" },
  { s: "CRUDE", p: "78.20", c: "-0.44%" },
];

const Item = ({ s, p, c }) => {
  const up = c.startsWith("+");
  return (
    <div className="flex items-center gap-2 px-4 border-r border-[#232D42]">
      <span className="font-mono-t text-[11px] tracking-widest text-gray-400">{s}</span>
      <span className="font-mono-t text-[12px] text-gray-100">{p}</span>
      <span className={`font-mono-t text-[11px] ${up ? "text-emerald-400" : "text-red-400"}`}>{c}</span>
    </div>
  );
};

export const MarketTicker = () => {
  const doubled = [...SEEDS, ...SEEDS];
  return (
    <div
      data-testid="market-ticker"
      className="w-full overflow-hidden border-y border-[#232D42] bg-[#0A0D14]/80 backdrop-blur-sm"
    >
      <div className="ticker-track flex whitespace-nowrap py-2 w-max">
        {doubled.map((d, i) => (
          <Item key={i} {...d} />
        ))}
      </div>
    </div>
  );
};

export default MarketTicker;
