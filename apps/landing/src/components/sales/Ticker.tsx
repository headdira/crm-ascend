type TickerProps = {
  text?: string;
  bgColor?: string;
  textColor?: string;
};

export default function Ticker({
  text = "ASCEND CLUB",
  bgColor = "bg-primary",
  textColor = "text-black",
}: TickerProps) {
  const items = Array.from({ length: 10 }, () => text);

  return (
    <div className={`${bgColor} py-3 overflow-hidden w-full`} aria-hidden>
      <div className="ticker-marquee flex w-max">
        {[0, 1].map((dup) => (
          <div key={dup} className="ticker-marquee-group flex shrink-0 items-center gap-8 pr-8">
            {items.map((item, i) => (
              <span
                key={`${dup}-${i}`}
                className={`${textColor} font-inter font-black text-sm tracking-[0.2em] uppercase shrink-0`}
              >
                ◆ {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
