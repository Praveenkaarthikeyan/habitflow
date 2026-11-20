// TEMPORARY DATA: replaced by real API calls in Modules 4 and 5.

export const initialHabits = [
  { id: 1, title: "Morning Workout", category: "Fitness", frequency: "Daily", description: "30 minutes of exercise", streak: 6, longest: 14, done: true },
  { id: 2, title: "Read 20 Pages", category: "Education", frequency: "Daily", description: "Any non-fiction book", streak: 3, longest: 9, done: false },
  { id: 3, title: "Drink 3L Water", category: "Health", frequency: "Daily", description: "Stay hydrated", streak: 11, longest: 11, done: true },
  { id: 4, title: "Code for 1 Hour", category: "Productivity", frequency: "Daily", description: "Practice DSA or projects", streak: 8, longest: 20, done: false },
  { id: 5, title: "Meditate", category: "Personal Development", frequency: "Weekly", description: "10 minutes, 4x a week", streak: 2, longest: 5, done: false },
];

export const categories = ["Health", "Education", "Fitness", "Personal Development", "Productivity", "Lifestyle"];

export const weeklyProgress = [
  { day: "Mon", completed: 4, total: 5 },
  { day: "Tue", completed: 5, total: 5 },
  { day: "Wed", completed: 3, total: 5 },
  { day: "Thu", completed: 4, total: 5 },
  { day: "Fri", completed: 2, total: 5 },
  { day: "Sat", completed: 5, total: 5 },
  { day: "Sun", completed: 3, total: 5 },
];

export const monthlyTrend = [
  { month: "Jun", rate: 52 }, { month: "Jul", rate: 61 }, { month: "Aug", rate: 58 },
  { month: "Sep", rate: 70 }, { month: "Oct", rate: 74 }, { month: "Nov", rate: 79 },
];

export const initialGoals = [
  { id: 1, title: "Java Programming", category: "Programming", progress: 65, deadline: "2026-12-15", status: "Active", notes: "Finished collections, starting streams." },
  { id: 2, title: "Data Structures & Algorithms", category: "Computer Science", progress: 40, deadline: "2027-01-30", status: "Active", notes: "Arrays and linked lists done." },
  { id: 3, title: "Full-Stack Development", category: "Web Development", progress: 15, deadline: "2027-03-01", status: "Active", notes: "Learning React basics." },
  { id: 4, title: "Python Basics", category: "Programming", progress: 100, deadline: "2026-10-01", status: "Completed", notes: "Done!" },
];

export const weeklyStudy = [
  { day: "Mon", hours: 2 }, { day: "Tue", hours: 3 }, { day: "Wed", hours: 1.5 },
  { day: "Thu", hours: 2.5 }, { day: "Fri", hours: 1 }, { day: "Sat", hours: 4 }, { day: "Sun", hours: 2 },
];

export const initialTasks = [
  { id: 1, title: "Finish DBMS assignment", priority: "High", category: "College", deadline: "2026-11-18", done: false },
  { id: 2, title: "Solve 3 LeetCode problems", priority: "Medium", category: "Learning", deadline: "2026-11-16", done: true },
  { id: 3, title: "Prepare React notes", priority: "Low", category: "Learning", deadline: "2026-11-20", done: false },
  { id: 4, title: "Submit lab record", priority: "High", category: "College", deadline: "2026-11-17", done: false },
];

export const initialExpenses = [
  { id: 1, title: "Canteen lunch", amount: 120, category: "Food", date: "2026-11-15" },
  { id: 2, title: "Metro pass", amount: 400, category: "Transport", date: "2026-11-12" },
  { id: 3, title: "Notebooks", amount: 250, category: "Stationery", date: "2026-11-10" },
  { id: 4, title: "Movie night", amount: 350, category: "Entertainment", date: "2026-11-08" },
  { id: 5, title: "Music subscription", amount: 119, category: "Subscriptions", date: "2026-11-05" },
];

export const expenseCategories = ["Food", "Transport", "Stationery", "Shopping", "Entertainment", "Subscriptions", "Other"];
export const monthlyBudget = 3000;

export const monthlyExpenses = [
  { month: "Jun", total: 2400 }, { month: "Jul", total: 2750 }, { month: "Aug", total: 2200 },
  { month: "Sep", total: 3100 }, { month: "Oct", total: 2650 }, { month: "Nov", total: 1239 },
];

export const initialFriends = [
  { id: 1, name: "Aarav Sharma", habitRate: 88, learning: 72, points: 1420 },
  { id: 2, name: "Priya Nair", habitRate: 92, learning: 65, points: 1510 },
  { id: 3, name: "Rohan Mehta", habitRate: 70, learning: 80, points: 1190 },
];

export const initialRequests = [
  { id: 101, name: "Sneha Iyer" },
  { id: 102, name: "Karthik R" },
];

export const initialNotifications = [
  { id: 1, type: "Habit", text: "Time for 'Read 20 Pages'.", time: "10 min ago", read: false },
  { id: 2, type: "Task", text: "'Submit lab record' is due tomorrow.", time: "1 hr ago", read: false },
  { id: 3, type: "Budget", text: "You have used 41% of your monthly budget.", time: "Yesterday", read: true },
  { id: 4, type: "Friend", text: "Sneha Iyer sent you a friend request.", time: "Yesterday", read: false },
  { id: 5, type: "Achievement", text: "You earned the 'Seven-Day Streak' badge! 🎉", time: "2 days ago", read: true },
];

export const motivationalMessages = [
  "Small steps every day lead to big results.",
  "Consistency beats intensity. Show up today.",
  "Missed a day? No problem. Just start again.",
  "Progress, not perfection.",
];