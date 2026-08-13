// ============================================================================
// CLASS TIMER — logic + rendering. You shouldn't need to edit this file;
// schedule changes belong in config.js.
// ============================================================================

function toSec(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 3600 + m * 60;
}

function styleFor(phaseName) {
  return PHASE_STYLES[phaseName] || DEFAULT_PHASE_STYLE;
}

// Periods with derived end times + per-phase offsets, sorted by start time.
// Each period supplies its own phase list (name + minutes); color/emoji are
// looked up by name from PHASE_STYLES.
const PERIODS_SEC = PERIODS
  .map((p) => {
    const startSec = toSec(p.start);
    let cursor = startSec;
    const phases = p.phases.map((phase, i) => {
      const phaseStart = cursor;
      const phaseEnd = cursor + phase.minutes * 60;
      cursor = phaseEnd;
      return { ...phase, ...styleFor(phase.name), index: i, startSec: phaseStart, endSec: phaseEnd };
    });
    return { label: p.label, startSec, endSec: cursor, phases };
  })
  .sort((a, b) => a.startSec - b.startSec);

function nowSecondsOfDay(d) {
  return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds() + d.getMilliseconds() / 1000;
}

function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  r.setHours(0, 0, 0, 0);
  return r;
}

// Finds the next school day (strictly after `fromDate`'s day) whose weekday
// is in SCHEDULE_DAYS, and returns a Date at that day's first period start.
function nextSchoolDayFirstPeriod(fromDate) {
  for (let d = 1; d <= 14; d++) {
    const candidate = addDays(fromDate, d);
    if (SCHEDULE_DAYS.includes(candidate.getDay())) {
      candidate.setSeconds(PERIODS_SEC[0].startSec);
      return candidate;
    }
  }
  return null; // no school days configured
}

function fmtClock(totalSec) {
  totalSec = Math.max(0, Math.ceil(totalSec));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.floor(totalSec % 60);
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function fmtClockFromDate(targetDate, fromDate) {
  return fmtClock((targetDate.getTime() - fromDate.getTime()) / 1000);
}

function fmtWallClock(d) {
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

function getStatus(now) {
  const weekday = now.getDay();
  const secNow = nowSecondsOfDay(now);

  if (!SCHEDULE_DAYS.includes(weekday)) {
    return { mode: "no-school", nextDate: nextSchoolDayFirstPeriod(now) };
  }

  for (const period of PERIODS_SEC) {
    if (secNow >= period.startSec && secNow < period.endSec) {
      const phase = period.phases.find((ph) => secNow >= ph.startSec && secNow < ph.endSec);
      const nextPhase = period.phases[phase.index + 1] || null;
      return {
        mode: "phase",
        period,
        phase,
        remainingSec: phase.endSec - secNow,
        nextPhase,
      };
    }
  }

  if (secNow < PERIODS_SEC[0].startSec) {
    const target = new Date(now);
    target.setHours(0, 0, 0, 0);
    target.setSeconds(PERIODS_SEC[0].startSec);
    return {
      mode: "free",
      label: "Before School",
      nextLabel: PERIODS_SEC[0].label,
      target,
    };
  }

  const last = PERIODS_SEC[PERIODS_SEC.length - 1];
  if (secNow >= last.endSec) {
    return {
      mode: "free",
      label: "School's Out",
      nextLabel: "Tomorrow",
      target: nextSchoolDayFirstPeriod(now),
      crossDay: true,
    };
  }

  for (let i = 0; i < PERIODS_SEC.length - 1; i++) {
    const cur = PERIODS_SEC[i];
    const nxt = PERIODS_SEC[i + 1];
    if (secNow >= cur.endSec && secNow < nxt.startSec) {
      const gapMin = (nxt.startSec - cur.endSec) / 60;
      const target = new Date(now);
      target.setHours(0, 0, 0, 0);
      target.setSeconds(nxt.startSec);
      return {
        mode: "free",
        label: gapMin >= FREE_LABEL_LUNCH_THRESHOLD_MIN ? "Lunch" : "Passing Period",
        nextLabel: nxt.label,
        target,
      };
    }
  }

  // Fallback (shouldn't happen given the checks above).
  return { mode: "no-school", nextDate: nextSchoolDayFirstPeriod(now) };
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

const root = document.getElementById("root");
document.title = SITE_TITLE;

function render() {
  const now = new Date();
  const status = getStatus(now);

  if (status.mode === "phase") {
    renderPhase(status, now);
  } else if (status.mode === "free") {
    renderFree(status, now);
  } else {
    renderNoSchool(status, now);
  }
}

function setBg(color) {
  document.body.style.setProperty("--bg", color);
}

function renderPhase(status, now) {
  const { period, phase, remainingSec, nextPhase } = status;
  setBg(phase.color);
  const pct = Math.min(100, Math.max(0, (1 - remainingSec / (phase.endSec - phase.startSec)) * 100));

  root.innerHTML = `
    <div class="screen phase-screen">
      <div class="topbar">
        <span class="badge">${period.label}</span>
        <span class="badge">Lap ${phase.index + 1} / ${period.phases.length}</span>
        <span class="badge wallclock">${fmtWallClock(now)}</span>
      </div>
      <div class="center">
        <div class="phase-emoji">${phase.emoji}</div>
        <div class="phase-name">${phase.name}</div>
        <div class="clock">${fmtClock(remainingSec)}</div>
        ${nextPhase ? `<div class="next-line">Next: ${nextPhase.emoji} ${nextPhase.name}</div>` : `<div class="next-line">🏆 Final phase of ${period.label}</div>`}
      </div>
      <div class="track">
        <div class="track-fill" style="width:${pct}%"></div>
        <div class="kart" style="left:${pct}%">🏎️</div>
      </div>
    </div>
  `;
}

function renderFree(status, now) {
  setBg("#1b1f2a");
  root.innerHTML = `
    <div class="screen free-screen">
      <div class="topbar">
        <span class="badge wallclock">${fmtWallClock(now)}</span>
      </div>
      <div class="center">
        <div class="phase-emoji">🏁</div>
        <div class="phase-name">${status.label}</div>
        <div class="clock small">${fmtClockFromDate(status.target, now)}</div>
        <div class="next-line">until ${status.nextLabel}</div>
      </div>
    </div>
  `;
}

function renderNoSchool(status, now) {
  setBg("#0d1117");
  root.innerHTML = `
    <div class="screen free-screen">
      <div class="topbar">
        <span class="badge wallclock">${fmtWallClock(now)}</span>
      </div>
      <div class="center">
        <div class="phase-emoji">🏆</div>
        <div class="phase-name">No School Today</div>
        ${status.nextDate ? `
          <div class="clock small">${fmtClockFromDate(status.nextDate, now)}</div>
          <div class="next-line">until ${status.nextDate.toLocaleDateString(undefined, { weekday: "long" })}'s first period</div>
        ` : `<div class="next-line">No upcoming school days configured</div>`}
      </div>
    </div>
  `;
}

setInterval(render, 250);
render();

// Fullscreen toggle
const fsBtn = document.getElementById("fs-btn");
fsBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
});
