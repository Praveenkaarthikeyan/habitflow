import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Habits from "./pages/Habits.jsx";
import Learning from "./pages/Learning.jsx";
import TimeManagement from "./pages/TimeManagement.jsx";
import Expenses from "./pages/Expenses.jsx";
import Statistics from "./pages/Statistics.jsx";
import Friends from "./pages/Friends.jsx";
import Notifications from "./pages/Notifications.jsx";
import Profile from "./pages/Profile.jsx";
import Blogs from "./pages/Blogs.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";
import BlogEdit from "./pages/BlogEdit.jsx";
import MyBlogs from "./pages/MyBlogs.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Private: everything inside needs a valid login */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/time" element={<TimeManagement />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/blogs/:id/edit" element={<BlogEdit />} />
        <Route path="/my-blogs" element={<MyBlogs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}