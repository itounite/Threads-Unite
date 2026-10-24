import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Copy, Check, Sun, Moon } from "lucide-react";
import { NordicBackground } from "../components/NordicBackground";

export function ThreadsLogo({ className = "w-8 h-8" }: { className?: string }) {
  // Generates 115 deterministic intersecting straight lines for a hand-drawn scribble texture
  const lines = [];
  const cx = 50;
  const cy = 50;
  const radius = 38;
  const seed = 54321;
  let currentSeed = seed;
  const random = () => {
    const x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 0; i < 115; i++) {
    const angle1 = random() * Math.PI * 2;
    const angle2 = angle1 + Math.PI + (random() - 0.5) * (Math.PI * 0.9);
    
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

interface TradarAppProps {
  onBackToThreads?: () => void;
  initialSubView?: 'home' | 'about';
  isDarkMode?: boolean;
  setIsDarkMode?: (val: boolean) => void;
}

export function TradarApp({ 
  onBackToThreads, 
  initialSubView = 'home',
  isDarkMode: propDarkMode,
  setIsDarkMode: propSetIsDarkMode
}: TradarAppProps) {
  const [view, setView] = useState<"home" | "about">(initialSubView);

  const navigateTo = (newView: "home" | "about") => {
    setView(newView);
    const p = newView === "home" ? "/tradar.fi" : `/tradar.fi/about`;
    window.history.pushState(null, "", p);
  };

  useEffect(() => {
    const handleLocale = () => {
      const p = window.location.pathname;
      const h = window.location.hash;
      
      if (p.endsWith("/about") || p === "/tradar.fi/about" || p === "/tradar/about" || h === "#about" || h === "#tradar.fi/about") {
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

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (view === "home") {
      document.title = "TRÅDAR | Incubated by THREADS";
    } else if (view === "about") {
      document.title = "About TRÅDAR | Incubated by THREADS";
    }
  }, [view]);

  const [internalDarkMode, setInternalDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("threads_theme") === "dark";
  });

  const isDarkMode = propDarkMode !== undefined ? propDarkMode : internalDarkMode;
  const toggleDarkMode = () => {
    if (propSetIsDarkMode) {
      propSetIsDarkMode(!isDarkMode);
    } else {
      setInternalDarkMode(!internalDarkMode);
    }
  };

  useEffect(() => {
    localStorage.setItem("threads_theme", isDarkMode ? "dark" : "light");
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const [copiedOskarEmail, setCopiedOskarEmail] = useState(false);
  const [copiedSagarEmail, setCopiedSagarEmail] = useState(false);

  const handleCopyOskarEmail = () => {
    navigator.clipboard.writeText("oh@tradar.fi");
    setCopiedOskarEmail(true);
    setTimeout(() => setCopiedOskarEmail(false), 2000);
  };

  const handleCopySagarEmail = () => {
    navigator.clipboard.writeText("s@threadsunite.xyz");
    setCopiedSagarEmail(true);
    setTimeout(() => setCopiedSagarEmail(false), 2000);
  };

  // Harmonized active blue used consistently everywhere (Nordics, Baltics & Beyond blue)
  const boatBlueText = isDarkMode ? "text-[#38bdf8]" : "text-[#1d4ed8]";
  const boatBlueBorder = isDarkMode ? "border-[#38bdf8]" : "border-[#1d4ed8]";

  return (
    <div className={`relative h-[100dvh] overflow-hidden font-sans flex flex-col justify-between transition-colors duration-300 ${
      isDarkMode 
        ? "bg-[#0c0a09] text-[#fafaf9] selection:bg-[#fafaf9] selection:text-[#0c0a09]" 
        : "bg-[#fafaf9] text-[#1c1917] selection:bg-[#1c1917] selection:text-[#fafaf9]"
    }`}>
      
      {/* Background Line Art Sketch */}
      <NordicBackground isDarkMode={isDarkMode} />

      {/* Editorial Header */}
      <header className={`border-b sticky top-0 backdrop-blur-md z-50 shrink-0 transition-colors duration-300 ${
        isDarkMode ? "border-[#27272a] bg-[#0c0a09]/90 text-[#fafaf9]" : "border-[#e7e5e4] bg-[#fafaf9]/90 text-[#1c1917]"
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo Brand: TRÅDAR (incubated by THREADS) */}
          <button 
            onClick={() => navigateTo("home")}
            className="flex items-center gap-2.5 group select-none text-left cursor-pointer shrink-0"
          >
            {/* Logo in identical boat blue as Nordics, Baltics & Beyond */}
            <ThreadsLogo className={`w-7 h-7 shrink-0 transition-colors ${boatBlueText}`} />
            <span className="flex flex-col leading-none">
              <span className={`text-sm sm:text-[15px] font-space font-extrabold tracking-tight uppercase group-hover:opacity-85 transition-colors ${boatBlueText}`}>
                TRÅDAR
              </span>
              <span className={`text-[6.5px] font-sans font-semibold tracking-wider uppercase mt-0.5 transition-colors ${
                isDarkMode ? "text-[#fafaf9]/80" : "text-[#1c1917]/80"
              }`}>
                incubated by THREADS
              </span>
            </span>
          </button>

          {/* Navigation Links & Mode Toggle */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <nav className={`flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-widest font-semibold ${
              isDarkMode ? "text-[#a1a1aa]" : "text-[#57534e]"
            }`}>
              <button 
                onClick={() => navigateTo("home")}
                className={`pb-0.5 border-b cursor-pointer transition-all ${
                  view === "home" 
                    ? `${boatBlueText} ${boatBlueBorder} font-bold` 
                    : isDarkMode ? "border-transparent hover:text-[#38bdf8]" : "border-transparent hover:text-[#1d4ed8]"
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => navigateTo("about")}
                className={`pb-0.5 border-b cursor-pointer transition-all ${
                  view === "about" 
                    ? `${boatBlueText} ${boatBlueBorder} font-bold` 
                    : isDarkMode ? "border-transparent hover:text-[#38bdf8]" : "border-transparent hover:text-[#1d4ed8]"
                }`}
              >
                About
              </button>
              {onBackToThreads && (
                <button
                  onClick={onBackToThreads}
                  className={`pb-0.5 border-b border-transparent transition-all cursor-pointer ${
                    isDarkMode ? "text-stone-400 hover:text-stone-200" : "text-stone-500 hover:text-stone-900"
                  }`}
                  title="Return to THREADS"
                >
                  ← THREADS
                </button>
              )}
            </nav>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-6 md:py-8 overflow-y-auto min-h-0 relative z-10">
        <AnimatePresence mode="wait">
          
          {/* HOME VIEW */}
          {view === "home" && (
            <motion.div
              key="home-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="h-full flex flex-col justify-center items-center text-center max-w-4xl mx-auto py-4"
            >
              <div className={`w-12 h-px mb-6 ${isDarkMode ? "bg-[#3f3f46]" : "bg-[#d6d3d1]"}`}></div>
              
              <h1 className={`font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl font-light leading-snug tracking-tight max-w-2xl mx-auto ${
                isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"
              }`}>
                <span>TRÅDAR is a collector and curator of quality businesses in</span>{" "}
                <span className={`italic font-normal block sm:inline mt-1 sm:mt-0 ${
                  isDarkMode ? "text-[#38bdf8]" : "text-[#1d4ed8]"
                }`}>
                  Nordics, Baltics &amp; Beyond.
                </span>
              </h1>
              
              <div className={`w-12 h-px mt-6 mb-7 ${isDarkMode ? "bg-[#3f3f46]" : "bg-[#d6d3d1]"}`}></div>
              
              {/* Navigation Action Buttons */}
              <div className="flex flex-wrap gap-3.5 items-center justify-center">
                <button 
                  onClick={() => navigateTo("about")}
                  className={`text-[10px] uppercase tracking-widest font-bold px-4 py-2 cursor-pointer transition-all rounded-sm shadow-xs ${
                    isDarkMode 
                      ? "bg-[#fafaf9] text-[#0c0a09] hover:bg-stone-200" 
                      : "bg-[#1d4ed8] text-[#fafaf9] hover:bg-[#1e40af]"
                  }`}
                >
                  About TRÅDAR →
                </button>
                <a 
                  href="http://compounders.cc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-[10px] uppercase tracking-widest font-bold border px-3.5 py-2 transition-all rounded-sm inline-flex items-center gap-1.5 shadow-xs ${
                    isDarkMode 
                      ? "border-[#3f3f46] bg-[#1c1917]/80 hover:bg-[#1c1917] text-[#fafaf9]" 
                      : "border-[#d6d3d1] hover:border-[#1d4ed8] bg-white/90 hover:bg-white text-[#1d4ed8]"
                  }`}
                >
                  <span>Compounders</span>
                  <ArrowUpRight size={12} />
                </a>
                <a 
                  href="https://threadsunite.xyz/"
                  onClick={(e) => {
                    if (onBackToThreads) {
                      e.preventDefault();
                      onBackToThreads();
                    }
                  }}
                  className={`text-[10px] uppercase tracking-widest font-bold border px-3.5 py-2 transition-all rounded-sm inline-flex items-center gap-1.5 shadow-xs cursor-pointer ${
                    isDarkMode 
                      ? "border-[#3f3f46] bg-[#1c1917]/80 hover:bg-[#1c1917] text-[#fafaf9]" 
                      : "border-[#d6d3d1] hover:border-[#1d4ed8] bg-white/90 hover:bg-white text-[#1d4ed8]"
                  }`}
                >
                  <span>Threads Unite</span>
                  <ArrowUpRight size={12} />
                </a>
              </div>
            </motion.div>
          )}

          {/* ABOUT VIEW */}
          {view === "about" && (
            <motion.div
              key="about-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="max-w-2xl mx-auto space-y-6 py-2 md:py-5"
            >
              {/* Section 1: About */}
              <div className={`border p-5 sm:p-7 space-y-3.5 rounded-sm shadow-xs backdrop-blur-xs transition-colors text-left ${
                isDarkMode 
                  ? "bg-[#1c1917]/90 border-[#27272a] text-[#fafaf9]" 
                  : "bg-white border-[#1c1917] text-[#1c1917]"
              }`}>
                <h2 className={`text-[11px] font-mono uppercase tracking-[0.25em] block border-b pb-2 font-bold ${
                  isDarkMode ? "text-[#fafaf9] border-[#27272a]" : "text-[#1c1917] border-[#1c1917]"
                }`}>
                  About
                </h2>
                <p className={`font-serif text-sm sm:text-base leading-relaxed font-normal ${
                  isDarkMode ? "text-[#e4e4e7]" : "text-[#292524]"
                }`}>
                  <strong className={`font-semibold ${isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"}`}>
                    TRÅDAR incubated by THREADS
                  </strong>{" "}
                  is building a compounder from ground up by applying the principles of compounding that are based on the principles of integrity, trust, and being-human first. TRÅDAR is a buy, build, and invest platform, using the capital allocation platform playbook developed by THREADS.
                </p>
                <p className={`font-serif text-sm sm:text-base leading-relaxed font-normal ${
                  isDarkMode ? "text-[#e4e4e7]" : "text-[#292524]"
                }`}>
                  TRÅDAR buys small businesses to purposefully protect the legacy of the work of the business started by an entrepreneur and give it enough care to reach the right size scale by leveraging our technology know-how, international market expansion, and capital allocation platform playbook. We don't just buy, we buy with care, to keep it.
                </p>
              </div>

              {/* Section 2: Why name TRÅDAR? */}
              <div className={`border p-5 sm:p-7 space-y-3.5 rounded-sm shadow-xs backdrop-blur-xs transition-colors text-left ${
                isDarkMode 
                  ? "bg-[#1c1917]/90 border-[#27272a] text-[#fafaf9]" 
                  : "bg-white border-[#1c1917] text-[#1c1917]"
              }`}>
                <h2 className={`text-[11px] font-mono uppercase tracking-[0.25em] block border-b pb-2 font-bold ${
                  isDarkMode ? "text-[#fafaf9] border-[#27272a]" : "text-[#1c1917] border-[#1c1917]"
                }`}>
                  Why name TRÅDAR?
                </h2>
                <p className={`font-serif text-sm sm:text-base leading-relaxed font-normal ${
                  isDarkMode ? "text-[#e4e4e7]" : "text-[#292524]"
                }`}>
                  TRÅDAR is the Swedish word for threads. It is the silent architecture of existence, binding the physical, the digital, and the emotional.
                </p>
                <p className={`font-serif text-sm sm:text-base leading-relaxed font-normal ${
                  isDarkMode ? "text-[#e4e4e7]" : "text-[#292524]"
                }`}>
                  On its own, a single trådar is fragile and easily snapped. But woven together, trådar form the fabric that shields us, the tapestries that tell our history, and the clothes that carry our scent. It is the art of making something whole out of nothing but lines.
                </p>
                <p className={`font-serif text-sm sm:text-base leading-relaxed font-normal ${
                  isDarkMode ? "text-[#e4e4e7]" : "text-[#292524]"
                }`}>
                  That's exactly the purpose, we are weaving together single independent trådar into a woven fabric, so that the fabric can give warmth to the society and nature at large, one business at a time.
                </p>
              </div>

              {/* Section 3: Manifesto */}
              <div className={`border p-5 sm:p-7 space-y-3.5 rounded-sm shadow-xs backdrop-blur-xs transition-colors text-left ${
                isDarkMode 
                  ? "bg-[#1c1917]/90 border-[#27272a] text-[#fafaf9]" 
                  : "bg-white border-[#1c1917] text-[#1c1917]"
              }`}>
                <h2 className={`text-[11px] font-mono uppercase tracking-[0.25em] block border-b pb-2 font-bold ${
                  isDarkMode ? "text-[#fafaf9] border-[#27272a]" : "text-[#1c1917] border-[#1c1917]"
                }`}>
                  Manifesto
                </h2>
                <p className={`font-serif text-sm sm:text-base leading-relaxed font-normal ${
                  isDarkMode ? "text-[#e4e4e7]" : "text-[#292524]"
                }`}>
                  Values, as well as value compounds. Intrinsic value compounds together with intangible value. In the long term intangible value becomes tangible.
                </p>
                <p className={`font-serif text-sm sm:text-base leading-relaxed font-normal ${
                  isDarkMode ? "text-[#e4e4e7]" : "text-[#292524]"
                }`}>
                  The intangible values we believe in are integrity, trust and being human-first.
                </p>
              </div>

              {/* Section 4: Founder Bio */}
              <div className={`border p-5 sm:p-7 space-y-3.5 rounded-sm shadow-xs backdrop-blur-xs transition-colors text-left ${
                isDarkMode 
                  ? "bg-[#1c1917]/90 border-[#27272a] text-[#fafaf9]" 
                  : "bg-white border-[#1c1917] text-[#1c1917]"
              }`}>
                <div className={`flex items-center justify-between border-b pb-2 ${
                  isDarkMode ? "border-[#27272a]" : "border-[#1c1917]"
                }`}>
                  <h2 className={`text-[11px] font-mono uppercase tracking-[0.25em] font-bold ${
                    isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"
                  }`}>
                    Founder
                  </h2>
                  <a 
                    href="https://www.linkedin.com/in/oskarhiekkanen/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold transition-colors ${boatBlueText} hover:underline`}
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight size={11} />
                  </a>
                </div>
                
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-inherit">
                    Oskar Hiekkanen, Founder
                  </h3>
                  <p className={`font-mono text-xs sm:text-sm font-semibold tracking-wide mt-0.5 ${
                    isDarkMode ? "text-stone-300" : "text-stone-700"
                  }`}>
                    EIR (Entrepreneur In Residence), THREADS
                  </p>
                </div>

                <p className={`font-serif text-sm sm:text-base leading-relaxed font-normal ${
                  isDarkMode ? "text-[#e4e4e7]" : "text-[#292524]"
                }`}>
                  Fintech r&amp;d, product, consulting, and commercial background within accounting, ERP, payments, and healthcare across startups, scaleups, and multinationals—a generalist Swiss knife obsessed with real value and an avid sailor.
                </p>

                <p className={`font-serif text-sm sm:text-base leading-relaxed font-normal ${
                  isDarkMode ? "text-[#e4e4e7]" : "text-[#292524]"
                }`}>
                  Educated in both business and tech.
                </p>
              </div>

              {/* Section 5: Contact & Inquiries */}
              <div className={`border p-5 sm:p-7 space-y-4 rounded-sm shadow-xs backdrop-blur-xs transition-colors text-left ${
                isDarkMode 
                  ? "bg-[#1c1917]/90 border-[#27272a] text-[#fafaf9]" 
                  : "bg-white border-[#1c1917] text-[#1c1917]"
              }`}>
                <h2 className={`text-[11px] font-mono uppercase tracking-[0.25em] block border-b pb-2 font-bold ${
                  isDarkMode ? "text-[#fafaf9] border-[#27272a]" : "text-[#1c1917] border-[#1c1917]"
                }`}>
                  Contact &amp; Inquiries
                </h2>
                
                <p className={`font-serif text-sm sm:text-base leading-relaxed font-normal ${
                  isDarkMode ? "text-[#e4e4e7]" : "text-[#292524]"
                }`}>
                  For acquisitions, partnerships, or curious dialogues, reach out directly:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Oskar Hiekkanen */}
                  <div className={`border p-4 rounded-sm transition-colors flex flex-col justify-between ${
                    isDarkMode ? "border-[#3f3f46] bg-[#27272a]/50" : "border-[#1c1917] bg-white"
                  }`}>
                    <div className="space-y-1.5 mb-3">
                      <div className="flex flex-wrap items-start justify-between gap-1.5">
                        <div className="space-y-0.5">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <span className="font-serif font-bold text-sm sm:text-base text-inherit">Oskar Hiekkanen</span>
                            <span className={`font-mono text-[10px] uppercase font-semibold ${
                              isDarkMode ? "text-stone-400" : "text-stone-600"
                            }`}>
                              Founder
                            </span>
                          </div>
                          <div className={`font-mono text-[10px] uppercase tracking-wide font-medium ${
                            isDarkMode ? "text-stone-400" : "text-stone-600"
                          }`}>
                            EIR (Entrepreneur In Residence), THREADS
                          </div>
                        </div>
                        <a 
                          href="https://www.linkedin.com/in/oskarhiekkanen/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold transition-colors ${boatBlueText} hover:underline`}
                        >
                          <span>LinkedIn</span>
                          <ArrowUpRight size={11} />
                        </a>
                      </div>
                      <a 
                        href="mailto:oh@tradar.fi"
                        className={`font-mono text-xs block transition-colors ${
                          isDarkMode ? "text-[#d4d4d8] hover:text-[#38bdf8]" : "text-[#44403c] hover:text-[#1d4ed8]"
                        }`}
                      >
                        oh@tradar.fi
                      </a>
                    </div>
                    <div className="pt-2 border-t border-stone-200 dark:border-stone-700/60 flex items-center">
                      <button
                        type="button"
                        onClick={handleCopyOskarEmail}
                        className={`font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 border transition-colors flex items-center gap-1.5 rounded-sm cursor-pointer ${
                          isDarkMode 
                            ? "border-[#38bdf8] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-black" 
                            : "border-[#1d4ed8] text-[#1d4ed8] hover:bg-[#1d4ed8] hover:text-white"
                        }`}
                      >
                        {copiedOskarEmail ? (
                          <>
                            <Check size={11} className="stroke-[3]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>Copy Email</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* THREADS */}
                  <div className={`border p-4 rounded-sm transition-colors flex flex-col justify-between ${
                    isDarkMode ? "border-[#3f3f46] bg-[#27272a]/50" : "border-[#1c1917] bg-white"
                  }`}>
                    <div className="space-y-1.5 mb-3">
                      <div>
                        <span className="font-serif font-bold text-sm sm:text-base text-inherit block">
                          THREADS
                        </span>
                        <a 
                          href="https://threadsunite.xyz/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`font-mono text-xs font-semibold inline-flex items-center gap-1 transition-colors ${boatBlueText} hover:underline mt-0.5`}
                        >
                          <span>WEBSITE</span>
                          <ArrowUpRight size={11} />
                        </a>
                      </div>
                      <a 
                        href="mailto:s@threadsunite.xyz"
                        className={`font-mono text-xs block transition-colors ${
                          isDarkMode ? "text-[#d4d4d8] hover:text-[#38bdf8]" : "text-[#44403c] hover:text-[#1d4ed8]"
                        }`}
                      >
                        s@threadsunite.xyz
                      </a>
                    </div>
                    <div className="pt-2 border-t border-stone-200 dark:border-stone-700/60 flex items-center">
                      <button
                        type="button"
                        onClick={handleCopySagarEmail}
                        className={`font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 border transition-colors flex items-center gap-1.5 rounded-sm cursor-pointer ${
                          isDarkMode 
                            ? "border-[#38bdf8] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-black" 
                            : "border-[#1d4ed8] text-[#1d4ed8] hover:bg-[#1d4ed8] hover:text-white"
                        }`}
                      >
                        {copiedSagarEmail ? (
                          <>
                            <Check size={11} className="stroke-[3]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>Copy Email</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
            <span className={`font-bold ${isDarkMode ? "text-[#38bdf8]" : "text-[#1d4ed8]"}`}>TRÅDAR</span>
            <span className={isDarkMode ? "text-[#3f3f46]" : "text-[#d6d3d1]"}>•</span>
            <span>incubated by THREADS</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-[9px] tracking-wider normal-case hidden md:inline ${isDarkMode ? "text-[#71717a]" : "text-[#a8a29e]"}`}>
              Collector and curator of quality businesses in Nordics, Baltics &amp; Beyond.
            </span>
            <div className="flex gap-1">
              <div className={`w-1.5 h-1.5 ${isDarkMode ? "bg-[#38bdf8]" : "bg-[#1d4ed8]"}`}></div>
              <div className={`w-1.5 h-1.5 border ${isDarkMode ? "border-[#38bdf8]" : "border-[#1d4ed8]"}`}></div>
              <div className={`w-1.5 h-1.5 border ${isDarkMode ? "border-[#38bdf8]/30" : "border-[#1d4ed8]/20"}`}></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
