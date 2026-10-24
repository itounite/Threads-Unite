import { ArrowUpRight, TrendingUp, Compass, Briefcase, BookOpen, FileText, Mail } from "lucide-react";
import { motion } from "motion/react";

interface WhatWeDoViewProps {
  isDarkMode: boolean;
  onNavigateToWhitepaper: () => void;
  onOpenContactModal?: () => void;
}

export function WhatWeDoView({
  isDarkMode,
  onNavigateToWhitepaper,
}: WhatWeDoViewProps) {
  return (
    <motion.div
      key="whatwedo-view"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="max-w-4xl mx-auto space-y-6 md:space-y-8 py-2 md:py-4 text-left"
    >
      {/* Editorial Header */}
      <div className={`border-b pb-5 md:pb-6 ${isDarkMode ? "border-[#27272a]" : "border-[#e7e5e4]"}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-[10px] font-mono uppercase tracking-[0.25em] font-semibold ${
            isDarkMode ? "text-[#a1a1aa]" : "text-[#78716c]"
          }`}>
            Practice &amp; Architecture
          </span>
          <span className={isDarkMode ? "text-[#3f3f46]" : "text-[#d6d3d1]"}>•</span>
          <span className={`text-[10px] font-mono uppercase tracking-widest ${
            isDarkMode ? "text-[#71717a]" : "text-[#a8a29e]"
          }`}>
            Four Arms
          </span>
        </div>
        <h1 className={`font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-tight ${
          isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"
        }`}>
          What We Do?
        </h1>
        <p className={`mt-3 font-serif text-sm sm:text-base leading-relaxed max-w-2xl ${
          isDarkMode ? "text-[#d4d4d8]" : "text-[#44403c]"
        }`}>
          Threads is built on four pillars — <span className="font-semibold">Invest</span>, <span className="font-semibold">Incubate</span>, <span className="font-semibold">Advisory</span>, and <span className="font-semibold">Writings</span> — creating compounders, endowments, and businesses that last — compounding returns for shareholders, and impact for stakeholders.
        </p>
      </div>

      {/* Grid of the Four Arms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        
        {/* Arm 1: Invest */}
        <div className={`border p-6 rounded-sm shadow-xs backdrop-blur-xs transition-colors flex flex-col justify-between ${
          isDarkMode 
            ? "bg-[#1c1917]/90 border-[#27272a] text-[#fafaf9]" 
            : "bg-white/90 border-[#e7e5e4] text-[#1c1917]"
        }`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <TrendingUp size={15} className={isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"} />
                <span className={`text-[10px] font-mono uppercase tracking-[0.25em] font-bold ${
                  isDarkMode ? "text-[#a1a1aa]" : "text-[#78716c]"
                }`}>
                  Arm 01 / Invest
                </span>
              </div>
              <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-xs border ${
                isDarkMode ? "border-[#3f3f46] text-[#a1a1aa] bg-[#27272a]" : "border-[#e7e5e4] text-[#78716c] bg-[#fafaf9]"
              }`}>
                Public Markets
              </span>
            </div>

            <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight">
              Invest
            </h2>

            <p className={`font-serif text-sm leading-relaxed ${
              isDarkMode ? "text-[#d4d4d8]" : "text-[#44403c]"
            }`}>
              Threads invests in listed serial acquirers. Threads has evaluated more than 100 listed serial acquirers and invested in 18, from Japan to Canada to Sweden to Finland.
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-dashed border-stone-200 dark:border-stone-800 space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
              <span className={`px-2 py-0.8 rounded-xs ${
                isDarkMode ? "bg-[#27272a] text-[#e4e4e7]" : "bg-[#f5f5f4] text-[#44403c]"
              }`}>
                100+ Evaluated
              </span>
              <span className={`px-2 py-0.8 rounded-xs ${
                isDarkMode ? "bg-[#27272a] text-[#e4e4e7]" : "bg-[#f5f5f4] text-[#44403c]"
              }`}>
                18 Invested
              </span>
            </div>
            <div className={`text-[10px] font-mono uppercase tracking-wider ${
              isDarkMode ? "text-[#a1a1aa]" : "text-[#78716c]"
            }`}>
              Japan • Canada • Sweden • Finland
            </div>
          </div>
        </div>

        {/* Arm 2: Incubate */}
        <div className={`border p-6 rounded-sm shadow-xs backdrop-blur-xs transition-colors flex flex-col justify-between ${
          isDarkMode 
            ? "bg-[#1c1917]/90 border-[#27272a] text-[#fafaf9]" 
            : "bg-white/90 border-[#e7e5e4] text-[#1c1917]"
        }`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <Compass size={15} className={isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"} />
                <span className={`text-[10px] font-mono uppercase tracking-[0.25em] font-bold ${
                  isDarkMode ? "text-[#a1a1aa]" : "text-[#78716c]"
                }`}>
                  Arm 02 / Incubate
                </span>
              </div>
              <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-xs border ${
                isDarkMode ? "border-[#3f3f46] text-[#a1a1aa] bg-[#27272a]" : "border-[#e7e5e4] text-[#78716c] bg-[#fafaf9]"
              }`}>
                Compounders
              </span>
            </div>

            <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight">
              Incubate
            </h2>

            <p className={`font-serif text-sm leading-relaxed ${
              isDarkMode ? "text-[#d4d4d8]" : "text-[#44403c]"
            }`}>
              Threads actively partners with outstanding cathedral builders and incubates compounders, with a special interest in serial acquirers, taking an active board role and helping with capital allocation strategy, strategic outlook, fundraising, and designing an internal playbook to build a compounder.
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-dashed border-stone-200 dark:border-stone-800 space-y-1.5">
            <div className="flex flex-wrap gap-1.5 text-[9px] font-mono uppercase">
              <span className={`px-2 py-0.5 rounded-xs border ${
                isDarkMode ? "border-[#3f3f46] bg-[#27272a] text-[#d4d4d8]" : "border-[#e7e5e4] bg-[#fafaf9] text-[#57534e]"
              }`}>
                Active Board Roles
              </span>
              <span className={`px-2 py-0.5 rounded-xs border ${
                isDarkMode ? "border-[#3f3f46] bg-[#27272a] text-[#d4d4d8]" : "border-[#e7e5e4] bg-[#fafaf9] text-[#57534e]"
              }`}>
                Capital Allocation
              </span>
              <span className={`px-2 py-0.5 rounded-xs border ${
                isDarkMode ? "border-[#3f3f46] bg-[#27272a] text-[#d4d4d8]" : "border-[#e7e5e4] bg-[#fafaf9] text-[#57534e]"
              }`}>
                Fundraising
              </span>
              <span className={`px-2 py-0.5 rounded-xs border ${
                isDarkMode ? "border-[#3f3f46] bg-[#27272a] text-[#d4d4d8]" : "border-[#e7e5e4] bg-[#fafaf9] text-[#57534e]"
              }`}>
                Internal Playbooks
              </span>
            </div>
          </div>
        </div>

        {/* Arm 3: Advisory */}
        <div className={`border p-6 rounded-sm shadow-xs backdrop-blur-xs transition-colors flex flex-col justify-between ${
          isDarkMode 
            ? "bg-[#1c1917]/90 border-[#27272a] text-[#fafaf9]" 
            : "bg-white/90 border-[#e7e5e4] text-[#1c1917]"
        }`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <Briefcase size={15} className={isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"} />
                <span className={`text-[10px] font-mono uppercase tracking-[0.25em] font-bold ${
                  isDarkMode ? "text-[#a1a1aa]" : "text-[#78716c]"
                }`}>
                  Arm 03 / Advisory
                </span>
              </div>
              <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-xs border ${
                isDarkMode ? "border-[#3f3f46] text-[#a1a1aa] bg-[#27272a]" : "border-[#e7e5e4] text-[#78716c] bg-[#fafaf9]"
              }`}>
                Institutional
              </span>
            </div>

            <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight">
              Advisory
            </h2>

            <p className={`font-serif text-sm leading-relaxed ${
              isDarkMode ? "text-[#d4d4d8]" : "text-[#44403c]"
            }`}>
              Threads advises impact funds, family offices, endowments, and holding companies on due diligence, impact reporting, fund administration reporting, deal closures, portfolio management, board roles, and fundraising support.
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-dashed border-stone-200 dark:border-stone-800 space-y-1.5">
            <div className="flex flex-wrap gap-1.5 text-[9px] font-mono uppercase">
              <span className={`px-2 py-0.5 rounded-xs border ${
                isDarkMode ? "border-[#3f3f46] bg-[#27272a] text-[#d4d4d8]" : "border-[#e7e5e4] bg-[#fafaf9] text-[#57534e]"
              }`}>
                Due Diligence
              </span>
              <span className={`px-2 py-0.5 rounded-xs border ${
                isDarkMode ? "border-[#3f3f46] bg-[#27272a] text-[#d4d4d8]" : "border-[#e7e5e4] bg-[#fafaf9] text-[#57534e]"
              }`}>
                Impact &amp; Admin Reporting
              </span>
              <span className={`px-2 py-0.5 rounded-xs border ${
                isDarkMode ? "border-[#3f3f46] bg-[#27272a] text-[#d4d4d8]" : "border-[#e7e5e4] bg-[#fafaf9] text-[#57534e]"
              }`}>
                Deal Closures
              </span>
              <span className={`px-2 py-0.5 rounded-xs border ${
                isDarkMode ? "border-[#3f3f46] bg-[#27272a] text-[#d4d4d8]" : "border-[#e7e5e4] bg-[#fafaf9] text-[#57534e]"
              }`}>
                Portfolio Management
              </span>
            </div>
          </div>
        </div>

        {/* Arm 4: Writings */}
        <div className={`border p-6 rounded-sm shadow-xs backdrop-blur-xs transition-colors flex flex-col justify-between ${
          isDarkMode 
            ? "bg-[#1c1917]/90 border-[#27272a] text-[#fafaf9]" 
            : "bg-white/90 border-[#e7e5e4] text-[#1c1917]"
        }`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <BookOpen size={15} className={isDarkMode ? "text-[#fafaf9]" : "text-[#1c1917]"} />
                <span className={`text-[10px] font-mono uppercase tracking-[0.25em] font-bold ${
                  isDarkMode ? "text-[#a1a1aa]" : "text-[#78716c]"
                }`}>
                  Arm 04 / Writings
                </span>
              </div>
              <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-xs border ${
                isDarkMode ? "border-[#3f3f46] text-[#a1a1aa] bg-[#27272a]" : "border-[#e7e5e4] text-[#78716c] bg-[#fafaf9]"
              }`}>
                Research &amp; Treatises
              </span>
            </div>

            <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight">
              Writings
            </h2>

            <p className={`font-serif text-sm leading-relaxed ${
              isDarkMode ? "text-[#d4d4d8]" : "text-[#44403c]"
            }`}>
              Currently writing a playbook for creating compounders; we have already published a whitepaper on capital allocation platforms and insight papers on serial acquirers.
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-dashed border-stone-200 dark:border-stone-800 space-y-2.5">
            {/* Capital Allocation Platform - Whitepaper */}
            <a
              href="https://threadsunite.xyz/whitepaper"
              onClick={(e) => {
                // If within app, optionally allow navigating to whitepaper view
                e.preventDefault();
                onNavigateToWhitepaper();
              }}
              className={`p-3 rounded-sm border transition-all flex items-center justify-between gap-2 group ${
                isDarkMode 
                  ? "bg-[#27272a]/70 hover:bg-[#27272a] border-[#3f3f46] text-[#fafaf9]" 
                  : "bg-[#fafaf9] hover:bg-white border-[#e7e5e4] hover:border-[#1c1917] text-[#1c1917]"
              }`}
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 font-serif font-bold text-xs sm:text-sm group-hover:underline">
                  <FileText size={13} className="shrink-0" />
                  <span className="truncate">Capital Allocation Platform - Whitepaper</span>
                </div>
                <div className={`text-[10px] font-mono truncate ${isDarkMode ? "text-[#a1a1aa]" : "text-[#78716c]"}`}>
                  https://threadsunite.xyz/whitepaper
                </div>
              </div>
              <ArrowUpRight size={14} className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Insights */}
            <a
              href="https://compounders.cc/insights"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-sm border transition-all flex items-center justify-between gap-2 group ${
                isDarkMode 
                  ? "bg-[#27272a]/70 hover:bg-[#27272a] border-[#3f3f46] text-[#fafaf9]" 
                  : "bg-[#fafaf9] hover:bg-white border-[#e7e5e4] hover:border-[#1c1917] text-[#1c1917]"
              }`}
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 font-serif font-bold text-xs sm:text-sm group-hover:underline">
                  <BookOpen size={13} className="shrink-0" />
                  <span className="truncate">Insights</span>
                </div>
                <div className={`text-[10px] font-mono truncate ${isDarkMode ? "text-[#a1a1aa]" : "text-[#78716c]"}`}>
                  https://compounders.cc/insights
                </div>
              </div>
              <ArrowUpRight size={14} className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

      </div>

      {/* Direct Contact Callout */}
      <div className={`border p-6 rounded-sm text-center space-y-3 backdrop-blur-xs transition-colors ${
        isDarkMode 
          ? "bg-[#1c1917]/70 border-[#27272a] text-[#fafaf9]" 
          : "bg-white/80 border-[#e7e5e4] text-[#1c1917]"
      }`}>
        <span className={`text-[10px] font-mono uppercase tracking-[0.25em] block font-semibold ${
          isDarkMode ? "text-[#a1a1aa]" : "text-[#78716c]"
        }`}>
          Get in Touch
        </span>
        <h3 className="font-serif text-base sm:text-lg font-light">
          Interested in partnering, co-investing, or exploring advisory mandates?
        </h3>
        <div className="pt-1 flex justify-center">
          <a
            href="mailto:s@threadsunite.xyz"
            className={`inline-flex items-center gap-2 font-mono text-xs sm:text-sm uppercase tracking-wider font-bold py-2.5 px-5 border rounded-sm transition-all ${
              isDarkMode 
                ? "bg-[#fafaf9] text-[#0c0a09] border-[#fafaf9] hover:bg-stone-200" 
                : "bg-[#1c1917] text-[#fafaf9] border-[#1c1917] hover:bg-stone-800"
            }`}
          >
            <Mail size={15} />
            <span>s@threadsunite.xyz</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
