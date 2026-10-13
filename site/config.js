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
  "Do Now":                      { color: "#E52521", emoji: "🍄" }, // Mario red
  "Check Do Now":                { color: "#B71C1C", emoji: "✅" }, // deeper red — checking the Do Now
  "Fluency":                     { color: "#00A2E8", emoji: "🌟" }, // Toad blue
  "Check Fluency":               { color: "#0059B3", emoji: "✅" }, // deeper blue — checking Fluency
  "A/I Block":                   { color: "#00A651", emoji: "🐢" }, // Luigi green
  "Intro & Model":               { color: "#FBD000", emoji: "🍌" }, // banana yellow
  "Partner Practice":            { color: "#6A1B9A", emoji: "👥" }, // purple
  "Chromebooks + Scratch Paper": { color: "#00838F", emoji: "💻" }, // teal
  "Exit Ticket":                 { color: "#FF3F8E", emoji: "👑" }, // Peach pink
  "Pack Up":                     { color: "#FF8C00", emoji: "🏆" }, // star gold/orange
};
const DEFAULT_PHASE_STYLE = { color: "#7B2D8E", emoji: "⭐" }; // Waluigi purple, used for any unrecognized phase name

// One entry per class period. `label` shows on screen. This is the schedule
// for Monday-Thursday (and for any weekday not listed in DAY_OVERRIDES below).
// Periods 1, 3 and 4 run the same 85-minute phase list (name + minutes);
// Period 5 is shortened to 80 minutes (Fluency, Intro & Model and Partner
// Practice are a bit shorter) so the day ends at 3:20 PM. The school periods
// are 1, 3, 4, and 5 (there is no period 2), labeled by house. A period's end
// time is computed automatically as its start time + the sum of the phases'
// minutes, so class length updates on its own if you change a phase's
// duration.
const PERIODS = [
  {
    label: "Period 1 - Cornell",
    start: "07:25",
    phases: [
      { name: "Do Now",                      minutes: 5 },
      { name: "Check Do Now",                minutes: 2 },
      { name: "Fluency",                     minutes: 5 },
      { name: "Check Fluency",               minutes: 2 },
      { name: "A/I Block",                   minutes: 20 },
      { name: "Intro & Model",               minutes: 11 },
      { name: "Partner Practice",            minutes: 20 },
      { name: "Chromebooks + Scratch Paper", minutes: 5 },
      { name: "Exit Ticket",                 minutes: 10 },
      { name: "Pack Up",                     minutes: 5 },
    ],
  },
  {
    label: "Period 3 - Brown",
    start: "11:00",
    phases: [
      { name: "Do Now",                      minutes: 5 },
      { name: "Check Do Now",                minutes: 2 },
      { name: "Fluency",                     minutes: 5 },
      { name: "Check Fluency",               minutes: 2 },
      { name: "A/I Block",                   minutes: 20 },
      { name: "Intro & Model",               minutes: 11 },
      { name: "Partner Practice",            minutes: 20 },
      { name: "Chromebooks + Scratch Paper", minutes: 5 },
      { name: "Exit Ticket",                 minutes: 10 },
      { name: "Pack Up",                     minutes: 5 },
    ],
  },
  {
    label: "Period 4 - UT",
    start: "12:30",
    phases: [
      { name: "Do Now",                      minutes: 5 },
      { name: "Check Do Now",                minutes: 2 },
      { name: "Fluency",                     minutes: 5 },
      { name: "Check Fluency",               minutes: 2 },
      { name: "A/I Block",                   minutes: 20 },
      { name: "Intro & Model",               minutes: 11 },
      { name: "Partner Practice",            minutes: 20 },
      { name: "Chromebooks + Scratch Paper", minutes: 5 },
      { name: "Exit Ticket",                 minutes: 10 },
      { name: "Pack Up",                     minutes: 5 },
    ],
  },
  {
    label: "Period 5 - Duke",
    start: "14:00",
    phases: [
      { name: "Do Now",                      minutes: 5 },
      { name: "Check Do Now",                minutes: 2 },
      { name: "Fluency",                     minutes: 4 },
      { name: "Check Fluency",               minutes: 2 },
      { name: "A/I Block",                   minutes: 20 },
      { name: "Intro & Model",               minutes: 9 },
      { name: "Partner Practice",            minutes: 18 },
      { name: "Chromebooks + Scratch Paper", minutes: 5 },
      { name: "Exit Ticket",                 minutes: 10 },
      { name: "Pack Up",                     minutes: 5 },
    ],
  },
];

