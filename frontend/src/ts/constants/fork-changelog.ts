// What the FairyVR fork adds on top of upstream monkeytype. Newest first.
// Shown at the top of the version history modal (footer version button).
export type ForkChange = { date: string; text: string; issue?: number };

export const forkChangelog: ForkChange[] = [
  {
    date: "2026-11-23",
    text: "expert/master: multi-character input (mobile keyboards, autocorrect) can no longer hide a mistake",
  },
  {
    date: "2026-11-23",
    text: "opposite shift / stop on letter: a rejected last letter no longer ends the test",
  },
  {
    date: "2026-11-23",
    text: "the rest modal has a reset button per setting (also clears an invalid fps value)",
    issue: 8326,
  },
  {
    date: "2026-11-23",
    text: "saved texts modal has a search box to filter texts by name",
  },
  {
    date: "2026-11-23",
    text: "word filter previews the first 20 matching words under the count",
  },
  {
    date: "2026-11-23",
    text: "backend: PSA cache shares one in-flight fetch and retries after a failed fetch",
    issue: 8363,
  },
  {
    date: "2026-11-23",
    text: "font size is capped at 50 so extreme values can't break the layout",
    issue: 8454,
  },
  {
    date: "2026-11-23",
    text: 'word filter shows "Invalid regex" instead of failing silently',
    issue: 8422,
  },
  {
    date: "2026-11-22",
    text: "out of focus warning timeouts no longer pile up",
    issue: 8366,
  },
  {
    date: "2026-11-22",
    text: "word filter regex with g/y flags no longer skips matching words",
  },
  {
    date: "2026-11-22",
    text: "monkey power reset cancels the pending shake; particle colors are always valid",
    issue: 8362,
  },
  {
    date: "2026-11-22",
    text: "result word highlight no longer shows sliced html entities like &l",
    issue: 8365,
  },
];
