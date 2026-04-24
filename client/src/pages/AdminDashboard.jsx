import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Activity, ShieldCheck, Users, Calendar, BarChart3, PieChart, LogOut, UserIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend } from 'recharts';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, aptRes] = await Promise.all([
          api.get('/users'),
          api.get('/appointments')
        ]);
        setUsers(usersRes.data);
        setAppointments(aptRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const patientCount = users.filter(u => u.role === 'PATIENT').length;
  const doctorCount = users.filter(u => u.role === 'DOCTOR').length;

  const roleDistribution = [
    { name: 'Patients', value: patientCount, color: '#0ea5e9' },
    { name: 'Doctors', value: doctorCount, color: '#8b5cf6' },
    { name: 'Admin', value: users.filter(u => u.role === 'ADMIN').length, color: '#f43f5e' }
  ];

  // Dummy activity data for bar chart since we don't have daily analytics API
  const activityData = [
    { name: 'Mon', bookings: appointments.length > 5 ? 5 : appointments.length },
    { name: 'Tue', bookings: 7 },
    { name: 'Wed', bookings: 4 },
    { name: 'Thu', bookings: 9 },
    { name: 'Fri', bookings: 3 },
    { name: 'Sat', bookings: 2 },
    { name: 'Sun', bookings: 1 }
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50/50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col text-slate-300">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-slate-800 p-2 rounded-xl">
             <ShieldCheck className="h-6 w-6 text-slate-100" />
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight">SmartHealth</span>
        </div>
        
        <div className="p-6 pb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Administration</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {[
            { id: 'overview', icon: BarChart3, label: 'Analytics' },
            { id: 'users', icon: Users, label: 'User Management' },
            { id: 'appointments', icon: Calendar, label: 'Audit Logs' }
          ].map(item => (
            <Button 
                key={item.id} 
                variant={activeTab === item.id ? 'secondary' : 'ghost'} 
                className={`w-full justify-start h-12 rounded-xl ${activeTab === item.id ? 'bg-indigo-500 text-white font-semibold hover:bg-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                onClick={() => setActiveTab(item.id)}
            >
              <item.icon className={`h-5 w-5 mr-3 ${activeTab === item.id ? 'text-white' : 'text-slate-400'}`} />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
              {user.name.charAt(0)}
            </div>
            <div className="text-sm overflow-hidden text-ellipsis">
              <p className="font-semibold text-white truncate">{user.name}</p>
              <p className="text-slate-500 text-xs truncate">System Administrator</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-xl h-12" onClick={handleLogout}>
            <LogOut className="h-5 w-5 mr-3" />
            End Session
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center px-8 justify-between shadow-sm z-10">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
             {activeTab === 'overview' ? 'Platform Analytics' : activeTab === 'users' ? 'User Directory' : 'System Logs'}
          </h1>
          <div className="flex items-center gap-4">
             <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 shadow-sm px-3 py-1">
                 System Online • All Services Operational
             </Badge>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                     <Card className="border-slate-100 shadow-sm rounded-3xl bg-white">
                        <CardContent className="pt-6">
                           <div className="h-10 w-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center mb-4"><Users className="h-5 w-5" /></div>
                           <p className="text-sm font-medium text-slate-500 mb-1">Total Users</p>
                           <h3 className="text-3xl font-extrabold text-slate-800">{users.length}</h3>
                        </CardContent>
                     </Card>
                     <Card className="border-slate-100 shadow-sm rounded-3xl bg-white">
                        <CardContent className="pt-6">
                           <div className="h-10 w-10 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center mb-4"><UserIcon className="h-5 w-5" /></div>
                           <p className="text-sm font-medium text-slate-500 mb-1">Active Patients</p>
                           <h3 className="text-3xl font-extrabold text-slate-800">{patientCount}</h3>
                        </CardContent>
                     </Card>
                     <Card className="border-slate-100 shadow-sm rounded-3xl bg-white">
                        <CardContent className="pt-6">
                           <div className="h-10 w-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center mb-4"><Activity className="h-5 w-5" /></div>
                           <p className="text-sm font-medium text-slate-500 mb-1">Registered Doctors</p>
                           <h3 className="text-3xl font-extrabold text-slate-800">{doctorCount}</h3>
                        </CardContent>
                     </Card>
                     <Card className="border-slate-100 shadow-sm rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        <CardContent className="pt-6">
                           <div className="h-10 w-10 bg-white/20 text-white rounded-xl flex items-center justify-center mb-4"><Calendar className="h-5 w-5" /></div>
                           <p className="text-indigo-100 font-medium mb-1">Total Appointments</p>
                           <h3 className="text-3xl font-extrabold">{appointments.length}</h3>
                        </CardContent>
                     </Card>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-slate-100 shadow-sm rounded-3xl bg-white">
                       <CardHeader className="border-b border-slate-50 pb-4">
                         <CardTitle className="text-lg">User Demographics</CardTitle>
                       </CardHeader>
                       <CardContent className="pt-8 h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                              <Pie data={roleDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} label>
                                {roleDistribution.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                              <Legend />
                            </RePieChart>
                         </ResponsiveContainer>
                       </CardContent>
                    </Card>

                    <Card className="border-slate-100 shadow-sm rounded-3xl bg-white">
                       <CardHeader className="border-b border-slate-50 pb-4">
                         <CardTitle className="text-lg">Weekly Engagement</CardTitle>
                       </CardHeader>
                       <CardContent className="pt-8 h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData}>
                               <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                               <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                               <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                               <Bar dataKey="bookings" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                         </ResponsiveContainer>
                       </CardContent>
                    </Card>
                 </div>
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <Card className="border-slate-100 shadow-sm rounded-3xl animate-in fade-in duration-500 bg-white">
                <CardHeader className="border-b border-slate-50 pb-4">
                  <CardTitle className="text-xl">User Directory</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                          <th className="px-6 py-4 rounded-tl-xl border-b border-slate-100">Full Name</th>
                          <th className="px-6 py-4 border-b border-slate-100">Email Address</th>
                          <th className="px-6 py-4 border-b border-slate-100">System Role</th>
                          <th className="px-6 py-4 rounded-tr-xl border-b border-slate-100 text-right">Account Added</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {users.map(u => (
                          <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-3">
                               <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs">
                                  {u.name.charAt(0)}
                               </div>
                               {u.name}
                            </td>
                            <td className="px-6 py-4 text-slate-600">{u.email}</td>
                            <td className="px-6 py-4">
                              <Badge variant="outline" className={`px-2 py-1 border-0 shadow-sm font-semibold ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : u.role === 'DOCTOR' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'}`}>
                                {u.role}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-slate-400 text-right font-mono text-xs">
                                {u.id.substring(0, 8)}...
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* APPOINTMENTS TAB */}
            {activeTab === 'appointments' && (
              <Card className="border-slate-100 shadow-sm rounded-3xl animate-in fade-in duration-500 bg-white">
                <CardHeader className="border-b border-slate-50 pb-4">
                  <CardTitle className="text-xl">System Audit: Appointments</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                          <th className="px-6 py-4 rounded-tl-xl border-b border-slate-100">Audit ID</th>
                          <th className="px-6 py-4 border-b border-slate-100">Scheduled Date</th>
                          <th className="px-6 py-4 border-b border-slate-100">Doctor ID</th>
                          <th className="px-6 py-4 rounded-tr-xl border-b border-slate-100">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono text-xs">
                        {appointments.map(a => (
                          <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                             <td className="px-6 py-4 text-slate-400">{a.id.substring(0, 12)}</td>
                             <td className="px-6 py-4 text-slate-600 font-sans">{new Date(a.date).toLocaleDateString()} @ {a.time}</td>
                             <td className="px-6 py-4 text-slate-400">{a.doctorId.substring(0, 12)}</td>
                             <td className="px-6 py-4 font-sans font-semibold">
                               <span className={`${a.status === 'CONFIRMED' ? 'text-sky-600' : a.status === 'PENDING' ? 'text-amber-600' : a.status === 'COMPLETED' ? 'text-green-600' : 'text-red-500'}`}>
                                  {a.status}
                               </span>
                             </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
