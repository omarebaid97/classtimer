// ============================================================================
// CLASS TIMER — EDIT ME
// Everything a teacher would ever want to tweak lives in this one file.
// Times are "HH:MM" 24-hour, in whatever timezone the display device is set to.
// After editing, just refresh the page (or hard-refresh: Cmd/Ctrl+Shift+R).
// ============================================================================

// Which weekdays follow the schedule below. 0=Sun, 1=Mon, ... 6=Sat.
const SCHEDULE_DAYS = [1, 2, 3, 4, 5];

// Color + emoji per phase name, looked up by name wherever it's used in
// PERIODS below — so every class's "Concept" phase looks the same without
// repeating colors everywhere. Rename a phase in PERIODS and it'll fall
// back to DEFAULT_PHASE_STYLE unless you add a matching entry here too.
const PHASE_STYLES = {
  "Do Now":            { color: "#E52521", emoji: "🍄" }, // Mario red
  "Do Now & Fluency":  { color: "#E52521", emoji: "🍄" }, // Mario red
  "iReady - Fluency":  { color: "#00A2E8", emoji: "🌟" }, // Toad blue
  "iReady - My Path":  { color: "#0059B3", emoji: "🧭" }, // deeper blue
  "Concept":           { color: "#00A651", emoji: "🐢" }, // Luigi green
  "Prob Set":          { color: "#FBD000", emoji: "🍌" }, // banana yellow
  "Exit Ticket":       { color: "#FF3F8E", emoji: "👑" }, // Peach pink
  "Pack Up":           { color: "#FF8C00", emoji: "🏆" }, // star gold/orange
};
const DEFAULT_PHASE_STYLE = { color: "#7B2D8E", emoji: "⭐" }; // Waluigi purple, used for any unrecognized phase name

// One entry per class period. `label` shows on screen. Each class has its
// OWN phase list (name + minutes) since your classes don't all run the
// same timing — e.g. Class 1/2's "Do Now" is 20 min but Class 3's is only
// 10 min. A period's end time is computed automatically as its start time
// + the sum of its own phases' minutes, so class length updates on its own
// if you change a phase's duration.
const PERIODS = [
  {
    label: "Class 1",
    start: "07:25",
    phases: [
      { name: "Do Now & Fluency", minutes: 20 },
      { name: "iReady - Fluency", minutes: 10 },
      { name: "iReady - My Path", minutes: 10 },
      { name: "Concept",          minutes: 10 },
      { name: "Prob Set",         minutes: 15 },
      { name: "Exit Ticket",      minutes: 15 },
      { name: "Pack Up",          minutes: 5 },
    ],
  },
  {
    label: "Class 2",
    start: "11:00",
    phases: [
      { name: "Do Now",           minutes: 20 },
      { name: "iReady - Fluency", minutes: 10 },
      { name: "iReady - My Path", minutes: 10 },
      { name: "Concept",          minutes: 10 },
      { name: "Prob Set",         minutes: 15 },
      { name: "Exit Ticket",      minutes: 15 },
      { name: "Pack Up",          minutes: 5 },
    ],
  },
  {
    label: "Class 3",
    start: "12:30",
    phases: [
      { name: "Do Now",           minutes: 10 },
      { name: "iReady - Fluency", minutes: 10 },
      { name: "iReady - My Path", minutes: 15 },
      { name: "Concept",          minutes: 15 },
      { name: "Prob Set",         minutes: 15 },
      { name: "Exit Ticket",      minutes: 15 },
      { name: "Pack Up",          minutes: 5 },
    ],
  },
  {
    label: "Class 4",
    start: "14:00",
    phases: [
      { name: "Do Now",           minutes: 15 },
      { name: "iReady - Fluency", minutes: 10 },
      { name: "iReady - My Path", minutes: 10 },
      { name: "Concept",          minutes: 10 },
      { name: "Prob Set",         minutes: 15 },
      { name: "Exit Ticket",      minutes: 15 },
      { name: "Pack Up",          minutes: 5 },
    ],
  },
];

// A gap between two periods this long (in minutes) or longer is labeled
// "Lunch" on the Free Time screen instead of "Passing Period".
const FREE_LABEL_LUNCH_THRESHOLD_MIN = 25;

// Text shown in the browser tab / top of no-school & free screens.
const SITE_TITLE = "Class Timer 🏁";
