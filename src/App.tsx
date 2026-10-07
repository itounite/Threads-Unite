import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Lock, Unlock, Eye, EyeOff, Search, BookOpen, Layers, User, Home as HomeIcon, Check, X, Bookmark, Mail, Copy, Send, Sun, Moon } from "lucide-react";
import { WhitepaperView } from "./components/WhitepaperView";
import { NordicBackground } from "./components/NordicBackground";
import { RealWorldApp } from "./realworld/RealWorldApp";

export function ThreadsLogo({ className = "w-8 h-8" }: { className?: string }) {
  // Generates 115 deterministic intersecting straight lines for a real hand-drawn scribble texture
  const lines = [];
  const cx = 50;
  const cy = 50;
  const radius = 38;
  const seed = 54321; // Different seed to get a nice distribution
  let currentSeed = seed;
  const random = () => {
    const x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 0; i < 115; i++) {
    const angle1 = random() * Math.PI * 2;
    // Angle2 should be roughly opposite to go through/near the center
    const angle2 = angle1 + Math.PI + (random() - 0.5) * (Math.PI * 0.9);
    
    // Uneven radiuses to give the scribble-spikes effect on the boundary
    const r1 = radius * (0.75 + random() * 0.3);
    const r2 = radius * (0.75 + random() * 0.3);

    const x1 = cx + Math.cos(angle1) * r1;
    const y1 = cy + Math.sin(angle1) * r1;
    const x2 = cx + Math.cos(angle2) * r2;
    const y2 = cy + Math.sin(angle2) * r2;

    const strokeWidth = 0.55 + random() * 1.5;
    const opacity = 0.55 + random() * 0.45;

    lines.push(
      <line
        key={i}
        x1={x1.toFixed(2)}
        y1={y1.toFixed(2)}
        x2={x2.toFixed(2)}
        y2={y2.toFixed(2)}
        stroke="currentColor"
        strokeWidth={strokeWidth.toFixed(2)}
        opacity={opacity.toFixed(2)}
        strokeLinecap="round"
      />
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        {lines}
      </g>
    </svg>
  );
}


// Types and Datasets for high-fidelity custom visual widgets
interface ChartDataPoint {
  year: number;
  serial: number;
  berkshire: number;
  benchmark: number; // S&P 500 or OMX Sweden
  msci: number;
}

const GLOBAL_DATA: ChartDataPoint[] = [
  { year: 2004, serial: 100, berkshire: 100, benchmark: 100, msci: 100 },
  { year: 2006, serial: 140, berkshire: 121, benchmark: 116, msci: 112 },
  { year: 2008, serial: 196, berkshire: 146, benchmark: 134, msci: 125 },
  { year: 2010, serial: 274, berkshire: 177, benchmark: 156, msci: 140 },
  { year: 2012, serial: 384, berkshire: 214, benchmark: 181, msci: 157 },
  { year: 2014, serial: 537, berkshire: 259, benchmark: 210, msci: 176 },
  { year: 2016, serial: 752, berkshire: 314, benchmark: 243, msci: 197 },
  { year: 2018, serial: 1053, berkshire: 380, benchmark: 282, msci: 221 },
  { year: 2020, serial: 1474, berkshire: 460, benchmark: 327, msci: 247 },
  { year: 2022, serial: 2063, berkshire: 556, benchmark: 379, msci: 277 },
  { year: 2023, serial: 2400, berkshire: 640, benchmark: 430, msci: 290 }
];

const NORDIC_DATA: ChartDataPoint[] = [
  { year: 2004, serial: 100, berkshire: 100, benchmark: 100, msci: 100 },
  { year: 2006, serial: 142, berkshire: 121, benchmark: 116, msci: 112 },
  { year: 2008, serial: 203, berkshire: 146, benchmark: 135, msci: 125 },
  { year: 2010, serial: 289, berkshire: 177, benchmark: 158, msci: 140 },
  { year: 2012, serial: 412, berkshire: 214, benchmark: 184, msci: 157 },
  { year: 2014, serial: 588, berkshire: 259, benchmark: 215, msci: 176 },
  { year: 2016, serial: 839, berkshire: 314, benchmark: 251, msci: 197 },
  { year: 2018, serial: 1198, berkshire: 380, benchmark: 293, msci: 221 },
  { year: 2020, serial: 1711, berkshire: 460, benchmark: 342, msci: 247 },
  { year: 2022, serial: 2443, berkshire: 556, benchmark: 399, msci: 277 },
  { year: 2023, serial: 3400, berkshire: 640, benchmark: 430, msci: 290 }
];

// Helper to compile SVG Arc Paths for the custom Donut slice
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  // If end angle minus start angle is ~360, adjust slightly so arc compiles correctly in SVG
  let diff = endAngle - startAngle;
  if (diff >= 360) {
    diff = 359.99;
  }
  const largeArcFlag = diff <= 180 ? "0" : "1";
  return [
    "M", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
};

// Custom interactive SVG line chart component
export function PerformanceLineChart({ type }: { type: "global" | "nordic" }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const data = type === "global" ? GLOBAL_DATA : NORDIC_DATA;
  const maxVal = type === "global" ? 2500 : 3500;
  
  const width = 500;
  const height = 280;
  const paddingX = 45;
  const paddingY = 35;
  
  const getX = (index: number) => {
    return paddingX + (index * (width - 2 * paddingX) / (data.length - 1));
  };
  
  const getY = (val: number) => {
    return height - paddingY - (val * (height - 2 * paddingY) / maxVal);
  };
  
  // Create lines from data coordinates
  const getLinePath = (key: keyof ChartDataPoint) => {
    return data.map((d, i) => {
      const x = getX(i);
      const y = getY(d[key] as number);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const ratio = (clientX - paddingX) / (width - 2 * paddingX);
    let idx = Math.round(ratio * (data.length - 1));
    idx = Math.max(0, Math.min(data.length - 1, idx));
    setHoveredIndex(idx);
  };

  // Grid guides to render beautifully
  const gridCount = 5;
  const gridLines = Array.from({ length: gridCount }).map((_, i) => {
    const val = (maxVal / (gridCount - 1)) * i;
    return { val, y: getY(val) };
  });

  const activePoint = hoveredIndex !== null ? data[hoveredIndex] : data[data.length - 1];

  return (
    <div className="bg-white border border-[#e7e5e4] p-5 h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-baseline mb-3">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#78716c]">
            {type === "global" ? "Global Serial Acquirers Performance" : "Nordic Serial Acquirers Performance"}
          </h3>
          <span className="text-[10px] font-mono text-[#1c1917] bg-stone-100 px-2 py-0.5 uppercase">
            Normalized 2004 = 100
          </span>
        </div>
        
        {/* The SVG element doing real high-precision mathematical plotting */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "500/280" }}>
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 500 280" 
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredIndex(null)}
            className="cursor-crosshair select-none"
          >
            {/* Gridlines */}
            {gridLines.map((line, i) => (
              <g key={i}>
                <line 
                  x1={paddingX} 
                  y1={line.y} 
                  x2={width - paddingX} 
                  y2={line.y} 
                  stroke="#e7e5e4" 
                  strokeWidth={0.5} 
                  strokeDasharray={i === 0 ? "0" : "3 3"}
                />
                <text 
                  x={paddingX - 8} 
                  y={line.y + 3} 
                  textAnchor="end" 
                  className="font-mono text-[9px] fill-[#a8a29e]"
                >
                  {Math.round(line.val)}
                </text>
              </g>
            ))}

            {/* X-axis indicators */}
            {data.map((d, i) => {
              const x = getX(i);
              return (
                <g key={i}>
                  {i % 2 === 0 && (
                    <text 
                      x={x} 
                      y={height - 12} 
                      textAnchor="middle" 
                      className="font-mono text-[9px] fill-[#78716c]"
                    >
                      {d.year}
                    </text>
                  )}
                  <line 
                    x1={x} 
                    y1={height - paddingY} 
                    x2={x} 
                    y2={height - paddingY + 4} 
                    stroke="#d6d3d1" 
                    strokeWidth={1}
                  />
                </g>
              );
            })}

            {/* Path lines */}
            {/* 1. S&P 500 / Sweden Index */}
            <path 
              d={getLinePath("benchmark")}
              fill="none"
              stroke="#a8a29e"
              strokeWidth={1.5}
              strokeDasharray="2 2"
              className="transition-all"
            />
            
            {/* 2. MSCI World */}
            <path 
              d={getLinePath("msci")}
              fill="none"
              stroke="#cbc6c2"
              strokeWidth={1.5}
              className="transition-all"
            />

            {/* 3. Berkshire Hathaway */}
            <path 
              d={getLinePath("berkshire")}
              fill="none"
              stroke="#57534e"
              strokeWidth={2}
              className="transition-all"
            />

            {/* 4. Acquisition-Driven Compounders / Serial Acquirers */}
            <path 
              d={getLinePath("serial")}
              fill="none"
              stroke="#1c1917"
              strokeWidth={3}
              className="transition-all"
            />

            {/* Hover guideline */}
            {hoveredIndex !== null && (
              <line 
                x1={getX(hoveredIndex)} 
                y1={paddingY} 
                x2={getX(hoveredIndex)} 
                y2={height - paddingY} 
                stroke="#1c1917" 
                strokeWidth={0.75} 
                strokeDasharray="4 4"
              />
            )}

            {/* Highlight dots and values at the dynamic active year */}
            <circle cx={getX(data.indexOf(activePoint))} cy={getY(activePoint.serial)} r={5} fill="#1c1917" />
            <circle cx={getX(data.indexOf(activePoint))} cy={getY(activePoint.berkshire)} r={4} fill="#57534e" />
            <circle cx={getX(data.indexOf(activePoint))} cy={getY(activePoint.benchmark)} r={4} fill="#a8a29e" />
          </svg>
        </div>
      </div>

      {/* Dynamic Key metrics panel */}
      <div className="grid grid-cols-4 border-t border-[#e7e5e4] pt-4 mt-2 gap-2 text-left">
        <div className="space-y-1">
          <div className="text-[10px] font-mono text-[#78716c] uppercase">Year</div>
          <div className="text-xl font-serif font-bold text-[#1c1917]">{activePoint.year}</div>
        </div>
        
        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase text-[#1c1917] font-semibold">Serial Acq.</div>
          <div className="text-xl font-serif font-bold text-[#1c1917]">
            {activePoint.serial === 100 ? "1.0x" : `${(activePoint.serial / 100).toFixed(1)}x`}
          </div>
          <span className="text-[9px] font-mono text-[#78716c] block leading-none">
            {type === "global" ? "CAGR 17.5%" : "CAGR 19.4%"}
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase text-[#57534e]">Berkshire</div>
          <div className="text-xl font-serif font-bold text-[#57534e]">
            {activePoint.berkshire === 100 ? "1.0x" : `${(activePoint.berkshire / 100).toFixed(1)}x`}
          </div>
          <span className="text-[9px] font-mono text-[#78716c] block leading-none">CAGR 9.7%</span>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase text-[#78716c]">
            {type === "global" ? "S&P 500" : "OMX Allshare"}
          </div>
          <div className="text-xl font-serif font-bold text-[#78716c]">
            {activePoint.benchmark === 100 ? "1.0x" : `${(activePoint.benchmark / 100).toFixed(1)}x`}
          </div>
          <span className="text-[9px] font-mono text-[#8a817c] block leading-none">
            {type === "global" ? "CAGR 7.6%" : "CAGR 7.9%"}
          </span>
        </div>
      </div>
    </div>
  );
}

// Custom interactive Europe Donut/Pie chart
export function SMEDonutChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  
  const SME_DATA = [
    { country: "Others", count: 4.9, color: "#1c1917", desc: "Diversified European niche bases" },
    { country: "Italy", count: 3.7, color: "#2d2926", desc: "High margins, robust manufacturing Mittelstand" },
    { country: "France", count: 2.9, color: "#453f3a", desc: "Longstanding B2B services, secure cashflow" },
    { country: "Spain", count: 2.5, color: "#5d554e", desc: "Highly isolated specialized local monopolies" },
    { country: "Germany", count: 2.4, color: "#796e64", desc: "Deep engineering, precision tools clusters" },
    { country: "UK", count: 1.9, color: "#92857a", desc: "Frictionless tech-enabled facility managers" },
    { country: "Poland", count: 1.6, color: "#a89b8f", desc: "Fast-developing Eastern manufacturing assets" },
    { country: "Scandinavia", count: 1.5, color: "#beaf9e", desc: "Superb compounding hub, low debt structures" },
    { country: "Netherlands", count: 1.1, color: "#cfbfad", desc: "Specialized logistics & transport services" },
    { country: "Czechia", count: 1.0, color: "#dfd3bf", desc: "Skilled precision metal & glass factories" }
  ];

  const total = SME_DATA.reduce((sum, item) => sum + item.count, 0);
  
  // Calculate polar slices
  let cumulativeAngle = 0;
  const slices = SME_DATA.map((item, i) => {
    const angle = (item.count / total) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;
    
    return {
      ...item,
      startAngle,
      endAngle,
      index: i
    };
  });

  const activeSegment = hoveredIdx !== null ? slices[hoveredIdx] : slices[1]; // default to Italy for high fidelity

  return (
    <div className="bg-white border border-[#e7e5e4] p-5 flex flex-col md:flex-row gap-6 items-center">
      <div className="relative w-48 h-48 shrink-0">
        <svg viewBox="0 0 200 200" className="w-full h-full select-none">
          {slices.map((slice) => {
            const pathData = describeArc(100, 100, 75, slice.startAngle, slice.endAngle);
            const isHovered = hoveredIdx === slice.index;
            return (
              <path
                key={slice.country}
                d={pathData}
                fill="none"
                stroke={slice.color}
                strokeWidth={isHovered ? 28 : 20}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(slice.index)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>
        
        {/* Label in the dead center of the donut chart */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] font-mono text-[#78716c] uppercase tracking-wider block">
            {activeSegment.country}
          </span>
          <span className="text-xl font-serif font-bold text-[#1c1917]">
            {((activeSegment.count / total) * 100).toFixed(1)}%
          </span>
          <span className="text-[9px] font-mono text-[#a8a29e] leading-none mt-0.5">
            {activeSegment.count.toFixed(1)}M SMEs
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#78716c]">
            Donut Distribution Breakdown
          </h4>
          <h3 className="font-serif text-lg font-light text-[#1c1917] mt-1">
            SMEs in Europe Profile
          </h3>
          <p className="text-xs text-[#57534e] font-light mt-1">
            Each slice outlines the volume of small-medium enterprises available in countries. Sizable pools of highly compoundable niche market operators.
          </p>
        </div>

        <div className="border border-[#e7e5e4]/60 p-3 bg-stone-50/50">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-xs font-bold text-[#1c1917]">{activeSegment.country} Advantage:</span>
            <span className="text-[10px] font-mono text-stone-500">Rank #{slices.indexOf(activeSegment) + 1}</span>
          </div>
          <p className="text-xs text-[#44403c] font-light leading-relaxed">
            {activeSegment.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

// Visual comparative table contrasting Serial Acquirers vs Private Equity
export function SerialAcquirersEdgeComparison() {
  const tableData = [
    {
      feature: "Investment Horizon",
      serial: "Permanent Home (Forever)",
      pe: "5 - 7 Years (Exit Bound)"
    },
    {
      feature: "Continuity of Culture",
      serial: "No Change (Legacy Protected)",
      pe: "Operational Overhauls Enforced"
    },
    {
      feature: "Due Diligence",
      serial: "Internal DD (Swift, Collaborative)",
      pe: "Long Process (Heavy Outsourced Advisers)"
    },
    {
      feature: "Governance Model",
      serial: "Slight Board Member (Decentralized Autonomy)",
      pe: "High Involvement (Disruptive Management Interventions)"
    },
    {
      feature: "Post Transaction",
      serial: "Operational Autonomy & Pure Financial Reporting",
      pe: "Forced Integrations & Aggressive Synergy Mandates"
    },
    {
      feature: "Financing Engine",
      serial: "Self-Generated Free Cash Flow Compounding",
      pe: "High Leverage Debt Buyouts & Cash Drain Interest"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="border border-[#e7e5e4] bg-white overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 bg-stone-50 border-b border-[#e7e5e4] p-4 text-xs font-mono uppercase tracking-widest font-bold text-[#1c1917]">
          <div>Feature Framework</div>
          <div className="mt-2 md:mt-0">Acquisition-Driven Compounder</div>
          <div className="mt-2 md:mt-0">Traditional Private Equity</div>
        </div>
        <div className="divide-y divide-[#e7e5e4]">
          {tableData.map((row, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 p-4 text-xs tracking-tight transition-colors hover:bg-stone-50/50">
              <div className="font-semibold text-[#1c1917] flex items-center">{row.feature}</div>
              <div className="mt-1 md:mt-0 text-[#1c1917] font-medium leading-relaxed pr-4 flex items-center md:border-l md:border-[#e7e5e4]/60 md:pl-4">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 mr-2 shrink-0"></span>
                {row.serial}
              </div>
              <div className="mt-1 md:mt-0 text-[#57534e] font-light leading-relaxed flex items-center md:border-l md:border-[#e7e5e4]/60 md:pl-4">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-stone-400 mr-2 shrink-0"></span>
                {row.pe}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<"home" | "rethink" | "ito" | "writings" | "about" | "whitepaper" | "realworld">("home");
  
  // Active sub-page in Ito wall
  const [itoSubView, setItoSubView] = useState<"index" | "solo" | "screener" | "stealth">("screener");

  // Router logic to synchronize window pathname with view status
  const navigateTo = (newView: "home" | "rethink" | "ito" | "writings" | "about" | "whitepaper" | "realworld", subView?: "index" | "solo" | "screener" | "stealth") => {
    setView(newView);
    if (subView) {
      setItoSubView(subView);
    }
    
    // Smooth HTML5 History push
    let p = "/";
    if (newView !== "home") {
      p = `/${newView}`;
      if (newView === "ito" && subView) {
        p = `/ito/${subView}`;
      }
    }
    window.history.pushState(null, "", p);
  };

  useEffect(() => {
    const handleLocale = () => {
      const p = window.location.pathname;
      const h = window.location.hash;
      const host = window.location.hostname;
      
      if (p.startsWith("/realworld") || p === "/rwi" || h === "#realworld" || h === "#rwi" || host.includes("realworld")) {
        setView("realworld");
      } else if (p === "/rethink" || h === "#rethink") {
        setView("rethink");
      } else if (p === "/ito/index" || h === "#index") {
        setView("ito");
        setItoSubView("index");
      } else if (p === "/ito/solo" || h === "#solo") {
        setView("ito");
        setItoSubView("solo");
      } else if (p === "/ito/screener" || h === "#screener") {
        setView("ito");
        setItoSubView("screener");
      } else if (p === "/whitepaper" || h === "#whitepaper") {
        setView("whitepaper");
      } else if (p === "/writings" || h === "#writings") {
        setView("writings");
      } else if (p === "/about" || h === "#about") {
        setView("about");
      } else {
        setView("home");
      }
    };
    
    handleLocale();
    window.addEventListener("popstate", handleLocale);
    window.addEventListener("hashchange", handleLocale);
    return () => {
      window.removeEventListener("popstate", handleLocale);
      window.removeEventListener("hashchange", handleLocale);
    };
  }, []);

  // Sync SEO metadata and document titles based on current top-level view
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (view === "home") {
      document.title = "Threads | Compound Impact for Eternity & Capital Allocation";
    } else if (view === "writings") {
      document.title = "Writings & Philosophy | Threads Holding Company";
    } else if (view === "about") {
      document.title = "About Threads | Permanent Capital & Decentralized Architecture";
    } else if (view === "whitepaper") {
      document.title = "Capital Allocation Platforms (CAPs) Treatise | Sagar Tandon";
    } else if (view === "rethink") {
      document.title = "Rethinking the West | Macroeconomic Decentralization";
    }
  }, [view]);

  // Ito password protection state (combining Real World Index and Solo behind Ito)
  const [itoPassword, setItoPassword] = useState("");
  const [isItoUnlocked, setIsItoUnlocked] = useState(() => {
    return sessionStorage.getItem("ito_unlocked") === "true";
  });
  const [itoPasswordError, setItoPasswordError] = useState(false);
  const [showItoPassword, setShowItoPassword] = useState(false);
  const itoPasswordInputRef = useRef<HTMLInputElement>(null);

  // Real World Index nested lock state
  const [indexPassword, setIndexPassword] = useState("");
  const [isIndexUnlocked, setIsIndexUnlocked] = useState(() => {
    return sessionStorage.getItem("index_unlocked") === "true";
  });
  const [indexPasswordError, setIndexPasswordError] = useState(false);
  const [showIndexPassword, setShowIndexPassword] = useState(false);
  const indexPasswordInputRef = useRef<HTMLInputElement>(null);

  // Solo nested lock state
  const [soloPassword, setSoloPassword] = useState("");
  const [isSoloUnlocked, setIsSoloUnlocked] = useState(() => {
    return sessionStorage.getItem("solo_unlocked") === "true";
  });
  const [soloPasswordError, setSoloPasswordError] = useState(false);
  const [showSoloPassword, setShowSoloPassword] = useState(false);
  const soloPasswordInputRef = useRef<HTMLInputElement>(null);

  // Search filter for Rethink Index essays
  const [essaySearch, setEssaySearch] = useState("");

  interface SubstackPub {
    id: string;
    listTitle: string;
    modalTitle: string;
    url: string;
    subdomain: string;
    category: string;
    description: string;
    themes: string[];
  }

  const publications: SubstackPub[] = [
    {
      id: "lifecanvas",
      listTitle: "Life Canvas",
      modalTitle: "Life Canvas",
      url: "https://lifecanvas.substack.com",
      subdomain: "lifecanvas.substack.com",
      category: "PHILOSOPHY OF BEING & HUMAN CONSCIOUSNESS",
      description: "Trying to understand what it means to be human—not by becoming someone, but by becoming Nobody. To shed ego, pride, lust. To walk, slowly, toward enlightenment.",
      themes: [
        "Being Nobody",
        "Shedding Ego & Pride",
        "Human Consciousness",
        "Path to Enlightenment"
      ]
    },
    {
      id: "firstfollowers",
      listTitle: "First Followers",
      modalTitle: "First Followers",
      url: "https://firstfollowers.substack.com",
      subdomain: "firstfollowers.substack.com",
      category: "IMPACT INVESTING & INNOVATIVE FINANCE",
      description: "Deep-dive research on impact investing, innovative finance models, private markets, venture capital dynamics, and Nordic ecosystem insights.",
      themes: [
        "Impact Investing",
        "Innovative Finance",
        "Private Markets",
        "VC Dynamics",
        "Nordic Insights"
      ]
    },
    {
      id: "idex",
      listTitle: "Impact Design (+) Experiences [IDEX]",
      modalTitle: "Impact Design (+) Experiences (IDEX)",
      url: "https://impactdesignexperiences.substack.com",
      subdomain: "impactdesignexperiences.substack.com",
      category: "CONSCIOUS CAPITALISM & REGENERATIVE FINANCE",
      description: "Essays exploring the confluence of Conscious Capitalism, regenerative capital structures, quantum philosophy, and systemic transformation.",
      themes: [
        "Conscious Capitalism",
        "Regenerative Finance",
        "Capital Stewardship",
        "Quantum Mindsets"
      ]
    }
  ];

  const [selectedSubstackModal, setSelectedSubstackModal] = useState<SubstackPub | null>(null);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("threads_theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("threads_theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("s@threadsunite.xyz");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendEmail = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const subject = encodeURIComponent(contactSubject || "Inquiry for Threads");
    const body = encodeURIComponent(contactMessage);
    window.location.href = `mailto:s@threadsunite.xyz?subject=${subject}&body=${body}`;
  };

  const essays = [
    {
      num: "01",
      title: "Only AI and Vibes",
      url: "https://firstfollowers.substack.com/p/only-ai-and-vibes",
      concept: "Synthesizing intelligence frameworks alongside pure operational and human chemistry."
    },
    {
      num: "02",
      title: "Being Nobody Essay: A Journey into Nothingness",
      url: "https://firstfollowers.substack.com/p/being-nobody",
      concept: "Radical humility as the ultimate baseline for enduring strategic stewardship."
    },
    {
      num: "03",
      title: "Death of Real World",
      url: "https://firstfollowers.substack.com/p/death-of-real-world",
      concept: "Examining the severe disconnect between speculative financial abstraction and pure product physics."
    },
    {
      num: "04",
      title: "Time to Hope",
      url: "https://firstfollowers.substack.com/p/time-to-hope",
      concept: "Long-range optimistic models built around cathedral architecture rather than speed of exit."
    },
    {
      num: "05",
      title: "Not VC (Delusional VC)",
      url: "https://firstfollowers.substack.com/p/not-vc",
      concept: "The mathematical limits of standard venture cycles versus permanent holding company advantages."
    },
    {
      num: "06",
      title: "Trust as an Infrastructure",
      url: "https://firstfollowers.substack.com/p/trust-as-an-infrastructure",
      concept: "Decentralized architecture acts as a secure cryptographic ledger of institutional reliability."
    },
    {
      num: "07",
      title: "Compound Impact",
      url: "https://firstfollowers.substack.com/p/compound-impact",
      concept: "Simple recursive actions that quietly yield unassailable long-term qualitative moats."
    },
    {
      num: "08",
      title: "The Servant Leader",
      url: "https://open.substack.com/pub/impactdesignexperiences/p/the-servant-leader",
      concept: "Relinquishing control as the singular mechanism to establish authentic vertical autonomy."
    },
    {
      num: "09",
      title: "Open Letter to Leaders",
      url: "https://open.substack.com/pub/impactdesignexperiences/p/open-letter-to-leaders",
      concept: "An urgent protocol change for our critical institutional architects toward quiet stewardship."
    },
    {
      num: "10",
      title: "Inner Portfolio",
      url: "https://open.substack.com/pub/impactdesignexperiences/p/the-inner-portfolio",
      concept: "Managing private virtues, emotional balance, and internal conviction over raw asset count."
    },
    {
      num: "11",
      title: "Case for Conscious Sovereignty",
      url: "https://open.substack.com/pub/impactdesignexperiences/p/case-for-conscious-sovereignty",
      concept: "Why resilient private structures must insulate themselves from short-term public hysteria."
    },
    {
      num: "12",
      title: "Our Erotic Fetish with Hype",
      url: "https://open.substack.com/pub/impactdesignexperiences/p/our-erotic-fetish-with-hype",
      concept: "Deconstructing our addiction to speculative velocity in favor of steady, real-world returns."
    },
    {
      num: "13",
      title: "The Case Against Impact Urgency",
      url: "https://open.substack.com/pub/impactdesignexperiences/p/the-case-against-impact-urgency",
      concept: "True multi-decade structural transition demands rigorous pace and absolute patience."
    },
    {
      num: "14",
      title: "You Are Wrong Milton Friedman",
      url: "https://open.substack.com/pub/impactdesignexperiences/p/youre-wrong-milton-friedman",
      concept: "Redefining stakeholder dynamics through the real mechanics of permanent communities."
    },
    {
      num: "15",
      title: "Scale?",
      url: "https://open.substack.com/pub/impactdesignexperiences/p/scale",
      concept: "Questioning structural enlargement versus stable, self-perpetuating local operation."
    },
    {
      num: "16",
      title: "Virtuous",
      url: "https://open.substack.com/pub/impactdesignexperiences/p/virtuous",
      concept: "Aligning deep qualitative intent with capital structures built for next-generation survival."
    },
    {
      num: "17",
      title: "The Art of Stillness",
      url: "https://open.substack.com/pub/impactdesignexperiences/p/the-art-of-stillness",
      concept: "How operational silence creates the necessary space for profound capital decisions."
    },
    {
      num: "18",
      title: "Serious Problem with Peter Thiel",
      url: "https://open.substack.com/pub/impactdesignexperiences/p/serious-problem-with-peter-thiel",
      concept: "An economic review of monopoly strategies against the decentralized real-world economy."
    },
    {
      num: "19",
      title: "The Silent Investor: Women",
      url: "https://open.substack.com/pub/impactdesignexperiences/p/the-silent-investor",
      concept: "Highlighting the overlooked, foundational role of long-horizon capital allocators."
    },
    {
      num: "20",
      title: "The Sacred Art of Silence",
      url: "https://open.substack.com/pub/impactdesignexperiences/p/the-sacred-art-of-silence",
      concept: "Quiet performance as a strategy to evade competitive friction and build resilient value."
    },
    {
      num: "21",
      title: "Healthy Dissonance",
      url: "https://open.substack.com/pub/impactdesignexperiences/p/healthy-dissonance",
      concept: "Maintaining independent, rigorous thinking in an era of standardizing consensus."
    },
    {
      num: "22",
      title: "Impact Ego",
      url: "https://open.substack.com/pub/impactdesignexperiences/p/impact-ego",
      concept: "Decoupling actual system improvements from loud, self-aggrandizing public relations campaigns."
    },
    {
      num: "23",
      title: "Rethinking the West",
      url: "https://open.substack.com/pub/lifecanvas/p/rethinking-the-west",
      concept: "Analyzing macroeconomic decentralization and the rediscovery of eastern cathedral frameworks."
    },
    {
      num: "24",
      title: "Beyond Language",
      url: "https://lifecanvas.substack.com/p/beyond-language-",
      concept: "Quiet investigation of reality and consciousness existing prior to structural linguistics."
    },
    {
      num: "25",
      title: "Dialogue Over Debate",
      url: "https://lifecanvas.substack.com/p/dialogue-over-debate",
      concept: "Moving beyond dialectal conflict toward Bohmian collective field dialogue."
    }
  ];

  const handleItoPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPassword = itoPassword.trim().toLowerCase();
    if (cleanPassword === "itoisreal" || cleanPassword === "realworldisreal" || cleanPassword === "itounite" || cleanPassword === "itowillunite921") {
      setIsItoUnlocked(true);
      setItoPasswordError(false);
      sessionStorage.setItem("ito_unlocked", "true");
    } else {
      setItoPasswordError(true);
      // Subtle shake or feedback
      setTimeout(() => setItoPasswordError(false), 800);
    }
  };

  const handleItoLockStatus = () => {
    setIsItoUnlocked(false);
    setItoPassword("");
    sessionStorage.removeItem("ito_unlocked");
  };

  // Keyboard shortcut to focus password values when a lock screen is loaded
  useEffect(() => {
    if (view === "ito") {
      if (!isItoUnlocked && (itoSubView === "index" || itoSubView === "solo") && itoPasswordInputRef.current) {
        itoPasswordInputRef.current.focus();
      }
    }
  }, [view, isItoUnlocked, itoSubView]);

  const segments = [
    {
      id: "state",
      title: "1. Beyond Identity",
      description: "For Policy Makers, Public Leaders, and Nation States",
      itemNums: ["11", "23", "06", "04", "08", "09", "25"]
    },
    {
      id: "capital",
      title: "2. Capitalism That Works",
      description: "For financiers, capitalists, philanthropists, business builders, technologists, innovators, etc.",
      itemNums: ["01", "03", "05", "07", "10", "12", "13", "14", "15", "18", "19"]
    },
    {
      id: "individual",
      title: "3. Being Nobody",
      description: "Life Philosophy - For Everyone",
      itemNums: ["22", "21", "20", "17", "16", "02", "24"]
    }
  ];

  // Segment essays
  const segmentedEssays = segments.map(seg => {
    const filtered = essays.filter(essay => {
      const isInSegment = seg.itemNums.includes(essay.num);
      const matchesSearch = essay.title.toLowerCase().includes(essaySearch.toLowerCase()) ||
                            essay.concept.toLowerCase().includes(essaySearch.toLowerCase());
      return isInSegment && matchesSearch;
    });
    return {
      ...seg,
      items: filtered
    };
  });

  const hasAnyMatches = segmentedEssays.some(seg => seg.items.length > 0);

  return (
    <div className={`relative h-[100dvh] overflow-hidden font-sans flex flex-col justify-between transition-colors duration-300 ${
      isDarkMode 
        ? "bg-[#0c0a09] text-[#fafaf9] selection:bg-[#fafaf9] selection:text-[#0c0a09]" 
        : "bg-[#fafaf9] text-[#1c1917] selection:bg-[#1c1917] selection:text-[#fafaf9]"
    }`}>
      
      {/* Black & White Nordic Forest, Lakes & Baltic Sea Line Art Sketch Background */}
      <NordicBackground isDarkMode={isDarkMode} />

      {/* Editorial Header */}
      <header className={`border-b sticky top-0 backdrop-blur-md z-50 shrink-0 transition-colors duration-300 ${
        isDarkMode ? "border-[#27272a] bg-[#0c0a09]/90 text-[#fafaf9]" : "border-[#e7e5e4] bg-[#fafaf9]/90 text-[#1c1917]"
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo Brand: Threads logo - 1 small in the top left corner */}
          <button 
            onClick={() => navigateTo("home")}
            className="flex items-center gap-2.5 group select-none text-left cursor-pointer shrink-0"
          >
            {/* Thread logo: 1 small in the top left corner */}
            <ThreadsLogo className={`w-8 h-8 ${isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"}`} />
            <span className={`text-base font-space font-extrabold tracking-tight uppercase group-hover:line-through decoration-2 ${
              isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"
            }`}>
              THREADS
            </span>
          </button>

          {/* Minimal Navigation Links & Theme Toggle aligned together */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <nav className={`flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-xs uppercase tracking-widest font-semibold ${
              isDarkMode ? "text-[#a1a1aa]" : "text-[#57534e]"
            }`}>
              <button 
                onClick={() => navigateTo("home")}
                className={`pb-0.5 border-b cursor-pointer transition-all ${
                  view === "home" 
                    ? isDarkMode ? "text-[#fafaf9] border-[#fafaf9]" : "text-[#1c1917] border-[#1c1917]" 
                    : isDarkMode ? "border-transparent hover:text-[#fafaf9]" : "border-transparent hover:text-[#1c1917]"
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => navigateTo("realworld")}
                className={`pb-0.5 border-b cursor-pointer transition-all ${
                  view === "realworld" 
                    ? isDarkMode ? "text-[#fafaf9] border-[#fafaf9]" : "text-[#1c1917] border-[#1c1917]" 
                    : isDarkMode ? "border-transparent hover:text-[#fafaf9]" : "border-transparent hover:text-[#1c1917]"
                }`}
              >
                Real World Index
              </button>
              <button 
                onClick={() => navigateTo("writings")}
                className={`pb-0.5 border-b cursor-pointer transition-all ${
                  view === "writings" 
                    ? isDarkMode ? "text-[#fafaf9] border-[#fafaf9]" : "text-[#1c1917] border-[#1c1917]" 
                    : isDarkMode ? "border-transparent hover:text-[#fafaf9]" : "border-transparent hover:text-[#1c1917]"
                }`}
              >
                Writings
              </button>
              <button 
                onClick={() => navigateTo("about")}
                className={`pb-0.5 border-b cursor-pointer transition-all ${
                  view === "about" 
                    ? isDarkMode ? "text-[#fafaf9] border-[#fafaf9]" : "text-[#1c1917] border-[#1c1917]" 
                    : isDarkMode ? "border-transparent hover:text-[#fafaf9]" : "border-transparent hover:text-[#1c1917]"
                }`}
              >
                About
              </button>
            </nav>

            {/* Light / Dark Function Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-1.5 px-3 rounded-sm border text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer ${
                isDarkMode 
                  ? "border-[#3f3f46] bg-[#1c1917] text-[#fafaf9] hover:bg-[#27272a] shadow-xs" 
                  : "border-[#d6d3d1] bg-white text-[#1c1917] hover:bg-[#fafaf9] shadow-xs"
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle light and dark mode"
            >
              {isDarkMode ? <Sun size={13} className="text-[#facc15]" /> : <Moon size={13} className="text-[#1c1917]" />}
              <span>{isDarkMode ? "LIGHT" : "DARK"}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area with elegant animations */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-4 md:py-5 overflow-y-auto min-h-0 relative z-10">
        <AnimatePresence mode="wait">
          
          {/* 1. HOME VIEW */}
          {view === "home" && (
            <motion.div
              key="home-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="h-full flex flex-col justify-center items-center text-center max-w-4xl mx-auto py-2"
            >
              <div className={`w-12 h-px mb-6 ${isDarkMode ? "bg-[#3f3f46]" : "bg-[#d6d3d1]"}`}></div>
              
              <h1 className={`font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light leading-[1.3] tracking-tight max-w-3xl mx-auto ${
                isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"
              }`}>
                <span className="block sm:whitespace-nowrap">Threads' existentialist purpose is to</span>
                <span className={`italic block font-normal mt-2 ${isDarkMode ? "text-[#fafaf9]" : "text-stone-900"}`}>
                  compound impact for eternity.
                </span>
              </h1>
              
              <div className={`w-12 h-px mt-6 mb-5 ${isDarkMode ? "bg-[#3f3f46]" : "bg-[#d6d3d1]"}`}></div>
              
              {/* Navigation recommendation */}
              <div className="flex flex-wrap gap-4 items-center justify-center">
                <button 
                  onClick={() => navigateTo("realworld")}
                  className={`text-[10px] uppercase tracking-widest font-bold px-4 py-2 cursor-pointer transition-all rounded-sm ${
                    isDarkMode ? "bg-[#fafaf9] text-[#0c0a09] hover:bg-stone-200" : "bg-[#1c1917] text-[#fafaf9] hover:bg-stone-800"
                  }`}
                >
                  Real World Index →
                </button>
                <button 
                  onClick={() => navigateTo("writings")}
                  className={`text-[10px] uppercase tracking-widest font-bold border px-4 py-2 cursor-pointer transition-all rounded-sm ${
                    isDarkMode 
                      ? "border-[#3f3f46] bg-[#1c1917]/80 hover:bg-[#1c1917] text-[#fafaf9]" 
                      : "border-[#d6d3d1] hover:border-[#1c1917] bg-white/80 hover:bg-white text-[#1c1917]"
                  }`}
                >
                  Writings →
                </button>
                <button 
                  onClick={() => navigateTo("about")}
                  className={`text-[10px] uppercase tracking-widest font-bold border px-4 py-2 cursor-pointer transition-all rounded-sm ${
                    isDarkMode 
                      ? "border-[#3f3f46] bg-[#1c1917]/80 hover:bg-[#1c1917] text-[#fafaf9]" 
                      : "border-[#d6d3d1] hover:border-[#1c1917] bg-white/80 hover:bg-white text-[#1c1917]"
                  }`}
                >
                  About →
                </button>
              </div>
            </motion.div>
          )}

          {/* 2. RETHINK VIEW */}
          {view === "rethink" && (
            <motion.div
              key="rethink-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="space-y-16"
            >
              {/* Intro Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-7 lg:col-span-8 border-l-2 border-[#1c1917] pl-6 md:pl-8 py-2">
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#78716c] block mb-2">Think Tank</span>
                  <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light leading-snug text-[#1c1917]">
                    ReThink is pushing the boundaries of the <span className="italic">“thought”</span> as defined by David Bohm in his work that could help us seed a world that has peace, prosperity for all, and care for the planet.
                  </h1>
                </div>

                <div className="md:col-span-5 lg:col-span-4 bg-[#1c1917] text-[#fafaf9] p-6 md:p-8 flex flex-col justify-between border border-[#1c1917]">
                  <p className="font-serif italic text-xs md:text-sm leading-relaxed text-stone-200">
                    "If I am right in saying that thought is the ultimate origin or source, it follows that if we don't do anything about thought, we won't get anywhere. We may momentarily relieve the population problem, the ecological problem, and so on, but they will come back in another way."
                  </p>
                  <div className="mt-4 border-t border-stone-800 pt-3 text-right">
                    <span className="font-sans text-[10px] uppercase tracking-wider text-stone-400 font-semibold">— David Bohm</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Essays List Section */}
              <div className="border-t border-[#e7e5e4] pt-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                  <div>
                    <h2 className="font-serif text-xl md:text-2xl font-normal text-[#1c1917] italic">Insight Articles & Essays</h2>
                    <p className="text-xs text-[#78716c] mt-1">Refined perspectives exploring systemic macroeconomics and conscious progress.</p>
                  </div>
                  
                  {/* Custom Minimal Search bar inside think tank */}
                  <div className="relative w-full md:w-72">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8a29e]" />
                    <input
                      type="text"
                      placeholder="Search essays..."
                      value={essaySearch}
                      onChange={(e) => setEssaySearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-[#d6d3d1] focus:border-[#1c1917] focus:outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                {hasAnyMatches ? (
                  <div className="space-y-16">
                    {segmentedEssays.map((seg) => {
                      if (seg.items.length === 0) return null;
                      return (
                        <div key={seg.id} className="space-y-6">
                          <div className="border-l-2 border-[#1c1917] pl-4 md:pl-5 py-0.5">
                            <h3 className="font-serif text-lg md:text-xl font-normal text-[#1c1917] tracking-tight">{seg.title}</h3>
                            <p className="text-xs text-[#78716c] font-normal leading-relaxed mt-1">{seg.description}</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {seg.items.map((essay) => (
                              <a
                                key={essay.num}
                                href={essay.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative bg-[#ffffff] p-6 border border-[#e7e5e4] hover:border-[#1c1917] transition-all duration-300 flex flex-col justify-between"
                              >
                                {/* Overlay subtle marker */}
                                <div className="absolute top-0 left-0 w-1 h-0 bg-[#1c1917] group-hover:h-full transition-all duration-300"></div>
                                
                                <div>
                                  <div className="flex justify-between items-center mb-4">
                                    <span className="font-mono text-[9px] text-[#a8a29e] font-semibold">{essay.num}</span>
                                    <ArrowUpRight size={13} className="text-[#a8a29e] group-hover:text-[#1c1917] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                  </div>
                                  
                                  <h3 className="text-sm font-bold tracking-tight text-[#1c1917] mb-2 font-sans group-hover:underline decoration-1 underline-offset-4">
                                    {essay.title}
                                  </h3>
                                </div>
                                
                                <p className="text-xs text-[#57534e] font-light leading-relaxed mt-4">
                                  {essay.concept}
                                </p>
                              </a>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center border border-dashed border-[#d6d3d1] rounded bg-stone-50">
                    <p className="text-xs text-[#78716c] font-mono">No essays match your inquiry.</p>
                    <button 
                      onClick={() => setEssaySearch("")}
                      className="text-xs font-semibold text-[#1c1917] underline mt-2 hover:opacity-75"
                    >
                      Clear search filter
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 3. ITO VIEW (PASSWORD PROTECTED) */}
          {view === "ito" && (
            <motion.div
              key="ito-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="max-w-4xl mx-auto"
            >
              <AnimatePresence mode="wait">
                
                {/* A. LOCKED STATE */}
                {false ? (
                  <motion.div
                    key="ito-gate-screen"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="max-w-md mx-auto py-16 px-8 bg-white border border-[#e7e5e4] text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-6">
                      <Lock size={18} className="text-[#78716c]" />
                    </div>
                    
                    <h2 className="font-serif text-lg font-normal mb-2 text-[#1c1917]">
                      Products Access
                    </h2>
                    
                    <p className="text-xs text-[#78716c] leading-relaxed mb-6 font-mono">
                      This sovereign project is restricted. Please sign in with the platform access code.
                    </p>

                    <form onSubmit={handleItoPasswordSubmit} className="space-y-4">
                      <div className="relative">
                        <input
                          ref={itoPasswordInputRef}
                          type={showItoPassword ? "text" : "password"}
                          value={itoPassword}
                          onChange={(e) => {
                            setItoPassword(e.target.value);
                            setItoPasswordError(false);
                          }}
                          placeholder="Enter Password"
                          className={`w-full px-4 py-2.5 text-xs text-center border transition-all focus:outline-none focus:ring-1 font-mono ${
                            itoPasswordError 
                              ? "border-red-500 ring-1 ring-red-500/20 bg-red-50/20" 
                              : "border-[#d6d3d1] focus:border-[#1c1917] focus:ring-[#1c1917]/20 bg-stone-50"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowItoPassword(!showItoPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a8a29e] hover:text-[#1c1917]"
                        >
                          {showItoPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>

                      {itoPasswordError && (
                        <motion.p 
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[10px] text-red-600 font-mono text-center"
                        >
                          Incorrect access token. Please verify or try again.
                        </motion.p>
                      )}

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#1c1917] hover:bg-stone-800 text-[#fafaf9] text-xs uppercase tracking-widest font-bold font-mono transition-colors"
                      >
                        Unlock Products
                      </button>
                    </form>
                    
                    <p className="text-[9px] text-[#a8a29e] mt-6 font-mono">
                      HINT FOR REVIEW: itoisreal
                    </p>
                  </motion.div>
                ) : (
                  
                  // B. UNLOCKED STATE
                  <motion.div
                    key="ito-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-12"
                  >
                    {/* Header bar within unlocked Ito */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#e7e5e4] pb-6 gap-6">
                      <div className="flex flex-wrap items-center gap-6 text-xs font-mono uppercase tracking-wider">
                        {/* Stealth/WIP umbrella group */}
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[9px] font-mono tracking-[0.2em] text-stone-400 font-bold uppercase">Stealth / WIP</span>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => navigateTo("ito", "stealth")}
                              className={`px-3 py-1.5 border font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                                itoSubView === "stealth" || itoSubView === "index" || itoSubView === "solo"
                                  ? "bg-[#1c1917] text-[#fafaf9] border-[#1c1917]"
                                  : "bg-white text-[#57534e] border-[#e7e5e4] hover:text-[#1c1917] hover:border-[#1c1917]"
                              }`}
                            >
                              Stealth Room
                              {isItoUnlocked ? (
                                <Unlock size={10} className={itoSubView === "stealth" || itoSubView === "index" || itoSubView === "solo" ? "text-emerald-400" : "text-emerald-600"} />
                              ) : (
                                <Lock size={10} className="opacity-60" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="hidden md:block h-8 w-px bg-stone-200"></div>

                        {/* Analytical Engines group */}
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[9px] font-mono tracking-[0.2em] text-stone-400 font-bold uppercase">Production</span>
                          <button
                            onClick={() => navigateTo("ito", "screener")}
                            className={`px-3 py-1.5 border font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                              itoSubView === "screener"
                                ? "bg-[#1c1917] text-[#fafaf9] border-[#1c1917]"
                                : "bg-white text-[#57534e] border-[#e7e5e4] hover:text-[#1c1917] hover:border-[#1c1917]"
                            }`}
                          >
                            Screener Apps
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isItoUnlocked ? "bg-emerald-600 animate-pulse" : "bg-amber-500"}`}></span>
                          <span className={`text-[10px] font-mono uppercase tracking-[0.2em] font-semibold px-2.5 py-1 font-mono ${
                            isItoUnlocked 
                              ? "text-emerald-700 bg-emerald-50" 
                              : "text-amber-700 bg-amber-50"
                          }`}>
                            {isItoUnlocked ? "Stealth Unlocked" : "Stealth Locked"}
                          </span>
                        </div>
                        
                        {isItoUnlocked && (itoSubView === "stealth" || itoSubView === "index" || itoSubView === "solo") && (
                          <button
                            onClick={handleItoLockStatus}
                            className="text-[10px] uppercase font-mono tracking-wider bg-stone-100 hover:bg-stone-200 px-3 py-1.5 transition-colors cursor-pointer text-[#57534e]"
                          >
                            Lock wall
                          </button>
                        )}
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      
                      {/* SUBVIEW 0: STEALTH WALL CONTAINER */}
                      {itoSubView === "stealth" && (
                        <motion.div
                          key="ito-stealth-pane"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-6"
                        >
                          {!isItoUnlocked ? (
                            <div className="max-w-md mx-auto py-8 px-6 bg-white border border-[#e7e5e4] text-center my-2 shadow-sm">
                              <div className="w-10 h-10 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-4">
                                <Lock size={16} className="text-[#78716c]" />
                              </div>
                              <h2 className="font-serif text-base font-normal mb-1.5 text-[#1c1917]">
                                Stealth WIP Access
                              </h2>
                              <p className="text-[11px] text-[#78716c] leading-relaxed mb-4 font-mono">
                                This zone contains work-in-progress programmatic structures and is restricted to authorized partners. Please supply the stealth access key.
                              </p>
                              <form onSubmit={handleItoPasswordSubmit} className="space-y-3">
                                <div className="relative">
                                  <input
                                    ref={itoPasswordInputRef}
                                    type={showItoPassword ? "text" : "password"}
                                    value={itoPassword}
                                    onChange={(e) => {
                                      setItoPassword(e.target.value);
                                      setItoPasswordError(false);
                                    }}
                                    placeholder="Enter Access Key"
                                    className={`w-full px-4 py-2 text-xs text-center border transition-all focus:outline-none focus:ring-1 font-mono ${
                                      itoPasswordError 
                                        ? "border-red-500 ring-1 ring-red-500/20 bg-red-50/20" 
                                        : "border-[#d6d3d1] focus:border-[#1c1917] focus:ring-[#1c1917]/20 bg-stone-50"
                                    }`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowItoPassword(!showItoPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a8a29e] hover:text-[#1c1917]"
                                  >
                                    {showItoPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                                  </button>
                                </div>
                                {itoPasswordError && (
                                  <p className="text-[10px] text-red-600 font-mono text-center">
                                    Incorrect clean key. Please verify or try again.
                                  </p>
                                )}
                                <button
                                  type="submit"
                                  className="w-full py-2 bg-[#1c1917] hover:bg-stone-800 text-[#fafaf9] text-xs uppercase tracking-widest font-bold font-mono transition-colors cursor-pointer"
                                >
                                  Unlock Stealth WIP
                                </button>
                              </form>
                              <p className="text-[9px] text-[#a8a29e] mt-4 font-mono">
                                HINT FOR REVIEW: itoisreal
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-12">
                              <div className="border-b border-[#e7e5e4] pb-6">
                                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#78716c] block mb-1">Stealth WIP Portal</span>
                                <h2 className="font-serif text-3xl font-light text-[#1c1917]">
                                  Stealth Room
                                </h2>
                                <p className="text-sm text-[#78716c] mt-2 font-mono">
                                  Restricted workspace containing active development frameworks, strategic thesis papers, and live compounding index trackers.
                                </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Product 1: Real World Index */}
                                <div className="border border-[#e7e5e4] bg-white hover:border-[#1c1917] p-8 flex flex-col justify-between transition-all group shadow-sm rounded-sm">
                                  <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                      <span className="text-[9px] font-mono tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 font-semibold">
                                        WIP / Index
                                      </span>
                                      <ArrowUpRight size={16} className="text-stone-400 group-hover:text-[#1c1917] transition-colors" />
                                    </div>
                                    <h3 className="font-serif text-xl font-normal text-[#1c1917]">
                                      Real World Index
                                    </h3>
                                    <p className="text-xs text-[#57534e]/90 font-mono leading-relaxed">
                                      Interactive quantitative tracking platform comparing serial acquisition index performance. Analyze geographic clusters, SME distributions, and corporate resilience.
                                    </p>
                                  </div>
                                  <div className="pt-8">
                                    <button
                                      onClick={() => navigateTo("ito", "index")}
                                      className="inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider text-[#fafaf9] bg-[#1c1917] hover:bg-stone-800 px-4 py-2 hover:underline transition-all cursor-pointer"
                                    >
                                      Launch Index Dashboard
                                    </button>
                                  </div>
                                </div>

                                {/* Product 2: Threads Solo */}
                                <div className="border border-[#e7e5e4] bg-white hover:border-[#1c1917] p-8 flex flex-col justify-between transition-all group shadow-sm rounded-sm">
                                  <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                      <span className="text-[9px] font-mono tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 font-semibold">
                                        WIP / Incubation
                                      </span>
                                      <ArrowUpRight size={16} className="text-stone-400 group-hover:text-[#1c1917] transition-colors" />
                                    </div>
                                    <h3 className="font-serif text-xl font-normal text-[#1c1917]">
                                      Threads Solo
                                    </h3>
                                    <p className="text-xs text-[#57534e]/90 font-mono leading-relaxed">
                                      Sovereign incubation framework raising €20M to scale stable small-scale capital compounding. Evolving SMEs with AI diligence and long-term holding architectures.
                                    </p>
                                  </div>
                                  <div className="pt-8">
                                    <button
                                      onClick={() => navigateTo("ito", "solo")}
                                      className="inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider text-[#fafaf9] bg-[#1c1917] hover:bg-stone-800 px-4 py-2 hover:underline transition-all cursor-pointer"
                                    >
                                      Launch Solo Proposal
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* SUBVIEW 1: REAL WORLD INDEX */}
                      {itoSubView === "index" && (
                        <motion.div
                          key="ito-index-pane"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-12"
                        >
                          {!isItoUnlocked ? (
                            <div className="max-w-md mx-auto py-16 px-8 bg-white border border-[#e7e5e4] text-center my-8 shadow-sm">
                              <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-6">
                                <Lock size={18} className="text-[#78716c]" />
                              </div>
                              <h2 className="font-serif text-lg font-normal mb-2 text-[#1c1917]">
                                Stealth WIP Access
                              </h2>
                              <p className="text-xs text-[#78716c] leading-relaxed mb-6 font-mono">
                                This zone contains work-in-progress programmatic structures and is restricted to authorized partners. Please supply the stealth access key.
                              </p>
                              <form onSubmit={handleItoPasswordSubmit} className="space-y-4">
                                <div className="relative">
                                  <input
                                    ref={itoPasswordInputRef}
                                    type={showItoPassword ? "text" : "password"}
                                    value={itoPassword}
                                    onChange={(e) => {
                                      setItoPassword(e.target.value);
                                      setItoPasswordError(false);
                                    }}
                                    placeholder="Enter Access Key"
                                    className={`w-full px-4 py-2.5 text-xs text-center border transition-all focus:outline-none focus:ring-1 font-mono ${
                                      itoPasswordError 
                                        ? "border-red-500 ring-1 ring-red-500/20 bg-red-50/20" 
                                        : "border-[#d6d3d1] focus:border-[#1c1917] focus:ring-[#1c1917]/20 bg-stone-50"
                                    }`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowItoPassword(!showItoPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a8a29e] hover:text-[#1c1917]"
                                  >
                                    {showItoPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                  </button>
                                </div>
                                {itoPasswordError && (
                                  <p className="text-[10px] text-red-600 font-mono text-center">
                                    Incorrect clean key. Please verify or try again.
                                  </p>
                                )}
                                <button
                                  type="submit"
                                  className="w-full py-2.5 bg-[#1c1917] hover:bg-stone-800 text-[#fafaf9] text-xs uppercase tracking-widest font-bold font-mono transition-colors cursor-pointer"
                                >
                                  Unlock Stealth WIP
                                </button>
                              </form>
                              <p className="text-[9px] text-[#a8a29e] mt-6 font-mono">
                                HINT FOR REVIEW: itoisreal
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-12">
                              {/* Decryption identifier and page lock action */}
                              <div className="flex justify-between items-center border-b border-[#e7e5e4]/60 pb-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => navigateTo("ito", "stealth")}
                                    className="text-[9px] uppercase font-mono tracking-wider bg-stone-100 hover:bg-stone-200 px-2.5 py-1 border border-stone-200 cursor-pointer transition-colors text-[#57534e]"
                                  >
                                    ← Stealth Room
                                  </button>
                                  <span className="text-[9px] font-mono tracking-widest uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 font-semibold">
                                    Index Decrypted • Authorized Access
                                  </span>
                                </div>
                                <button
                                  onClick={handleItoLockStatus}
                                  className="text-[9px] uppercase font-mono tracking-wider bg-stone-100 hover:bg-stone-200 px-2.5 py-1.5 cursor-pointer transition-colors text-[#57534e]"
                                >
                                  Lock document
                                </button>
                              </div>


                              {/* Rich Layout of the Article Content */}
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                                <div className="md:col-span-8 space-y-8">
                                  <h1 className="font-serif text-3xl md:text-4xl font-light text-[#1c1917] leading-tight">
                                    The Real World Index
                                  </h1>
                                  <p className="text-sm md:text-base text-[#292524] font-light leading-relaxed">
                                    The Real World Index is a specialized investment vehicle designed to capture the superior returns of the "Serial Acquirer" business model. By investing in a curated basket of 15–20 listed serial acquirers, this vehicle provides investors with diversified, liquid exposure to the high-yield private SME (Small and Medium Enterprise) market without the illiquidity or high fees of traditional PE.
                                  </p>
                                  <p className="text-sm md:text-base text-[#292524] font-light leading-relaxed">
                                    Through these 15–30 public holdings (focus - Japan, Nordics, North America), investors gain indirect ownership of over 2,000-5,000 underlying SMEs that are part of the real world economy. This creates a massive diversification effect, mitigating single-company risk.
                                  </p>

                                  {/* High-fidelity prompt-specified benchmark analysis link */}
                                  <div className="p-5 border border-emerald-100 bg-emerald-50/20 rounded-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8">
                                    <div className="space-y-1 max-w-lg">
                                      <h4 className="font-serif text-sm font-semibold text-[#1c1917]">
                                        Benchmark Portfolio Analysis
                                      </h4>
                                      <p className="text-xs text-[#57534e] font-light leading-relaxed">
                                        Access our active standalone quantitative modeling platform. View direct performance tracking and detailed compound comparison done with Berkshire Hathaway and the S&P 500.
                                      </p>
                                    </div>
                                    <a
                                      href="https://real-world-zslo.onrender.com/"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center justify-center gap-1.5 bg-[#1c1917] hover:bg-stone-850 text-white font-mono text-[10px] uppercase font-bold tracking-widest px-4 py-2.5 transition-colors shrink-0"
                                    >
                                      View Benchmark <ArrowUpRight size={13} strokeWidth={2.5} />
                                    </a>
                                  </div>
                                </div>

                                {/* Right Sidebar - Highlight Stats */}
                                <div className="md:col-span-4 bg-[#ffffff] p-6 border border-[#e7e5e4] space-y-6 flex flex-col justify-between">
                                  <div>
                                    <span className="font-mono text-[10px] text-[#78716c] uppercase tracking-wider block mb-4 border-b border-stone-100 pb-2">
                                      Index Anatomy
                                    </span>
                                    <div className="space-y-4">
                                      <div>
                                        <div className="text-2xl font-serif font-semibold text-[#1c1917]">15–30</div>
                                        <div className="text-[10px] font-mono uppercase text-[#78716c] tracking-wider">Public Holdings</div>
                                      </div>
                                      <div>
                                        <div className="text-2xl font-serif font-semibold text-[#1c1917]">2,000+</div>
                                        <div className="text-[10px] font-mono uppercase text-[#78716c] tracking-wider">Underlying SMEs</div>
                                      </div>
                                      <div>
                                        <div className="text-2xl font-serif font-semibold text-[#1c1917]">Global</div>
                                        <div className="text-[10px] font-mono uppercase text-[#78716c] tracking-wider">Japan • Nordics • North America</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="pt-6 border-t border-stone-100">
                                    <p className="text-[10.5px] font-mono leading-relaxed text-[#78716c]">
                                      Diversifying single-company tail risk through continuous, algorithmic small-scale compounding.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Interactive Visualizations Block - Beautifully Integrated */}
                              <div className="space-y-8 pt-4">
                                <div className="border border-[#e7e5e4] p-6 bg-stone-50/40 space-y-6">
                                  <div>
                                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#78716c] block">
                                      Real-World Metrics
                                    </span>
                                    <h3 className="font-serif text-xl font-normal text-[#1c1917] mt-1">
                                      Empirical Capital Compounding Records
                                    </h3>
                                    <p className="text-xs text-[#57534e] font-light">
                                      Interactive charting representing the long-term compound performance of serial acquisition frameworks relative to primary world benchmarks and diversified small enterprise distribution indexes in Europe.
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                                    <PerformanceLineChart type="global" />
                                    <PerformanceLineChart type="nordic" />
                                  </div>

                                  <div className="space-y-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-[#e7e5e4] p-4 text-[11px] leading-relaxed text-[#57534e]">
                                      <div className="space-y-2">
                                        <h4 className="font-bold text-[#1c1917] font-sans">Why This Performance Matrix Matters:</h4>
                                        <p className="font-light">
                                          <strong>Capital-market deepening:</strong> A listed serial acquirer effectively securitizes the SME sector, giving pension funds and retail investors an asset-allocation tool that previously did not exist.
                                        </p>
                                      </div>
                                      <div className="space-y-2">
                                        <h4 className="font-bold text-[#1c1917] font-sans">Corporate Resilience Matrix:</h4>
                                        <p className="font-light">
                                          <strong>Supply-chain stability:</strong> The holding company can cross-subsidize working capital or volume commitments during downturns, smoothing shocks to upstream industries. Single-company failure is &lt;1% of group EBIT.
                                        </p>
                                      </div>
                                    </div>
                                    <SMEDonutChart />
                                  </div>
                                </div>
                              </div>

                              {/* Simple aesthetic grid representing focus countries & assets */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 border border-[#e7e5e4] bg-[#ffffff] divide-y sm:divide-y-0 sm:divide-x divide-[#e7e5e4]">
                                <div className="p-6">
                                  <span className="font-mono text-[9px] text-[#78716c] block mb-2">01 / GEOGRAPHY</span>
                                  <h3 className="font-sans font-bold text-sm tracking-tight mb-2">Nordic Cluster</h3>
                                  <p className="text-xs text-[#57534e] font-light leading-relaxed">Highly disciplined decentralized serial acquirers focusing on traditional software & industrial niches.</p>
                                </div>
                                <div className="p-6">
                                  <span className="font-mono text-[9px] text-[#78716c] block mb-2">02 / GEOGRAPHY</span>
                                  <h3 className="font-sans font-bold text-sm tracking-tight mb-2">Japanese Shinise</h3>
                                  <p className="text-xs text-[#57534e] font-light leading-relaxed">Generational, highly cash-flow generative family SMEs undergoing smooth transition ownership support.</p>
                                </div>
                                <div className="p-6">
                                  <span className="font-mono text-[9px] text-[#78716c] block mb-2">03 / GEOGRAPHY</span>
                                  <h3 className="font-sans font-bold text-sm tracking-tight mb-2">North America</h3>
                                  <p className="text-xs text-[#57534e] font-light leading-relaxed">Disruptive local Roll-ups with capital deployment frameworks designed for multi-decade compounding.</p>
                                </div>
                              </div>

                              {/* Serial Acquirer Edge Comparative Table directly shown on RWI */}
                              <div className="border border-[#e7e5e4] p-6 bg-white space-y-4">
                                <div>
                                  <span className="font-mono text-[9px] text-emerald-700 bg-emerald-50 px-2 py-0.5 uppercase tracking-wider font-semibold">
                                    Acquisition Framework Differences
                                  </span>
                                  <h3 className="font-serif text-lg font-light text-[#1c1917] mt-1.5 h-auto">
                                    Serial Acquirers vs. Traditional Private Equity
                                  </h3>
                                </div>
                                <SerialAcquirersEdgeComparison />
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* SUBVIEW 2: SOLO */}
                      {itoSubView === "solo" && (
                        <motion.div
                          key="ito-solo-pane"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-12"
                        >
                          {!isItoUnlocked ? (
                            <div className="max-w-md mx-auto py-16 px-8 bg-white border border-[#e7e5e4] text-center my-8 shadow-sm">
                              <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-6">
                                <Lock size={18} className="text-[#78716c]" />
                              </div>
                              <h2 className="font-serif text-lg font-normal mb-2 text-[#1c1917]">
                                Stealth WIP Access
                              </h2>
                              <p className="text-xs text-[#78716c] leading-relaxed mb-6 font-mono">
                                This zone contains work-in-progress programmatic structures and is restricted to authorized partners. Please supply the stealth access key.
                              </p>
                              <form onSubmit={handleItoPasswordSubmit} className="space-y-4">
                                <div className="relative">
                                  <input
                                    ref={itoPasswordInputRef}
                                    type={showItoPassword ? "text" : "password"}
                                    value={itoPassword}
                                    onChange={(e) => {
                                      setItoPassword(e.target.value);
                                      setItoPasswordError(false);
                                    }}
                                    placeholder="Enter Access Key"
                                    className={`w-full px-4 py-2.5 text-xs text-center border transition-all focus:outline-none focus:ring-1 font-mono ${
                                      itoPasswordError 
                                        ? "border-red-500 ring-1 ring-red-500/20 bg-red-50/20" 
                                        : "border-[#d6d3d1] focus:border-[#1c1917] focus:ring-[#1c1917]/20 bg-stone-50"
                                    }`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowItoPassword(!showItoPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a8a29e] hover:text-[#1c1917]"
                                  >
                                    {showItoPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                  </button>
                                </div>
                                {itoPasswordError && (
                                  <p className="text-[10px] text-red-600 font-mono text-center">
                                    Incorrect clean key. Please verify or try again.
                                  </p>
                                )}
                                <button
                                  type="submit"
                                  className="w-full py-2.5 bg-[#1c1917] hover:bg-stone-800 text-[#fafaf9] text-xs uppercase tracking-widest font-bold font-mono transition-colors cursor-pointer"
                                >
                                  Unlock Stealth WIP
                                </button>
                              </form>
                              <p className="text-[9px] text-[#a8a29e] mt-6 font-mono">
                                HINT FOR REVIEW: itoisreal
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-12">
                              {/* Decryption identifier and page lock action */}
                              <div className="flex justify-between items-center border-b border-[#e7e5e4]/60 pb-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => navigateTo("ito", "stealth")}
                                    className="text-[9px] uppercase font-mono tracking-wider bg-stone-100 hover:bg-stone-200 px-2.5 py-1 border border-stone-200 cursor-pointer transition-colors text-[#57534e]"
                                  >
                                    ← Stealth Room
                                  </button>
                                  <span className="text-[9px] font-mono tracking-widest uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 font-semibold">
                                    Threads Solo Decrypted • Authorized Access
                                  </span>
                                </div>
                                <button
                                  onClick={handleItoLockStatus}
                                  className="text-[9px] uppercase font-mono tracking-wider bg-stone-100 hover:bg-stone-200 px-2.5 py-1.5 cursor-pointer transition-colors text-[#57534e]"
                                >
                                  Lock page
                                </button>
                              </div>

                              {/* Rich Layout of the Article Content */}
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                                <div className="md:col-span-8 space-y-8">
                                  <h1 className="font-serif text-3xl md:text-4xl font-light text-[#1c1917] leading-tight">
                                    Threads Solo
                                  </h1>
                                  <p className="text-base md:text-lg text-[#292524] font-medium leading-relaxed font-serif border-l-2 border-[#1c1917] pl-4 italic">
                                    Threads Solo is raising 20 million euros to incubate and invest in 5 serial acquirers (SAs). Don't flip them. Compound them.
                                  </p>
                                  <p className="text-sm md:text-base text-[#292524] font-light leading-relaxed">
                                    I find family-owned SMEs with stable cash flow and a founder who wants to keep going. I join the board. Help them evolve into a serial acquisition engine. Same DNA. Just a new capital allocation muscle.
                                  </p>
                                  <p className="text-sm md:text-base text-[#292524] font-light leading-relaxed">
                                    I'm{" "}
                                    <a 
                                      href="https://linkedin.com/in/consciousfuturist" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="underline underline-offset-4 decoration-1 font-semibold hover:text-[#1c1917] transition-all cursor-pointer"
                                    >
                                      solo
                                    </a>
                                    . Lean. AI-assisted diligence.
                                  </p>
                                  <p className="text-sm md:text-base text-[#292524] font-light leading-relaxed">
                                    The numbers in this space are 20-30% annualized over long periods (in public markets). Low correlation to VC. Daily liquidity.
                                  </p>
                                  <div className="p-5 bg-stone-100 border border-stone-200 text-stone-800 text-xs sm:text-sm font-mono tracking-wide">
                                    Not VC. Not PE.
                                  </div>
                                </div>

                                {/* Right Sidebar - Critical reading materials */}
                                <div className="md:col-span-4 bg-[#ffffff] p-6 border border-[#e7e5e4] space-y-6 flex flex-col justify-between">
                                  <div>
                                    <span className="font-mono text-[10px] text-[#78716c] uppercase tracking-wider block mb-4 border-b border-stone-100 pb-2">
                                      Intellectual Foundation
                                    </span>
                                    <p className="text-xs text-[#57534e] leading-relaxed mb-4">
                                      To understand the underlying philosophy, mechanics, and transition thesis backing this venture, explore our detailed publications:
                                    </p>
                                    <div className="space-y-3 pt-2">
                                      <a 
                                        href="https://firstfollowers.substack.com/p/serial-acquirer"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-start gap-2 text-xs font-mono text-[#1c1917] hover:underline cursor-pointer"
                                      >
                                        <span className="text-stone-400">→</span>
                                        <span className="font-semibold text-wrap text-left break-all">Serial Acquirer Thesis</span>
                                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                      </a>
                                      <a 
                                        href="https://firstfollowers.substack.com/p/the-succession-opportunity"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-start gap-2 text-xs font-mono text-[#1c1917] hover:underline lg:pt-2 cursor-pointer"
                                      >
                                        <span className="text-stone-400">→</span>
                                        <span className="font-semibold text-wrap text-left break-all">Succession opportunity</span>
                                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                      </a>
                                      <a 
                                        href="https://firstfollowers.substack.com/p/the-case-for-micro-acquisition-funds"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-start gap-2 text-xs font-mono text-[#1c1917] hover:underline lg:pt-2 cursor-pointer"
                                      >
                                        <span className="text-stone-400">→</span>
                                        <span className="font-semibold text-wrap text-left break-all">Micro-acquisition funds</span>
                                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                      </a>
                                    </div>
                                  </div>
                                  <div className="pt-6 border-t border-stone-100 mt-6 md:mt-0">
                                    <p className="text-[10.5px] font-mono leading-relaxed text-[#78716c]">
                                      Serial Acquirers are permanent holding companies that use serial acquisition as a lever to compound.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* SUBVIEW 3: SCREENER APPS */}
                      {itoSubView === "screener" && (
                        <motion.div
                          key="ito-screener-pane"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-12"
                        >
                          <div className="border-b border-[#e7e5e4] pb-6">
                            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#78716c] block mb-1">Analytical Engines</span>
                            <h2 className="font-serif text-3xl font-light text-[#1c1917]">
                              Screener Apps
                            </h2>
                            <p className="text-sm text-[#78716c] mt-2 font-mono">
                              Sovereign programmatic tools configured to track, filter, and analyze compounds and serial acquirers.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Real World Index */}
                            <div className="border border-[#e7e5e4] bg-white hover:border-[#1c1917] p-8 flex flex-col justify-between transition-all group shadow-sm rounded-sm">
                              <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                  <span className="text-[9px] font-mono tracking-wider uppercase text-stone-500 bg-stone-50 px-2.5 py-1">
                                    Screener / Tracker
                                  </span>
                                  <ArrowUpRight size={16} className="text-stone-400 group-hover:text-[#1c1917] transition-colors" />
                                </div>
                                <h3 className="font-serif text-xl font-normal text-[#1c1917] transition-all group-hover:line-through decoration-1">
                                  Real World Index
                                </h3>
                                <p className="text-xs text-[#57534e]/90 font-mono leading-relaxed">
                                  Benchmark and Serial Acquirer Index Tracker. A specialized interface visualizing asset compounders and structural efficiency metrics.
                                </p>
                              </div>
                              <div className="pt-8">
                                <a
                                  href="https://real-world-zslo.onrender.com/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider text-[#fafaf9] bg-[#1c1917] hover:bg-stone-800 px-4 py-2 hover:underline transition-all cursor-pointer"
                                >
                                  Launch Screener
                                </a>
                              </div>
                            </div>

                            {/* Threads Research */}
                            <div className="border border-[#e7e5e4] bg-white hover:border-[#1c1917] p-8 flex flex-col justify-between transition-all group shadow-sm rounded-sm">
                              <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                  <span className="text-[9px] font-mono tracking-wider uppercase text-stone-500 bg-stone-50 px-2.5 py-1">
                                    Intelligence Database
                                  </span>
                                  <ArrowUpRight size={16} className="text-stone-400 group-hover:text-[#1c1917] transition-colors" />
                                </div>
                                <h3 className="font-serif text-xl font-normal text-[#1c1917] transition-all group-hover:line-through decoration-1">
                                  Threads Research
                                </h3>
                                <p className="text-xs text-[#57534e]/90 font-mono leading-relaxed">
                                  Comprehensive screener app for private and public markets of middle-power countries.
                                </p>
                              </div>
                              <div className="pt-8">
                                <a
                                  href="https://threads-research.onrender.com/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider text-[#fafaf9] bg-[#1c1917] hover:bg-stone-800 px-4 py-2 hover:underline transition-all cursor-pointer"
                                >
                                  Query Research
                                </a>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* 4. WRITINGS VIEW */}
          {view === "writings" && (
            <motion.div
              key="writings-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="max-w-5xl mx-auto space-y-6"
            >
              <div className={`border-b pb-4 ${isDarkMode ? "border-[#27272a]" : "border-[#e7e5e4]"}`}>
                <span className={`text-[10px] font-mono uppercase tracking-[0.25em] block mb-1 ${
                  isDarkMode ? "text-[#a1a1aa]" : "text-[#78716c]"
                }`}>
                  Publications
                </span>
                <h1 className={`font-serif text-2xl font-light ${isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"}`}>
                  Subscribe to our writings
                </h1>
              </div>

              {/* Newsletter Substack Listing in absolute elegant vertical stack */}
              <div className={`divide-y border-t border-b ${
                isDarkMode ? "divide-[#27272a] border-[#27272a]" : "divide-[#e7e5e4]/60 border-[#e7e5e4]/60"
              }`}>
                {publications.map((pub) => (
                  <div
                    key={pub.id}
                    onClick={() => setSelectedSubstackModal(pub)}
                    className={`py-4 md:py-5 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-center group cursor-pointer transition-colors px-2 -mx-2 rounded-sm ${
                      isDarkMode ? "hover:bg-[#1c1917]/80 text-[#fafaf9]" : "hover:bg-[#f5f5f4]/60 text-[#1c1917]"
                    }`}
                  >
                    <div className="md:col-span-5 space-y-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSubstackModal(pub);
                        }}
                        className={`inline-flex items-center gap-1.5 text-left text-base font-bold tracking-tight group-hover:underline ${
                          isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"
                        }`}
                      >
                        {pub.listTitle}
                      </button>
                      <div className={`text-[10px] font-mono ${isDarkMode ? "text-[#a1a1aa]" : "text-[#78716c]"}`}>
                        {pub.subdomain}
                      </div>
                    </div>
                    <div className="md:col-span-7 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <p className={`text-xs md:text-sm font-light leading-relaxed flex-1 ${
                        isDarkMode ? "text-[#d4d4d8]" : "text-[#57534e]"
                      }`}>
                        {pub.description}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSubstackModal(pub);
                        }}
                        className={`shrink-0 text-[10px] font-mono font-semibold uppercase tracking-wider px-3.5 py-1.5 border transition-all flex items-center gap-1.5 rounded-sm ${
                          isDarkMode 
                            ? "border-[#3f3f46] bg-[#27272a] text-[#fafaf9] group-hover:bg-[#fafaf9] group-hover:text-[#0c0a09]" 
                            : "border-[#d6d3d1] hover:border-[#1c1917] bg-white text-[#1c1917] group-hover:bg-[#1c1917] group-hover:text-[#fafaf9]"
                        }`}
                      >
                        <span>Explore</span>
                        <ArrowUpRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 5. ABOUT VIEW */}
          {view === "about" && (
            <motion.div
              key="about-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="max-w-3xl mx-auto space-y-6 text-center py-2 md:py-4"
            >
              {/* Manifesto Section */}
              <div className={`border p-6 sm:p-8 text-left space-y-4 rounded-sm shadow-xs backdrop-blur-xs transition-colors ${
                isDarkMode 
                  ? "bg-[#1c1917]/90 border-[#27272a] text-[#fafaf9]" 
                  : "bg-white/90 border-[#e7e5e4] text-[#1c1917]"
              }`}>
                <span className={`text-[10px] font-mono uppercase tracking-[0.25em] block border-b pb-2 font-semibold ${
                  isDarkMode ? "text-[#a1a1aa] border-[#27272a]" : "text-[#78716c] border-[#e7e5e4]"
                }`}>
                  Manifesto
                </span>
                <p className={`font-serif text-sm sm:text-base leading-relaxed font-normal ${
                  isDarkMode ? "text-[#e4e4e7]" : "text-[#292524]"
                }`}>
                  Threads is inspired by the belief that love, like impact, compounds over time. The threads we weave today become the fabric of tomorrow.
                </p>
                <p className={`font-serif text-sm sm:text-base leading-relaxed font-normal ${
                  isDarkMode ? "text-[#e4e4e7]" : "text-[#292524]"
                }`}>
                  Threads invests in <strong className={`font-semibold ${isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"}`}>compounders, builders, and engineers</strong> who <strong className={`font-semibold ${isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"}`}>create tangible, real-world value—compounding both financial returns and societal impact for the long term</strong>.
                </p>
                <p className={`font-serif text-sm sm:text-base leading-relaxed font-normal ${
                  isDarkMode ? "text-[#e4e4e7]" : "text-[#292524]"
                }`}>
                  Threads' focus is on regions where trust, communal harmony, and shared prosperity are deeply embedded in the culture; where <strong className={`font-semibold ${isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"}`}>engineers and makers are celebrated more than financial engineering or short-term speculation.</strong>
                </p>
                <p className={`font-serif text-sm sm:text-base leading-relaxed font-normal ${
                  isDarkMode ? "text-[#e4e4e7]" : "text-[#292524]"
                }`}>
                  These regions—the <strong className={`font-semibold ${isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"}`}>Nordics, Canada, and East Asia (China, Japan, Taiwan, South Korea)</strong>—are home to societies that prioritize long-term stewardship over quarterly results, and where the real economy of manufacturing, infrastructure, and technology innovation remains the bedrock of prosperity.
                </p>
                <p className={`font-serif text-sm sm:text-base leading-relaxed font-normal ${
                  isDarkMode ? "text-[#e4e4e7]" : "text-[#292524]"
                }`}>
                  Threads is <strong className={`font-semibold ${isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"}`}>deliberately contrarian</strong>: favour long-term compounding over quarterly earnings, <strong className={`font-semibold ${isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"}`}>anti-consensus style</strong>, and <strong className={`font-semibold ${isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"}`}>anti-consensus geography</strong> (under-owned markets outside the US over concentrated domestic indices).
                </p>
              </div>

              {/* Core holding company thesis as requested */}
              <div className="max-w-xl mx-auto text-center space-y-4">
                <div className={`font-serif leading-relaxed text-xs sm:text-sm space-y-4 text-center ${
                  isDarkMode ? "text-[#d4d4d8]" : "text-[#44403c]"
                }`}>
                  <p>
                    Threads is building a compounding engine that generates returns &amp; impact for the next 100 years. Threads will exist as an evergreen holding company, passed on to generations.
                  </p>
                  <p>
                    Threads ties together diverse investments into a cohesive whole. Threads are strong yet flexible—ideal for a long-term, adaptive capital allocator.
                  </p>
                  <p>
                    The name Threads is inspired by <a href="https://www.youtube.com/watch?v=5MWh0vT4vcQ&amp;list=RD5MWh0vT4vcQ&amp;start_radio=1" target="_blank" rel="noopener noreferrer" className={`underline transition-all ${
                      isDarkMode ? "decoration-stone-600 hover:text-[#fafaf9]" : "decoration-stone-300 hover:text-[#1c1917]"
                    }`}>"Ito (thread)"</a>, a song written by Japanese singer-songwriter Miyuki Nakajima.
                  </p>
                  <p className={`italic font-medium ${isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"}`}>
                    "Threads is uniting one thread at a time."
                  </p>
                </div>
              </div>

              <div className={`w-12 h-px mx-auto my-4 ${isDarkMode ? "bg-[#27272a]" : "bg-[#e7e5e4]"}`}></div>

              <div className="space-y-3">
                <span className={`text-[10px] font-mono uppercase tracking-[0.25em] block ${
                  isDarkMode ? "text-[#a1a1aa]" : "text-[#78716c]"
                }`}>
                  Enquiry &amp; Contact
                </span>
                
                <div className="pt-1 flex flex-col items-center">
                  <button 
                    type="button"
                    onClick={() => setIsContactModalOpen(true)}
                    className={`inline-flex items-center gap-2.5 font-mono text-xs sm:text-sm font-semibold transition-all cursor-pointer group border px-5 py-2.5 rounded-sm shadow-xs ${
                      isDarkMode 
                        ? "border-[#fafaf9] bg-[#1c1917] text-[#fafaf9] hover:bg-[#fafaf9] hover:text-[#0c0a09]" 
                        : "border-[#1c1917] bg-white text-[#1c1917] hover:bg-[#1c1917] hover:text-[#fafaf9]"
                    }`}
                  >
                    <Mail size={16} className={`transition-colors ${
                      isDarkMode ? "text-[#fafaf9] group-hover:text-[#0c0a09]" : "text-[#1c1917] group-hover:text-[#fafaf9]"
                    }`} />
                    <span>s@threadsunite.xyz</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 6. WHITEPAPER VIEW */}
          {view === "whitepaper" && (
            <motion.div
              key="whitepaper-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="max-w-6xl mx-auto"
            >
              <WhitepaperView isDarkMode={isDarkMode} />
            </motion.div>
          )}

          {/* 7. REAL WORLD INDEX VIEW */}
          {view === "realworld" && (
            <motion.div
              key="realworld-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="-mx-6 -my-4 md:-my-5"
            >
              <RealWorldApp onBackToThreads={() => navigateTo("home")} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Modern, simplified footer */}
      <footer className={`border-t py-3 shrink-0 transition-colors duration-300 ${
        isDarkMode ? "border-[#27272a] bg-[#0c0a09] text-[#a1a1aa]" : "border-[#e7e5e4] bg-[#fafaf9] text-[#78716c]"
      }`}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-mono uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className={`font-bold ${isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"}`}>© 2026 THREADS</span>
            <span className={isDarkMode ? "text-[#3f3f46]" : "text-[#d6d3d1]"}>•</span>
            <span>Evergreen Compounding</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-[9px] tracking-wider normal-case hidden md:inline ${isDarkMode ? "text-[#71717a]" : "text-[#a8a29e]"}`}>
              Connecting threads, building compounding impact.
            </span>
            <div className="flex gap-1">
              <div className={`w-1.5 h-1.5 ${isDarkMode ? "bg-[#fafaf9]" : "bg-[#1c1917]"}`}></div>
              <div className={`w-1.5 h-1.5 border ${isDarkMode ? "border-[#fafaf9]" : "border-[#1c1917]"}`}></div>
              <div className={`w-1.5 h-1.5 border ${isDarkMode ? "border-[#fafaf9]/30" : "border-[#1c1917]/20"}`}></div>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Advisory Pop-up Modal for Sagar Tandon */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div 
            className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsContactModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className={`border shadow-2xl max-w-md w-full p-6 sm:p-7 relative rounded-sm ${
                isDarkMode ? "bg-[#1c1917] border-[#27272a] text-[#fafaf9]" : "bg-white border-[#e7e5e4] text-[#1c1917]"
              }`}
            >
              {/* Top header row */}
              <div className="flex justify-between items-start gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <Mail size={16} className={isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"} />
                  <span className={`text-[11px] font-mono tracking-[0.2em] uppercase font-bold ${
                    isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"
                  }`}>
                    CONTACT
                  </span>
                </div>
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className={`p-1 transition-colors shrink-0 cursor-pointer ${
                    isDarkMode ? "text-[#a1a1aa] hover:text-[#fafaf9]" : "text-[#78716c] hover:text-[#1c1917]"
                  }`}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Divider */}
              <div className={`border-b my-3 ${isDarkMode ? "border-[#27272a]" : "border-[#e7e5e4]"}`}></div>

              {/* Direct Email Box */}
              <div className={`border p-3.5 mb-4 rounded-sm flex items-center justify-between gap-3 ${
                isDarkMode ? "bg-[#27272a]/60 border-[#3f3f46]" : "bg-[#fafaf9] border-[#e7e5e4]"
              }`}>
                <div className="space-y-0.5 min-w-0">
                  <span className={`text-[9px] font-mono tracking-widest uppercase block font-semibold ${
                    isDarkMode ? "text-[#a1a1aa]" : "text-[#78716c]"
                  }`}>
                    DIRECT EMAIL
                  </span>
                  <div className={`font-mono text-xs sm:text-sm font-bold truncate ${
                    isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"
                  }`}>
                    s@threadsunite.xyz
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className={`shrink-0 font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 border transition-colors flex items-center gap-1.5 rounded-sm cursor-pointer ${
                    isDarkMode 
                      ? "border-[#fafaf9] bg-[#1c1917] text-[#fafaf9] hover:bg-[#fafaf9] hover:text-[#0c0a09]" 
                      : "border-[#1c1917] bg-white text-[#1c1917] hover:bg-[#1c1917] hover:text-white"
                  }`}
                >
                  {copiedEmail ? (
                    <>
                      <Check size={12} className="stroke-[3]" />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className={`text-[10px] font-mono font-bold tracking-widest uppercase block ${
                    isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"
                  }`}>
                    SUBJECT
                  </label>
                  <input
                    type="text"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="e.g., General Inquiry / Impact Investing"
                    className={`w-full border text-xs font-mono p-2.5 rounded-sm transition-colors focus:outline-none ${
                      isDarkMode 
                        ? "bg-[#27272a] border-[#3f3f46] text-[#fafaf9] placeholder:text-[#71717a] focus:border-[#fafaf9]" 
                        : "bg-white border-[#d6d3d1] text-[#1c1917] placeholder:text-[#a8a29e] focus:border-[#1c1917]"
                    }`}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className={`text-[10px] font-mono font-bold tracking-widest uppercase block ${
                    isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"
                  }`}>
                    MESSAGE
                  </label>
                  <textarea
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Write your note or collaboration proposal..."
                    className={`w-full border text-xs font-serif p-2.5 rounded-sm transition-colors resize-none leading-relaxed focus:outline-none ${
                      isDarkMode 
                        ? "bg-[#27272a] border-[#3f3f46] text-[#fafaf9] placeholder:text-[#71717a] focus:border-[#fafaf9]" 
                        : "bg-white border-[#d6d3d1] text-[#1c1917] placeholder:text-[#a8a29e] focus:border-[#1c1917]"
                    }`}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className={`flex-1 font-mono text-xs font-bold uppercase tracking-wider py-3 px-4 flex items-center justify-center gap-2 border transition-all text-center rounded-sm cursor-pointer ${
                      isDarkMode 
                        ? "bg-[#fafaf9] hover:bg-stone-200 text-[#0c0a09] border-[#fafaf9]" 
                        : "bg-[#1c1917] hover:bg-[#292524] text-[#fafaf9] border-[#1c1917]"
                    }`}
                  >
                    <Send size={13} />
                    <span>SEND EMAIL</span>
                  </button>

                  <a
                    href="mailto:s@threadsunite.xyz"
                    className={`font-mono text-xs font-semibold uppercase tracking-wider py-3 px-4 border transition-all flex items-center justify-center gap-1.5 rounded-sm ${
                      isDarkMode 
                        ? "bg-[#27272a] hover:bg-[#3f3f46] text-[#fafaf9] border-[#3f3f46]" 
                        : "bg-white hover:bg-[#fafaf9] text-[#1c1917] border-[#d6d3d1] hover:border-[#1c1917]"
                    }`}
                  >
                    <span>Mail App</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Substack Publication Popup Modal */}
      <AnimatePresence>
        {selectedSubstackModal && (
          <div 
            className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedSubstackModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className={`border shadow-2xl max-w-lg w-full p-6 sm:p-8 relative rounded-sm ${
                isDarkMode ? "bg-[#1c1917] border-[#27272a] text-[#fafaf9]" : "bg-white border-[#e7e5e4] text-[#1c1917]"
              }`}
            >
              {/* Top header row */}
              <div className="flex justify-between items-start gap-4 mb-2">
                <div>
                  <span className={`text-[10px] font-mono tracking-[0.25em] uppercase block mb-1 ${
                    isDarkMode ? "text-[#a1a1aa]" : "text-[#78716c]"
                  }`}>
                    SUBSTACK PUBLICATION
                  </span>
                  <h2 className={`font-serif text-xl sm:text-2xl font-light leading-tight ${
                    isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"
                  }`}>
                    {selectedSubstackModal.modalTitle}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedSubstackModal(null)}
                  className={`p-1 transition-colors shrink-0 cursor-pointer ${
                    isDarkMode ? "text-[#a1a1aa] hover:text-[#fafaf9]" : "text-[#78716c] hover:text-[#1c1917]"
                  }`}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Divider */}
              <div className={`border-b my-3.5 ${isDarkMode ? "border-[#27272a]" : "border-[#e7e5e4]"}`}></div>

              {/* Category box */}
              <div className={`border px-3.5 py-1.5 text-[10px] font-mono font-semibold tracking-wider uppercase mb-4 inline-block rounded-sm ${
                isDarkMode ? "bg-[#27272a] border-[#3f3f46] text-[#e4e4e7]" : "bg-[#fafaf9] border-[#e7e5e4] text-[#57534e]"
              }`}>
                {selectedSubstackModal.category}
              </div>

              {/* Description */}
              <p className={`text-xs sm:text-sm font-serif leading-relaxed mb-6 ${
                isDarkMode ? "text-[#d4d4d8]" : "text-[#44403c]"
              }`}>
                {selectedSubstackModal.description}
              </p>

              {/* Key Themes & Focus Areas */}
              <div className="space-y-3 mb-7">
                <div className={`text-[10px] font-mono font-semibold tracking-[0.2em] uppercase flex items-center gap-1.5 ${
                  isDarkMode ? "text-[#a1a1aa]" : "text-[#78716c]"
                }`}>
                  <Bookmark size={12} className={isDarkMode ? "text-[#a1a1aa]" : "text-[#78716c]"} />
                  <span>KEY THEMES &amp; FOCUS AREAS</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedSubstackModal.themes.map((theme, i) => (
                    <div
                      key={i}
                      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-mono rounded-sm ${
                        isDarkMode 
                          ? "border-[#3f3f46] bg-[#27272a] text-[#e4e4e7]" 
                          : "border-[#e7e5e4] bg-[#fafaf9] text-[#44403c]"
                      }`}
                    >
                      <Check size={11} className={`stroke-[2.5] ${isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"}`} />
                      <span>{theme}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Read & Subscribe Button */}
              <a
                href={selectedSubstackModal.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full font-mono text-xs font-semibold uppercase tracking-wider py-3 px-5 flex items-center justify-center gap-2 border transition-all text-center rounded-sm ${
                  isDarkMode 
                    ? "bg-[#fafaf9] hover:bg-stone-200 text-[#0c0a09] border-[#fafaf9]" 
                    : "bg-[#1c1917] hover:bg-[#292524] text-[#fafaf9] border-[#1c1917]"
                }`}
              >
                <span>READ &amp; SUBSCRIBE ON SUBSTACK</span>
                <ArrowUpRight size={14} />
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
