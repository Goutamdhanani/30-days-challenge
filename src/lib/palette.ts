export type DayPalette = {
    from: string;   // gradient start
    to: string;     // gradient end
    ring: string;   // glow ring color
    text: string;   // text color
    tileBg: string; // icon tile bg
  };
  
  /**
   * Procedural palette: hue 160 -> 270 across 30 days.
   */
  export function dayPalette(i: number): DayPalette {
    const t = i / 29; // 0..1
    const hue = 160 + t * 110; // 160..270
    const hue2 = hue + 12;
    const from = `hsl(${hue.toFixed(0)} 75% 45%)`;
    const to = `hsl(${hue2.toFixed(0)} 70% 55%)`;
    const ring = `hsl(${hue.toFixed(0)} 90% 65%)`;
    return {
      from,
      to,
      ring,
      text: "rgba(237,237,237,0.95)",
      tileBg: `linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))`
    };
  }