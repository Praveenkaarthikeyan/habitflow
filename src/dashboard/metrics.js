// Derived numbers shared by many widgets. Computed from the data passed in, never hardcoded.
export function buildMetrics(d) {
  const total = d.habits.length;
  const completed = d.habits.filter((h) => h.done).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  const tasksDone = d.tasks.filter((t) => t.done).length;
  const taskPct = d.tasks.length ? Math.round((tasksDone / d.tasks.length) * 100) : 0;

  const studyHours = d.weeklyStudy.reduce((s, x) => s + x.hours, 0);
  const studyPct = Math.min(100, Math.round((studyHours / 14) * 100)); // 14 h/week target

  const activeGoals = d.goals.filter((g) => g.status === "Active");
  const learningPct = activeGoals.length
    ? Math.round(activeGoals.reduce((s, g) => s + g.progress, 0) / activeGoals.length)
    : 0;

  const spent = d.expenses.reduce((s, e) => s + e.amount, 0);

  return {
    total, completed, percent,
    longestStreak: Math.max(0, ...d.habits.map((h) => h.streak)),
    bestEver: Math.max(0, ...d.habits.map((h) => h.longest)),
    tasksDone, taskPct, studyHours, studyPct,
    score: Math.round(percent * 0.4 + taskPct * 0.3 + studyPct * 0.3),
    activeGoals, learningPct,
    spent,
    budgetLeft: Math.max(0, d.monthlyBudget - spent),
    budgetUsed: Math.round((spent / d.monthlyBudget) * 100),
  };
}