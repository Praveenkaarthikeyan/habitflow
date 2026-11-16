import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Habits from "./pages/Habits.jsx";
import Learning from "./pages/Learning.jsx";
import TimeManagement from "./pages/TimeManagement.jsx";
import Expenses from "./pages/Expenses.jsx";
import Statistics from "./pages/Statistics.jsx";
import Friends from "./pages/Friends.jsx";
import Notifications from "./pages/Notifications.jsx";
import Profile from "./pages/Profile.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/time" element={<TimeManagement />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}