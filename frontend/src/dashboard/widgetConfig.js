// Widget CONFIGURATION only. No JSX here. Rendering lives in widgetRegistry.jsx.

// Grid units: 12 columns on desktop. Row height is ~56px (see Dashboard.jsx).
const KINDS = {
  stat:  { w: 3, h: 2, minW: 2, minH: 2, maxW: 6,  maxH: 3 },
  list:  { w: 4, h: 4, minW: 3, minH: 3, maxW: 12, maxH: 8 },
  chart: { w: 6, h: 4, minW: 3, minH: 3, maxW: 12, maxH: 7 },
};

export const CATEGORIES = ["Productivity", "Habits", "Learning", "Time Management", "Expenses", "Social", "General"];

const defs = [
  // Productivity
  { id: "productivityScore", name: "Daily Productivity Score", icon: "⚡", category: "Productivity", kind: "stat", description: "One score from habits, tasks and study time." },
  { id: "weeklyProductivity", name: "Weekly Productivity Chart", icon: "📊", category: "Productivity", kind: "chart", description: "Habits completed each day this week." },
  { id: "monthlyOverview", name: "Monthly Productivity Overview", icon: "📈", category: "Productivity", kind: "chart", description: "Habit completion rate over recent months." },
  { id: "dailyCompletion", name: "Daily Completion Percentage", icon: "🎯", category: "Productivity", kind: "stat", description: "How much of today's habit list is done." },
  // Habits
  { id: "todayHabits", name: "Today's Habits", icon: "✅", category: "Habits", kind: "list", description: "Tick off your habits for today." },
  { id: "activeHabits", name: "Active Habits", icon: "🌱", category: "Habits", kind: "stat", description: "How many habits you are tracking." },
  { id: "currentStreak", name: "Current Streak", icon: "🔥", category: "Habits", kind: "stat", description: "Your best running streak right now." },
  { id: "longestStreak", name: "Longest Streak", icon: "🏆", category: "Habits", kind: "stat", description: "Your all-time longest streak." },
  { id: "habitCalendar", name: "Habit Completion Calendar", icon: "🗓️", category: "Habits", kind: "list", h: 5, description: "This month at a glance (sample data)." },
  { id: "habitConsistency", name: "Habit Consistency Chart", icon: "📶", category: "Habits", kind: "chart", description: "Current vs best streak for each habit." },
  // Learning
  { id: "learningGoals", name: "Learning Goals", icon: "📚", category: "Learning", kind: "list", description: "Active goals with progress bars." },
  { id: "learningProgress", name: "Learning Progress", icon: "🎓", category: "Learning", kind: "stat", description: "Average progress across active goals." },
  { id: "studyTime", name: "Study Time Summary", icon: "⏱️", category: "Learning", kind: "stat", description: "Hours studied this week." },
  { id: "learningStreak", name: "Learning Streak", icon: "📅", category: "Learning", kind: "stat", description: "Consecutive days you studied." },
  { id: "skillProgress", name: "Skill Progress Chart", icon: "🧠", category: "Learning", kind: "chart", description: "Progress compared across skills." },
  // Time management
  { id: "todayTasks", name: "Today's Tasks", icon: "📝", category: "Time Management", kind: "list", description: "Pending tasks you can tick off." },
  { id: "upcomingDeadlines", name: "Upcoming Deadlines", icon: "⏰", category: "Time Management", kind: "list", description: "Next deadlines, soonest first." },
  { id: "completedTasks", name: "Completed Tasks", icon: "☑️", category: "Time Management", kind: "stat", description: "Tasks finished out of the total." },
  { id: "studySessions", name: "Study Sessions", icon: "🧑‍💻", category: "Time Management", kind: "list", description: "Your recent study sessions." },
  { id: "weeklyStudyHours", name: "Weekly Study Hours", icon: "🕒", category: "Time Management", kind: "chart", description: "Study hours for each day." },
  // Expenses
  { id: "monthlyExpenses", name: "Monthly Expenses", icon: "💸", category: "Expenses", kind: "stat", description: "Total spent this month." },
  { id: "remainingBudget", name: "Remaining Budget", icon: "🏦", category: "Expenses", kind: "stat", description: "Budget left for the month." },
  { id: "expenseBreakdown", name: "Expense Category Breakdown", icon: "🥧", category: "Expenses", kind: "chart", description: "Where your money goes." },
  { id: "recentTransactions", name: "Recent Transactions", icon: "🧾", category: "Expenses", kind: "list", w: 6, description: "Your latest expenses." },
  // Social
  { id: "leaderboard", name: "Friends Leaderboard", icon: "🥇", category: "Social", kind: "list", description: "Points ranking among friends." },
  { id: "friendsActivity", name: "Friends Activity", icon: "👥", category: "Social", kind: "list", description: "What your friends are up to." },
  { id: "achievements", name: "Recent Achievements", icon: "🏅", category: "Social", kind: "list", description: "Badges you earned lately." },
  // General
  { id: "recentActivity", name: "Recent Activity", icon: "🕘", category: "General", kind: "list", description: "Your latest actions." },
  { id: "notifications", name: "Notifications", icon: "🔔", category: "General", kind: "list", description: "Newest notifications, unread first." },
  { id: "quote", name: "Motivational Quote", icon: "💬", category: "General", kind: "stat", w: 4, description: "A daily push to keep going." },
  { id: "quickActions", name: "Quick Actions", icon: "🚀", category: "General", kind: "list", h: 3, description: "Shortcuts to common pages." },
];

export const WIDGETS = Object.fromEntries(defs.map((d) => [d.id, { ...KINDS[d.kind], ...d }]));
export const WIDGET_LIST = defs.map((d) => WIDGETS[d.id]);

export const SIZE_PRESETS = {
  S: { label: "Small", w: 3, h: 2 },
  M: { label: "Medium", w: 4, h: 3 },
  L: { label: "Large", w: 6, h: 4 },
  XL: { label: "Extra Large", w: 12, h: 5 },
};

// Keeps a size inside the widget's min/max and the available columns.
export function clampSize(id, w, h, cols = 12) {
  const c = WIDGETS[id];
  const minW = Math.min(c.minW, cols);
  const maxW = Math.min(c.maxW, cols);
  return {
    w: Math.max(minW, Math.min(maxW, w)),
    h: Math.max(c.minH, Math.min(c.maxH, h)),
  };
}