"use client";

import { useState, useEffect, JSX } from "react";
import {
  Leaf,
  LogOut,
  AlertTriangle,
  Shield,
  BarChart3,
  Download,
  Bell,
  Settings,
  User,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase_client";


type DiagnosisData = {
  date: string;
  diseased: number;
  healthy: number;
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name?: string } | null>(
    null
  );
  const [diseasedCount, setDiseasedCount] = useState(0);
  const [healthyCount, setHealthyCount] = useState(0);
  const [chartData, setChartData] = useState<DiagnosisData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        router.push("/auth");
        return;
      }

      const session = data.session;
      setUser({
        email: session.user.email ?? "",
        name: session.user.user_metadata?.name || undefined,
      });
    };

    getSession();
  }, [router]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("diagnosis_results")
        .select("diseased, created_at")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        return;
      }

      // Diagnosis counts
      const diseased = data.filter((item) => item.diseased === "Yes").length;
      const healthy = data.filter((item) => item.diseased === "No").length;
      setDiseasedCount(diseased);
      setHealthyCount(healthy);

      // Chart Data Grouping
      const countsPerDay: {
        [key: string]: { diseased: number; healthy: number };
      } = {};
      data.forEach((item) => {
        const date = new Date(item.created_at).toISOString().split("T")[0];
        if (!countsPerDay[date]) {
          countsPerDay[date] = { diseased: 0, healthy: 0 };
        }
        if (item.diseased === "Yes") countsPerDay[date].diseased += 1;
        else if (item.diseased === "No") countsPerDay[date].healthy += 1;
      });

      const formattedChartData = Object.entries(countsPerDay).map(
        ([date, counts]) => ({
          date,
          diseased: counts.diseased,
          healthy: counts.healthy,
        })
      );
      setChartData(formattedChartData);
     
      setLoading(false);
    };

    fetchAllData();
  }, []);

  const totalDiagnoses = diseasedCount + healthyCount;
  const diseaseRate =
    totalDiagnoses > 0
      ? ((diseasedCount / totalDiagnoses) * 100).toFixed(1)
      : "0";

  const pieData = [
    { name: "Healthy", value: healthyCount, color: "#10B981" },
    { name: "Diseased", value: diseasedCount, color: "#EF4444" },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-xl mr-3">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Maize Disease Detector</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
             
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome
          </h2>
          <p className="text-gray-600">
            Maize health overview,{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Diagnoses */}
          <StatCard
            title="Total Diagnoses"
            value={totalDiagnoses}
            subtitle=""
            icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
            bg="bg-blue-100"
          />
          {/* Healthy */}
          <StatCard
            title="Healthy Plants"
            value={healthyCount}
            subtitle=""
            icon={<Shield className="w-6 h-6 text-green-600" />}
            bg="bg-green-100"
          />
          {/* Diseased */}
          <StatCard
            title="Diseased Plants"
            value={diseasedCount}
            subtitle=""
            icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
            bg="bg-red-100"
          />
          {/* Health Score */}
          <StatCard
            title="Health Score"
            value={`${(100 - parseFloat(diseaseRate)).toFixed(0)}%`}
            subtitle=""
            icon={<Activity className="w-6 h-6 text-green-600" />}
            bg="bg-green-100"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Line Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border">
            <ChartHeader
              title="Maize Disease Trend Analysis"
            />
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} />
                <YAxis allowDecimals={false} />
                <Tooltip labelFormatter={(v) => `Date: ${formatDate(v)}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="healthy"
                  stroke="#10B981"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="diseased"
                  stroke="#EF4444"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Health Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {pieData.map((entry, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <span
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: entry.color }}
                    ></span>
                    {entry.name}
                  </span>
                  <span className="font-medium text-gray-900">
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

       
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  bg,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: JSX.Element;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-xl ${bg}`}>{icon}</div>
      </div>
    </div>
  );
}

function ChartHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
   
      </button>
    </div>
  );
}
