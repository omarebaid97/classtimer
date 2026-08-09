// ============================================================================
// CLASS TIMER — EDIT ME
// Everything a teacher would ever want to tweak lives in this one file.
// Times are "HH:MM" 24-hour, in whatever timezone the display device is set to.
// After editing, just refresh the page (or hard-refresh: Cmd/Ctrl+Shift+R).
// ============================================================================

// Which weekdays follow the schedule below. 0=Sun, 1=Mon, ... 6=Sat.
// Default assumption: Monday-Friday.
const SCHEDULE_DAYS = [0, 1, 2, 3, 4, 5];

// The phase template repeats for EVERY period, in this order, starting at
// that period's start time. `minutes` must be a positive number.
// A period's END time is computed automatically as
//   start time + (sum of all phase minutes below)
// so if you change durations here, every period's length updates too.
//
// ASSUMPTION: durations below currently sum to 90 minutes (matching the
// assumed 90-minute period length in PERIODS further down). Adjust freely —
// just know that changing the total here changes how long every period is.
const PHASE_TEMPLATE = [
  { name: "Welcome",             minutes: 10,  color: "#E52521", emoji: "🍄" }, // Mario red
  { name: "Basics",               minutes: 10, color: "#00A651", emoji: "🐢" }, // Luigi green
  { name: "Guided Practice",      minutes: 15, color: "#FBD000", emoji: "🍌" }, // banana yellow
  { name: "iReady",               minutes: 20, color: "#00A2E8", emoji: "🌟" }, // Toad blue
  { name: "Independent Practice", minutes: 20, color: "#7B2D8E", emoji: "👻" }, // Waluigi purple
  { name: "Exit Ticket",          minutes: 10, color: "#FF3F8E", emoji: "👑" }, // Peach pink
  { name: "Wrap-Up",              minutes: 10, color: "#FF8C00", emoji: "🏆" }, // star gold/orange
];

// One entry per period. `label` is shown on screen; `start` is when it
// begins. End time is derived from PHASE_TEMPLATE's total (see above).
// ASSUMPTION: 4 periods, 90 minutes each, with gaps between them for
// passing time / lunch. Add, remove, or retime periods freely — gaps
// between periods (and before/after the school day) automatically show a
// "Free Time" screen with a countdown to the next period.
const PERIODS = [
  { label: "Period 1", start: "08:00" },
  { label: "Period 2", start: "09:40" },
  { label: "Period 3", start: "11:50" },
  { label: "Period 4", start: "13:30" },
  { label: "Period X", start: "17:30" },
];

// A gap between two periods this long (in minutes) or longer is labeled
// "Lunch" on the Free Time screen instead of "Passing Period".
const FREE_LABEL_LUNCH_THRESHOLD_MIN = 25;

// Text shown in the browser tab / top of no-school & free screens.
const SITE_TITLE = "Class Timer 🏁";
