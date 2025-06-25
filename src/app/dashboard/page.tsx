// 'use client';

// import { useEffect, useState } from 'react';

// import { useRouter } from 'next/navigation';
// import { createClient, Session, User } from '@supabase/supabase-js';
// import { supabase } from '../../../lib/supabase_client';

// const Dashboard = () => {
//   const router = useRouter();
//   const [user, setUser] = useState<User | null>(null);
//   const [diseasedCount, setDiseasedCount] = useState<number>(0);
//   const [healthyCount, setHealthyCount] = useState<number>(0);

//   useEffect(() => {
//     const getSession = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       if (!session) {
//         router.push('/login');
//       } else {
//         setUser(session.user);
//       }
//     };

//     getSession();
//   }, [router]);

  

//   useEffect(() => {
//     const fetchDiagnosisCounts = async () => {
//       const { data, error } = await supabase
//         .from('diagnosis_results')
//         .select('diseased');

//       if (error) {
//         console.error('Error fetching data:', error);
//         return;
//       }

//       if (data) {
//         const diseased = data.filter((item) => item.diseased === 'Yes').length;
//         const healthy = data.filter((item) => item.diseased === 'No').length;
//         setDiseasedCount(diseased);
//         setHealthyCount(healthy);
//       }
//     };

//     fetchDiagnosisCounts();
//   }, []);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     router.push('/login');
//   };


//   return (
//     <div style={{ padding: 20 }}>
//       <h1 className='text-center'>Dashboard</h1>
//       {user && (
//         <>
//           <p className='text-center'>Welcome, {user.email}</p>
//           <button onClick={handleLogout}>Logout</button>
//           <section className="bg-gradient-to-tr relative from-[#1A71FF33] to-[#246BFD] w-[100%] p-4 rounded-3xl mt-[30px]">
//             <div>
//               <div>
//                 <p className="font-medium text-[20px] text-center my-6 mt-[40px]">Diagnosis from the app</p>
//                 <p className="font-semibold text-center text-[30px]">{diseasedCount+healthyCount}</p>
//               </div>
//               <section className="w-[55%] flex justify-between p-2 max-[761px]:w-[100%]">
//                 <div className="bg-[#FFFFFF55] p-4 px-8 rounded-xl">
//                   <p className= 'text-center'>Diseased Maize</p>
//                   <br />
//                   <div className="flex">
//                     <p className="font-semibold text-center ml-[40px] text-[30px]">{diseasedCount}</p>
//                   </div>
//                 </div>
//                 <div className="bg-[#FFFFFF55] p-4 rounded-xl">
//                   <p className='text-center text-bold'>Healthy Maize</p>
//                   <div className="flex pt-4 items-center">
//                     <p className="font-semibold text-center ml-[40px] text-[30px]">{healthyCount}</p>
//                   </div>
//                 </div>
//               </section>
//             </div>
//             <div className="w-[40%] absolute right-[-10px] bottom-[0] max-[761px]:hidden">
//             </div>
//           </section>
//         </>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabase_client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type DiagnosisData = {
  date: string;
  diseased: number;
  healthy: number;
};

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [diseasedCount, setDiseasedCount] = useState<number>(0);
  const [healthyCount, setHealthyCount] = useState<number>(0);
  const [chartData, setChartData] = useState<DiagnosisData[]>([]);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    };

    getSession();
  }, [router]);

  // Count totals for diseased and healthy
  useEffect(() => {
    const fetchDiagnosisCounts = async () => {
      const { data, error } = await supabase
        .from('diagnosis_results')
        .select('diseased');

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      if (data) {
        const diseased = data.filter((item) => item.diseased === 'Yes').length;
        const healthy = data.filter((item) => item.diseased === 'No').length;
        setDiseasedCount(diseased);
        setHealthyCount(healthy);
      }
    };

    fetchDiagnosisCounts();
  }, []);

  // Fetch data for the graph
  useEffect(() => {
    const fetchChartData = async () => {
      const { data, error } = await supabase
        .from('diagnosis_results')
        .select('diseased, created_at');
  
      if (error) {
        console.error('Error fetching chart data:', error);
        return;
      }
  
      const countsPerDay: { [key: string]: { diseased: number; healthy: number } } = {};
  
      data.forEach((item) => {
        const dateObj = new Date(item.created_at);
        // Force the date into YYYY-MM-DD format to avoid timezone errors
        const date = dateObj.toISOString().split('T')[0]; // "2025-06-25"
  
        if (!countsPerDay[date]) {
          countsPerDay[date] = { diseased: 0, healthy: 0 };
        }
  
        if (item.diseased === 'Yes') {
          countsPerDay[date].diseased += 1;
        } else if (item.diseased === 'No') {
          countsPerDay[date].healthy += 1;
        }
      });
  
      const formattedData = Object.entries(countsPerDay).map(([date, counts]) => ({
        date,
        diseased: counts.diseased,
        healthy: counts.healthy,
      }));
  
      setChartData(formattedData);
  
      // 🔥 Also update the total counts from the same data
      const totalDiseased = formattedData.reduce((sum, item) => sum + item.diseased, 0);
      const totalHealthy = formattedData.reduce((sum, item) => sum + item.healthy, 0);
  
      setDiseasedCount(totalDiseased);
      setHealthyCount(totalHealthy);
    };
  
    fetchChartData();
  }, []);
  
        



  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl text-center font-bold mb-6">Dashboard</h1>

      {user && (
        <>
          <p className="text-center mb-4">Welcome, {user.email}</p>
          <button
            onClick={handleLogout}
            className="block mx-auto mb-6 bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>

          <section className="bg-gradient-to-tr relative from-[#1A71FF33] to-[#246BFD] w-[100%] p-4 rounded-3xl mt-[30px]">
             <div>
               <div>
                 <p className="font-medium text-[20px] text-center my-6 t-[10px]">Diagnosis from the app</p>
                 <p className="font-semibold text-center text-[30px]">{diseasedCount+healthyCount}</p>
               </div>
               <section className="w-[55%] flex justify-between p-2 max-[761px]:w-[100%]">
                 <div className="bg-[#FFFFFF55] ml-[70%] p-4 px-8 rounded-xl">
                   <p className= 'text-center'>Diseased Maize</p>
                   <br />
                   <div className="flex">
                    <p className="font-semibold text-center ml-[40px] text-[30px]">{diseasedCount}</p>
                   </div>
                 </div>
                 <div className="bg-[#FFFFFF55]   p-4 rounded-xl">
                   <p className='text-center text-bold'>Healthy Maize</p>
                   <div className="flex pt-4 items-center">
                     <p className="font-semibold text-center ml-[40px] text-[30px]">{healthyCount}</p>
                   </div>
                 </div>
               </section>
             </div>
             <div className="w-[40%] absolute right-[-10px] bottom-[0] max-[761px]:hidden">
             </div>
           </section>
          {/* 🚀 Chart Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl text-center font-semibold mb-4">Maize Health Trend Graph</h2>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="diseased" stroke="#F87171" name="Diseased" />
                <Line type="monotone" dataKey="healthy" stroke="#4ADE80" name="Healthy" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
