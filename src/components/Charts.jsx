import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { useTheme } from "../context/ThemeContext.jsx";

const COLOR_PALETTE = ["#6366f1", "#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#a855f7", "#14b8a6"];
const MONO_LIGHT = ["#111111", "#666666", "#999999", "#333333", "#bbbbbb", "#777777", "#555555"];
const MONO_DARK = ["#f5f5f5", "#b0b0b0", "#7a7a7a", "#d4d4d4", "#5a5a5a", "#9a9a9a", "#e8e8e8"];

function usePalette() {
  const { theme, accent } = useTheme();
  if (accent !== "mono") return COLOR_PALETTE;
  return theme === "dark" ? MONO_DARK : MONO_LIGHT;
}

export function SimpleBarChart({ data, xKey, bars }) {
  const colors = usePalette();
  return (
    <div className="chart-box">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b855" />
          <XAxis dataKey={xKey} stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          {bars.length > 1 && <Legend />}
          {bars.map((b, i) => (
            <Bar key={b.key} dataKey={b.key} name={b.name} fill={colors[i]} radius={[6, 6, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SimpleLineChart({ data, xKey, yKey, name }) {
  const colors = usePalette();
  return (
    <div className="chart-box">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b855" />
          <XAxis dataKey={xKey} stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Line type="monotone" dataKey={yKey} name={name} stroke={colors[0]} strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SimplePieChart({ data, nameKey, valueKey }) {
  const colors = usePalette();
  return (
    <div className="chart-box">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey={valueKey} nameKey={nameKey} outerRadius="70%" label>
            {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}