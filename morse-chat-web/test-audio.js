// Quick test of morse generation
const text = "SOS";
const wpm = 20;
const ditDuration = 1.2 / wpm; // 0.06 seconds

console.log("Testing SOS:");
console.log("- Dit duration:", ditDuration, "seconds");
console.log("- Expected pattern: 3 short (0.06s), 3 long (0.18s), 3 short (0.06s)");
console.log("- Gaps between elements:", ditDuration, "seconds");
console.log("- Gap between letters:", ditDuration * 3, "seconds");
