export const days : [Date, string][] = 
    [
        [new Date("2025-09-28"), "Shashti ষষ্ঠী"], 
        [new Date("2025-09-29"), "Saptami সপ্তমী"], 
        [new Date("2025-09-30"), "Ashtami অষ্টমী"], 
        [new Date("2025-10-01"), "Navami নবমী"], 
        [new Date("2025-10-02"), "Dashami দশমী"], 
    ]

export function getDisplayDay(day: string): string {
    const target = new Date(day);
  
    // Try to find a matching entry in `days`
    const match = days.find(([date]) => date.toDateString() === target.toDateString());
  
    if (match) {
      return match[1];
    }
  
    // Fallback if no match
    return target.toDateString();
  }