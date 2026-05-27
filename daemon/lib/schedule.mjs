import cronParser from "cron-parser";

const { CronExpressionParser } = cronParser;

export function isDue(cronExpr, lastRunISO, now = new Date()) {
  try {
    // If never run, use start of today so we don't fire everything on first boot
    const currentDate = lastRunISO
      ? new Date(lastRunISO)
      : new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const cron = CronExpressionParser.parse(cronExpr, {
      currentDate,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    const next = cron.next().toDate();
    return now >= next;
  } catch {
    return false;
  }
}