// Weekdays that run a DIFFERENT schedule from PERIODS above. Any weekday
// listed here (0=Sun, 1=Mon, ... 6=Sat) uses its own full list of periods
// instead of PERIODS; every other weekday keeps using PERIODS. Each list is
// written exactly like PERIODS (label, start, phases). Friday (5) is a short
// day: four 65-minute periods with no A/I Block. Remember the day must ALSO
// be in SCHEDULE_DAYS at the top of this file, or it is treated as no school.
// To drop the Friday schedule, delete the `5: [...]` entry.
const DAY_OVERRIDES = {
  5: [
    {
      label: "Period 1 - Cornell",
      start: "08:00",
      phases: [
        { name: "Do Now",                      minutes: 5 },
        { name: "Check Do Now",                minutes: 2 },
        { name: "Fluency",                     minutes: 5 },
        { name: "Check Fluency",               minutes: 2 },
        { name: "Intro & Model",               minutes: 11 },
        { name: "Partner Practice",            minutes: 20 },
        { name: "Chromebooks + Scratch Paper", minutes: 5 },
        { name: "Exit Ticket",                 minutes: 10 },
        { name: "Pack Up",                     minutes: 5 },
      ],
    },
    {
      label: "Period 3 - Brown",
      start: "11:00",
      phases: [
        { name: "Do Now",                      minutes: 5 },
        { name: "Check Do Now",                minutes: 2 },
        { name: "Fluency",                     minutes: 5 },
        { name: "Check Fluency",               minutes: 2 },
        { name: "Intro & Model",               minutes: 11 },
        { name: "Partner Practice",            minutes: 20 },
        { name: "Chromebooks + Scratch Paper", minutes: 5 },
        { name: "Exit Ticket",                 minutes: 10 },
        { name: "Pack Up",                     minutes: 5 },
      ],
    },
    {
      label: "Period 4 - UT",
      start: "12:05",
      phases: [
        { name: "Do Now",                      minutes: 5 },
        { name: "Check Do Now",                minutes: 2 },
        { name: "Fluency",                     minutes: 5 },
        { name: "Check Fluency",               minutes: 2 },
        { name: "Intro & Model",               minutes: 11 },
        { name: "Partner Practice",            minutes: 20 },
        { name: "Chromebooks + Scratch Paper", minutes: 5 },
        { name: "Exit Ticket",                 minutes: 10 },
        { name: "Pack Up",                     minutes: 5 },
      ],
    },
    {
      label: "Period 5 - Duke",
      start: "13:15",
      phases: [
        { name: "Do Now",                      minutes: 5 },
        { name: "Check Do Now",                minutes: 2 },
        { name: "Fluency",                     minutes: 5 },
        { name: "Check Fluency",               minutes: 2 },
        { name: "Intro & Model",               minutes: 11 },
        { name: "Partner Practice",            minutes: 20 },
        { name: "Chromebooks + Scratch Paper", minutes: 5 },
        { name: "Exit Ticket",                 minutes: 10 },
        { name: "Pack Up",                     minutes: 5 },
      ],
    },
  ],
};

// A gap between two periods this long (in minutes) or longer is labeled
// "Lunch" on the Free Time screen instead of "Passing Period".
const FREE_LABEL_LUNCH_THRESHOLD_MIN = 25;

// Text shown in the browser tab / top of no-school & free screens.
const SITE_TITLE = "Class Timer 🏁";

// How loud the synthesized sound effects play, from 0 (silent) to 1 (max).
// Classroom speakers are usually loud, so start low and nudge up if needed.
const SOUND_VOLUME = 0.25;

// Whether the on-screen 🔊 sound toggle starts in the "on" position when the
// page first loads. Even when true, the browser still requires one click
// (the sound button, the fullscreen button, or a tap anywhere on screen)
// before it will actually let sound play — that's a browser rule, not a bug.
const SOUND_ON_BY_DEFAULT = true;

// How many seconds of "tick" sound effects play counting down to the end of
// a phase (e.g. 10 = ticks at 10, 9, 8, ... 1 second left). Set to 0 to turn
// the countdown ticking off entirely.
const COUNTDOWN_TICK_SECONDS = 10;
