// All sample data removed. Lists start empty; real data arrives with the backend (Modules 4 and 5).

export const initialHabits = [];
export const initialGoals = [];
export const initialTasks = [];
export const initialExpenses = [];
export const initialFriends = [];
export const initialRequests = [];
export const initialNotifications = [];
export const monthlyTrend = [];
export const monthlyExpenses = [];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const weeklyProgress = DAYS.map((day) => ({ day, completed: 0, total: 0 }));
export const weeklyStudy = DAYS.map((day) => ({ day, hours: 0 }));

// Fixed options, not sample data. Keep these.
export const categories = ["Health", "Education", "Fitness", "Personal Development", "Productivity", "Lifestyle"];
export const expenseCategories = ["Food", "Transport", "Stationery", "Shopping", "Entertainment", "Subscriptions", "Other"];
export const monthlyBudget = 3000; // change this to your own budget

export const motivationalMessages = [
  "Small steps every day lead to big results.",
  "Consistency beats intensity. Show up today.",
  "Missed a day? No problem. Just start again.",
  "Progress, not perfection.",
];