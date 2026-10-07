interface NordicBackgroundProps {
  isDarkMode?: boolean;
}

export function NordicBackground({ isDarkMode = false }: NordicBackgroundProps) {
  return (
    <div className={`fixed inset-0 pointer-events-none select-none z-0 overflow-hidden transition-colors duration-300 ${
      isDarkMode ? "bg-[#0c0a09]" : "bg-[#fafaf9]"
    }`}>
      <svg
        viewBox="0 0 1600 900"
        className={`w-full h-full object-cover transition-colors duration-300 ${
          isDarkMode ? "opacity-[0.28] text-[#fafaf9]" : "opacity-[0.22] text-[#1c1917]"
        }`}
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* LIGHT MODE: Yellow Sun with Orange Rays on Top Left */}
        {!isDarkMode && (
          <g id="sun-top-left" opacity="0.85">
            {/* Outer soft halo ring */}
            <circle cx="160" cy="100" r="46" fill="none" stroke="#facc15" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.6" />

            {/* Sun Rays (Orange) */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = 160 + Math.cos(rad) * 26;
              const y1 = 100 + Math.sin(rad) * 26;
              const x2 = 160 + Math.cos(rad) * 38;
              const y2 = 100 + Math.sin(rad) * 38;
              return (
                <line
                  key={`ray-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#f97316"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              );
            })}

            {/* Sun Disk */}
            <circle cx="160" cy="100" r="20" fill="#facc15" stroke="#eab308" strokeWidth="1.5" />
          </g>
        )}

        {/* DARK MODE: Full Moon on Top Right - Whitish-Yellow Rough Surface with Craters & Maria, No Radiating Rays */}
        {isDarkMode && (
          <g id="moon-top-right" opacity="0.95">
            <defs>
              <clipPath id="full-moon-clip">
                <circle cx="1420" cy="110" r="28" />
              </clipPath>
            </defs>

            {/* Full Moon Base Disk */}
            <circle
              cx="1420"
              cy="110"
              r="28"
              fill="#fef9c3"
              stroke="#fef08a"
              strokeWidth="1.4"
            />

            {/* Rough Surface, Lunar Maria & Craters Texture (Clipped to Full Moon Circle) */}
            <g clipPath="url(#full-moon-clip)">
              {/* Lunar Maria (Darker Surface Patches / Lunar Seas) */}
              <path d="M 1402,102 Q 1415,92 1428,98 Q 1422,114 1402,102 Z" fill="#eab308" opacity="0.22" />
              <path d="M 1420,110 Q 1438,104 1442,122 Q 1426,128 1420,110 Z" fill="#eab308" opacity="0.24" />
              <path d="M 1408,90 Q 1424,84 1432,93 Q 1418,97 1408,90 Z" fill="#eab308" opacity="0.18" />

              {/* Major Crater 1: Tycho (Bottom Center with Ray System) */}
              <circle cx="1424" cy="128" r="4.8" fill="#eab308" opacity="0.32" stroke="#ca8a04" strokeWidth="0.7" />
              <path d="M 1420,125 A 3.8,3.8 0 0,1 1428,129" stroke="#ffffff" strokeWidth="0.8" fill="none" opacity="0.85" />
              {/* Tycho Ray Lines across moon face */}
              <path d="M 1424,128 L 1406,112 M 1424,128 L 1436,102 M 1424,128 L 1444,120 M 1424,128 L 1410,134" stroke="#ffffff" strokeWidth="0.6" opacity="0.4" strokeDasharray="1 2.5" fill="none" />

              {/* Major Crater 2: Copernicus (Left Center) */}
              <circle cx="1406" cy="110" r="4.2" fill="#eab308" opacity="0.28" stroke="#ca8a04" strokeWidth="0.6" />
              <path d="M 1403,107 A 3.2,3.2 0 0,1 1409,111" stroke="#ffffff" strokeWidth="0.7" fill="none" opacity="0.8" />

              {/* Major Crater 3: Kepler (Upper Left) */}
              <circle cx="1403" cy="98" r="3.2" fill="#eab308" opacity="0.25" stroke="#ca8a04" strokeWidth="0.5" />
              <path d="M 1401,96 A 2.5,2.5 0 0,1 1405,99" stroke="#ffffff" strokeWidth="0.5" fill="none" opacity="0.7" />

              {/* Aristarchus Bright Impact Peak */}
              <circle cx="1408" cy="92" r="2.2" fill="#ffffff" opacity="0.85" stroke="#ca8a04" strokeWidth="0.5" />

              {/* Crater 4: Plato (Dark Floor Crater at Top) */}
              <circle cx="1420" cy="88" r="3.6" fill="#854d0e" opacity="0.35" stroke="#ca8a04" strokeWidth="0.6" />

              {/* Crater Cluster 5: Clavius & Southern Craters */}
              <circle cx="1433" cy="131" r="3.2" fill="#eab308" opacity="0.25" stroke="#ca8a04" strokeWidth="0.5" />
              <circle cx="1415" cy="130" r="2.8" fill="#eab308" opacity="0.22" stroke="#ca8a04" strokeWidth="0.5" />

              {/* Crater Cluster 6: Right Side Craters */}
              <circle cx="1438" cy="116" r="4.0" fill="#eab308" opacity="0.28" stroke="#ca8a04" strokeWidth="0.6" />
              <circle cx="1440" cy="102" r="3.4" fill="#eab308" opacity="0.24" stroke="#ca8a04" strokeWidth="0.5" />

              {/* Rough Surface Ridges & Contour Lines */}
              <path d="M 1398,105 C 1410,101 1420,108 1435,102" stroke="#ca8a04" strokeWidth="0.7" strokeDasharray="1.5 1.5" opacity="0.38" fill="none" />
              <path d="M 1402,118 C 1416,114 1428,121 1442,114" stroke="#ca8a04" strokeWidth="0.7" strokeDasharray="1 1.5" opacity="0.38" fill="none" />
              <path d="M 1410,95 C 1422,91 1432,97 1444,92" stroke="#ca8a04" strokeWidth="0.6" strokeDasharray="2 1" opacity="0.35" fill="none" />

              {/* Fine Stippling Dust / Surface Texture Dots */}
              <circle cx="1398" cy="110" r="0.7" fill="#854d0e" opacity="0.4" />
              <circle cx="1405" cy="118" r="0.8" fill="#854d0e" opacity="0.4" />
              <circle cx="1412" cy="104" r="0.7" fill="#854d0e" opacity="0.35" />
              <circle cx="1418" cy="116" r="0.8" fill="#854d0e" opacity="0.45" />
              <circle cx="1425" cy="98" r="0.7" fill="#854d0e" opacity="0.4" />
              <circle cx="1429" cy="112" r="0.8" fill="#854d0e" opacity="0.45" />
              <circle cx="1435" cy="96" r="0.7" fill="#854d0e" opacity="0.35" />
              <circle cx="1442" cy="108" r="0.8" fill="#854d0e" opacity="0.4" />
              <circle cx="1444" cy="124" r="0.7" fill="#854d0e" opacity="0.35" />
              <circle cx="1430" cy="122" r="0.8" fill="#854d0e" opacity="0.4" />
              <circle cx="1414" cy="124" r="0.7" fill="#854d0e" opacity="0.35" />
            </g>
          </g>
        )}

        {/* Sky / Distant Horizon Contour Lines */}
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.6">
          <path d="M -50,180 C 250,140 500,220 800,160 C 1100,100 1400,210 1650,150" strokeDasharray="6 3" />
          <path d="M -50,210 C 200,180 450,240 750,190 C 1050,140 1350,230 1650,180" opacity="0.5" />
        </g>

        {/* Distant Nordic Fjord / Mountain Ridge Line-Art */}
        <g stroke="currentColor" strokeWidth="1.2" opacity="0.8">
          {/* Main Ridge Contour */}
          <path d="M -50,320 L 120,270 L 220,300 L 380,210 L 520,290 L 680,230 L 850,310 L 1020,220 L 1220,280 L 1380,240 L 1520,290 L 1650,260" />
          
          {/* Topographic Contour Lines */}
          <path d="M 120,270 Q 250,290 380,210" strokeWidth="0.6" strokeDasharray="4 2" />
          <path d="M 380,210 Q 520,250 680,230" strokeWidth="0.6" />
          <path d="M 680,230 Q 820,280 1020,220" strokeWidth="0.6" strokeDasharray="3 3" />
          <path d="M 1020,220 Q 1200,250 1380,240" strokeWidth="0.6" />

          {/* Ridge Hatchings (Sketch lines) */}
          <path d="M 350,230 L 370,250 M 360,220 L 385,250 M 375,215 L 400,255 M 390,220 L 415,260" strokeWidth="0.6" opacity="0.7" />
          <path d="M 650,245 L 670,265 M 660,238 L 685,268 M 675,232 L 700,270" strokeWidth="0.6" opacity="0.7" />
          <path d="M 990,235 L 1010,255 M 1000,228 L 1025,260 M 1015,222 L 1040,265" strokeWidth="0.6" opacity="0.7" />
        </g>

        {/* Pine & Spruce Forest Silhouettes (Fine line art) */}
        <g stroke="currentColor" strokeWidth="1" opacity="0.85">
          {/* Forest Cluster 1 (Left Coastline) */}
          {[
            { x: 40, y: 390, h: 45 }, { x: 55, y: 385, h: 55 }, { x: 72, y: 395, h: 40 },
            { x: 88, y: 380, h: 60 }, { x: 105, y: 390, h: 50 }, { x: 125, y: 385, h: 55 },
            { x: 145, y: 395, h: 42 }, { x: 165, y: 382, h: 58 }, { x: 185, y: 390, h: 48 },
            { x: 205, y: 388, h: 52 }, { x: 225, y: 398, h: 38 }
          ].map((tree, i) => (
            <g key={`t1-${i}`}>
              <line x1={tree.x} y1={tree.y} x2={tree.x} y2={tree.y - tree.h} />
              <path d={`M ${tree.x - 8},${tree.y - tree.h * 0.3} L ${tree.x},${tree.y - tree.h * 0.5} L ${tree.x + 8},${tree.y - tree.h * 0.3}`} strokeWidth="0.8" />
              <path d={`M ${tree.x - 6},${tree.y - tree.h * 0.55} L ${tree.x},${tree.y - tree.h * 0.72} L ${tree.x + 6},${tree.y - tree.h * 0.55}`} strokeWidth="0.8" />
              <path d={`M ${tree.x - 4},${tree.y - tree.h * 0.75} L ${tree.x},${tree.y - tree.h * 0.9} L ${tree.x + 4},${tree.y - tree.h * 0.75}`} strokeWidth="0.8" />
            </g>
          ))}

          {/* Forest Cluster 2 (Mid Archipelago / Hill) */}
          {[
            { x: 580, y: 360, h: 50 }, { x: 600, y: 350, h: 65 }, { x: 620, y: 355, h: 58 },
            { x: 642, y: 348, h: 70 }, { x: 665, y: 358, h: 52 }, { x: 688, y: 362, h: 45 },
            { x: 710, y: 352, h: 60 }, { x: 730, y: 360, h: 50 }, { x: 750, y: 365, h: 42 }
          ].map((tree, i) => (
            <g key={`t2-${i}`}>
              <line x1={tree.x} y1={tree.y} x2={tree.x} y2={tree.y - tree.h} />
              <path d={`M ${tree.x - 9},${tree.y - tree.h * 0.3} L ${tree.x},${tree.y - tree.h * 0.5} L ${tree.x + 9},${tree.y - tree.h * 0.3}`} strokeWidth="0.8" />
              <path d={`M ${tree.x - 7},${tree.y - tree.h * 0.55} L ${tree.x},${tree.y - tree.h * 0.72} L ${tree.x + 7},${tree.y - tree.h * 0.55}`} strokeWidth="0.8" />
              <path d={`M ${tree.x - 4},${tree.y - tree.h * 0.75} L ${tree.x},${tree.y - tree.h * 0.9} L ${tree.x + 4},${tree.y - tree.h * 0.75}`} strokeWidth="0.8" />
            </g>
          ))}

          {/* Forest Cluster 3 (Right Shoreline) */}
          {[
            { x: 1350, y: 375, h: 52 }, { x: 1372, y: 368, h: 62 }, { x: 1395, y: 372, h: 55 },
            { x: 1418, y: 360, h: 72 }, { x: 1440, y: 370, h: 58 }, { x: 1465, y: 365, h: 64 },
            { x: 1490, y: 378, h: 48 }, { x: 1515, y: 372, h: 54 }, { x: 1540, y: 382, h: 42 }
          ].map((tree, i) => (
            <g key={`t3-${i}`}>
              <line x1={tree.x} y1={tree.y} x2={tree.x} y2={tree.y - tree.h} />
              <path d={`M ${tree.x - 8},${tree.y - tree.h * 0.3} L ${tree.x},${tree.y - tree.h * 0.5} L ${tree.x + 8},${tree.y - tree.h * 0.3}`} strokeWidth="0.8" />
              <path d={`M ${tree.x - 6},${tree.y - tree.h * 0.55} L ${tree.x},${tree.y - tree.h * 0.72} L ${tree.x + 6},${tree.y - tree.h * 0.55}`} strokeWidth="0.8" />
              <path d={`M ${tree.x - 4},${tree.y - tree.h * 0.75} L ${tree.x},${tree.y - tree.h * 0.9} L ${tree.x + 4},${tree.y - tree.h * 0.75}`} strokeWidth="0.8" />
            </g>
          ))}
        </g>

        {/* Shoreline / Baltic Sea Coastline & Archipelago Rock Contours */}
        <g stroke="currentColor" strokeWidth="1.1" opacity="0.75">
          {/* Main Coastline Shore */}
          <path d="M -50,420 C 180,410 320,440 500,425 C 650,410 800,445 980,420 C 1150,400 1350,430 1650,415" />
          
          {/* Archipelago Rocky Island 1 */}
          <path d="M 380,470 C 420,455 480,458 520,472 C 500,480 430,485 380,470 Z" />
          <path d="M 400,465 Q 450,460 490,468" strokeWidth="0.6" />
          
          {/* Archipelago Rocky Island 2 */}
          <path d="M 1100,485 C 1140,472 1210,475 1250,490 C 1220,498 1150,500 1100,485 Z" />
          <path d="M 1120,480 Q 1180,475 1230,485" strokeWidth="0.6" />
        </g>

        {/* Lake & Baltic Sea Water Wave Sketch Lines */}
        <g stroke="currentColor" strokeWidth="0.75" opacity="0.6">
          {/* Gentle Rhythmic Waves across the lower half */}
          <path d="M 40,510 Q 140,500 240,510 T 440,510 T 640,510 T 840,510 T 1040,510 T 1240,510 T 1440,510" />
          <path d="M 120,540 Q 220,530 320,540 T 520,540 T 720,540 T 920,540 T 1120,540 T 1320,540 T 1520,540" strokeWidth="0.6" />
          <path d="M -20,575 Q 80,565 180,575 T 380,575 T 580,575 T 780,575 T 980,575 T 1180,575 T 1380,575 T 1580,575" strokeWidth="0.7" />
          <path d="M 80,615 Q 180,605 280,615 T 480,615 T 680,615 T 880,615 T 1080,615 T 1280,615 T 1480,615" strokeWidth="0.5" />
          
          {/* Deep Water Horizontal Hatching Lines */}
          <path d="M -50,660 C 200,650 450,670 700,655 C 950,640 1200,665 1650,650" strokeWidth="0.8" />
          <path d="M 50,700 C 300,690 550,710 800,695 C 1050,680 1300,705 1550,690" strokeWidth="0.5" strokeDasharray="12 6" />
          <path d="M -50,740 C 200,730 450,750 700,735 C 950,720 1200,745 1650,730" strokeWidth="0.75" />
          <path d="M 100,785 C 350,775 600,795 850,780 C 1100,765 1350,790 1600,775" strokeWidth="0.5" />
          <path d="M -50,830 C 200,820 450,840 700,825 C 950,810 1200,835 1650,820" strokeWidth="0.7" strokeDasharray="8 4" />
        </g>

        {/* Traditional Wooden Stick Boat with Woman slowly crossing bottom water - Thicker Canvas Blue Boat with Moon Texture */}
        <g opacity="0.95">
          {/* Outer group handles slow left-to-right translation across the water (Starts immediately in view at x=30) */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              from="30 705"
              to="1630 705"
              dur="42s"
              repeatCount="indefinite"
            />

            {/* Inner group handles gentle floating bobbing up and down */}
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 0; 0 -4; 0 0"
                keyTimes="0; 0.5; 1"
                dur="3.2s"
                repeatCount="indefinite"
              />

              <defs>
                <clipPath id="boat-hull-clip">
                  <path d="M 5,14 C 32,48 98,48 125,14 C 105,37 25,37 5,14 Z" />
                </clipPath>
              </defs>

              {/* Glowing Night Aura beneath boat in dark mode (Moonlight Reflection on Canvas Blue) */}
              {isDarkMode && (
                <path
                  d="M 1,12 C 32,53 98,53 129,12 C 105,40 25,40 1,12 Z"
                  fill="#0284c7"
                  opacity="0.35"
                  stroke="#38bdf8"
                  strokeWidth="1"
                />
              )}

              {/* Canvas Blue Thicker Hull of the Boat */}
              <path
                d="M 5,14 C 32,48 98,48 125,14 C 105,37 25,37 5,14 Z"
                fill={isDarkMode ? "#0284c7" : "#1d4ed8"}
                stroke={isDarkMode ? "#7dd3fc" : "#1e40af"}
                strokeWidth="1.8"
              />

              {/* Rough Moon Surface & Canvas Texture inside Thicker Boat Hull */}
              <g clipPath="url(#boat-hull-clip)">
                {/* Darker Lunar Patch / Canvas Grain Fill */}
                <path d="M 15,20 Q 40,42 65,34 Q 90,44 115,20 Z" fill={isDarkMode ? "#0369a1" : "#1e3a8a"} opacity="0.5" />

                {/* Rough Canvas Weave & Contour Lines */}
                <path d="M 10,20 Q 65,42 120,20" stroke={isDarkMode ? "#bae6fd" : "#3b82f6"} strokeWidth="0.8" strokeDasharray="2 1.5" opacity="0.7" fill="none" />
                <path d="M 18,27 Q 65,45 112,27" stroke={isDarkMode ? "#e0f2fe" : "#60a5fa"} strokeWidth="0.7" strokeDasharray="1.5 2" opacity="0.65" fill="none" />
                <path d="M 26,34 Q 65,47 104,34" stroke={isDarkMode ? "#fef08a" : "#2563eb"} strokeWidth="0.6" strokeDasharray="1 1" opacity="0.6" fill="none" />

                {/* Moon-like Craters inside the Boat Hull */}
                <circle cx="35" cy="29" r="3.8" fill={isDarkMode ? "#075985" : "#1e3a8a"} opacity="0.45" stroke={isDarkMode ? "#7dd3fc" : "#3b82f6"} strokeWidth="0.5" />
                <circle cx="65" cy="34" r="5.2" fill={isDarkMode ? "#075985" : "#1e3a8a"} opacity="0.5" stroke={isDarkMode ? "#7dd3fc" : "#3b82f6"} strokeWidth="0.6" />
                <circle cx="95" cy="28" r="4.0" fill={isDarkMode ? "#075985" : "#1e3a8a"} opacity="0.45" stroke={isDarkMode ? "#7dd3fc" : "#3b82f6"} strokeWidth="0.5" />

                {/* Shining Whitish-Yellow Crater Rim Highlights in Dark Mode */}
                {isDarkMode && (
                  <>
                    <path d="M 32,27 A 3,3 0 0,1 38,30" stroke="#fef9c3" strokeWidth="0.8" fill="none" opacity="0.85" />
                    <path d="M 60,31 A 4,4 0 0,1 69,35" stroke="#fef9c3" strokeWidth="0.9" fill="none" opacity="0.9" />
                    <path d="M 91,26 A 3,3 0 0,1 98,29" stroke="#fef9c3" strokeWidth="0.8" fill="none" opacity="0.85" />
                  </>
                )}

                {/* Stippled Rough Lunar Dust Speckles */}
                <circle cx="22" cy="25" r="0.8" fill={isDarkMode ? "#fef08a" : "#bfdbfe"} opacity="0.75" />
                <circle cx="48" cy="35" r="0.8" fill={isDarkMode ? "#ffffff" : "#93c5fd"} opacity="0.8" />
                <circle cx="78" cy="37" r="0.9" fill={isDarkMode ? "#fef08a" : "#bfdbfe"} opacity="0.75" />
                <circle cx="108" cy="24" r="0.8" fill={isDarkMode ? "#ffffff" : "#93c5fd"} opacity="0.8" />
              </g>

              {/* Wooden Plank / Edge Accent Lines */}
              <path d="M 18,25 C 42,37 88,37 112,25" stroke={isDarkMode ? "#e0f2fe" : "#bfdbfe"} strokeWidth="0.8" opacity="0.8" fill="none" />
              
              {/* Water Ripples around Boat (Shining Canvas Blue) */}
              <path d="M -12,35 C -2,30 8,38 18,35" stroke={isDarkMode ? "#38bdf8" : "#2563eb"} strokeWidth="1" opacity="0.8" fill="none" />
              <path d="M 112,35 C 122,30 132,38 142,35" stroke={isDarkMode ? "#38bdf8" : "#2563eb"} strokeWidth="1" opacity="0.8" fill="none" />

              {/* WOMAN (Sole figure holding wooden oar - stroke currentColor, non-blue) */}
              <g id="woman-figure" stroke="currentColor">
                {/* Head */}
                <circle
                  cx="65"
                  cy="-16"
                  r="5"
                  strokeWidth="1.2"
                  fill={isDarkMode ? "#0c0a09" : "#fafaf9"}
                />
                {/* Hair Bun */}
                <path d="M 61,-18 C 58,-16 59,-13 61,-12" strokeWidth="1.1" fill="none" />
                
                {/* Torso / A-line Dress */}
                <path
                  d="M 65,-11 L 55,18 L 75,18 Z"
                  strokeWidth="1.2"
                  fill={isDarkMode ? "#0c0a09" : "#fafaf9"}
                />

                {/* Oar / Paddle held in hands going down into water */}
                <line x1="65" y1="-3" x2="48" y2="10" strokeWidth="1.2" />
                <line x1="48" y1="10" x2="35" y2="40" strokeWidth="1.5" />
                <path d="M 31,36 L 39,44" strokeWidth="2.2" />
              </g>
            </g>
          </g>
        </g>

        {/* Birds / Sea Gulls Line Art in Sky */}
        <g stroke="currentColor" strokeWidth="1" opacity="0.6">
          <path d="M 320,120 Q 328,112 336,120 Q 344,112 352,120" />
          <path d="M 350,100 Q 356,94 362,100 Q 368,94 374,100" strokeWidth="0.8" />
          <path d="M 1240,110 Q 1248,102 1256,110 Q 1264,102 1272,110" />
          <path d="M 1280,90 Q 1285,85 1290,90 Q 1295,85 1300,90" strokeWidth="0.8" />
        </g>
      </svg>
    </div>
  );
}
