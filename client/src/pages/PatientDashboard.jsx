import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Activity, Calendar, Clock, FileText, User, LogOut, LayoutDashboard, PlusCircle, History } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const passedHospital = location.state?.hospitalName;
  const passedDoctorId = location.state?.doctorId;

  const [activeTab, setActiveTab] = useState(passedHospital || passedDoctorId ? 'booking' : 'dashboard');
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [booking, setBooking] = useState({ doctorId: passedDoctorId || '', date: '', time: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appRes, recRes, docRes] = await Promise.all([
        api.get('/appointments'),
        api.get(`/records/${user.id}`),
        api.get('/users/doctors'),
      ]);
      setAppointments(appRes.data);
      setRecords(recRes.data);
      setDoctors(docRes.data);
    } catch (error) {
      console.error('Error fetching patient data', error);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/appointments', booking);
      setBooking({ doctorId: '', date: '', time: '' });
      fetchData();
      setActiveTab('appointments');
    } catch (error) {
      console.error('Booking failed', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const upcomingAppointments = appointments.filter(a => new Date(a.date) >= new Date() && a.status !== 'CANCELLED');

  return (
    <div className="flex h-screen w-full bg-slate-50/50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shadow-sm">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-primary/10 p-2 rounded-xl">
             <Activity className="h-6 w-6 text-primary" />
          </div>
          <span className="font-extrabold text-lg text-slate-800 tracking-tight">SmartHealth</span>
        </div>
        
        <div className="p-6 pb-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Patient Menu</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'booking', icon: PlusCircle, label: 'Book Appointment' },
            { id: 'appointments', icon: Calendar, label: 'My Appointments' },
            { id: 'records', icon: History, label: 'Medical History' },
            { id: 'profile', icon: User, label: 'My Profile' }
          ].map(item => (
            <Button 
                key={item.id} 
                variant={activeTab === item.id ? 'secondary' : 'ghost'} 
                className={`w-full justify-start h-12 rounded-xl ${activeTab === item.id ? 'bg-primary/5 text-primary font-semibold' : 'text-slate-600 hover:text-primary hover:bg-slate-50'}`}
                onClick={() => setActiveTab(item.id)}
            >
              <item.icon className={`h-5 w-5 mr-3 ${activeTab === item.id ? 'text-primary' : 'text-slate-400'}`} />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold shadow-sm">
              {user.name.charAt(0)}
            </div>
            <div className="text-sm overflow-hidden text-ellipsis">
              <p className="font-semibold text-slate-800 truncate">{user.name}</p>
              <p className="text-slate-500 text-xs truncate">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl h-12" onClick={handleLogout}>
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center px-8 justify-between shadow-sm z-10">
          <h1 className="text-2xl font-bold text-slate-800 capitalize tracking-tight">
             {activeTab.replace('-', ' ')}
          </h1>
          <div className="flex items-center gap-4">
            <Button onClick={() => setActiveTab('booking')} className="rounded-full shadow-lg shadow-primary/20">
               + New Appointment
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-slate-100 shadow-sm hover:shadow-md transition-all rounded-3xl bg-white overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                          <Calendar className="h-24 w-24" />
                      </div>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                           <div className="h-12 w-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center"><Calendar className="h-6 w-6" /></div>
                        </div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Upcoming Appointments</p>
                        <h3 className="text-3xl font-extrabold text-slate-800">{upcomingAppointments.length}</h3>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-slate-100 shadow-sm hover:shadow-md transition-all rounded-3xl bg-white overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                          <FileText className="h-24 w-24" />
                      </div>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                           <div className="h-12 w-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center"><History className="h-6 w-6" /></div>
                        </div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Medical Records</p>
                        <h3 className="text-3xl font-extrabold text-slate-800">{records.length}</h3>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-100 shadow-sm hover:shadow-md transition-all rounded-3xl bg-gradient-to-br from-primary to-blue-600 text-white border-0 overflow-hidden relative">
                      <CardContent className="pt-6">
                        <p className="text-blue-100 font-medium mb-1">Health Status</p>
                        <h3 className="text-2xl font-bold mb-4">All clear</h3>
                        <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 w-full" onClick={() => setActiveTab('records')}>
                           View recent lab results
                        </Button>
                      </CardContent>
                    </Card>
                 </div>

                 <Card className="border-slate-100 shadow-sm rounded-3xl">
                   <CardHeader className="border-b border-slate-50 pb-4">
                     <CardTitle className="text-lg text-slate-800">Your Next Appointment</CardTitle>
                   </CardHeader>
                   <CardContent className="pt-6">
                      {upcomingAppointments.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 flex flex-col items-center">
                            <Calendar className="h-12 w-12 text-slate-200 mb-4" />
                            <p>No upcoming appointments found.</p>
                            <Button variant="link" className="text-primary mt-2" onClick={() => setActiveTab('booking')}>Book one now.</Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-6 border border-slate-100 rounded-2xl bg-blue-50/30">
                            <div className="flex items-center gap-6">
                                <div className="h-16 w-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-primary">
                                    <span className="text-xs font-bold uppercase">{format(new Date(upcomingAppointments[0].date), 'MMM')}</span>
                                    <span className="text-xl font-extrabold">{format(new Date(upcomingAppointments[0].date), 'dd')}</span>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-slate-800 text-lg">Dr. {upcomingAppointments[0].doctor.user.name}</h4>
                                    <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                                        <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-blue-400" /> {upcomingAppointments[0].time}</span>
                                    </div>
                                </div>
                            </div>
                            <Badge className="bg-blue-100 text-primary hover:bg-blue-200 border-0 px-3 py-1 font-semibold shadow-sm">
                                {upcomingAppointments[0].status}
                            </Badge>
                        </div>
                      )}
                   </CardContent>
                 </Card>
               </div>
            )}

            {/* BOOKING TAB */}
            {activeTab === 'booking' && (
              <Card className="border-slate-100 shadow-sm rounded-3xl animate-in fade-in duration-500 max-w-2xl mx-auto">
                  <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-3xl pb-6">
                    <CardTitle className="text-xl">Schedule a Consultation</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">Select your preferred specialist and time slot.</p>
                  </CardHeader>
                  <CardContent className="pt-8">
                    {passedHospital && (
                       <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-3">
                         <Activity className="h-5 w-5 text-primary mt-0.5" />
                         <div>
                            <p className="font-semibold text-primary">Booking via {passedHospital}</p>
                            <p className="text-sm text-primary/80">Select a specialist below to finalize your appointment at this facility.</p>
                         </div>
                       </div>
                    )}
                    <form onSubmit={handleBook} className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-slate-700 font-semibold">1. Select Doctor</Label>
                        <select 
                          className="flex h-14 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-base text-slate-800 focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
                          value={booking.doctorId}
                          onChange={(e) => setBooking({...booking, doctorId: e.target.value})}
                          required
                        >
                          <option value="" disabled>Choose a specialist...</option>
                          {doctors.map(doc => (
                            <option key={doc.id} value={doc.id}>Dr. {doc.user.name} ({doc.specialization})</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-6 pb-4">
                        <div className="space-y-3">
                          <Label className="text-slate-700 font-semibold">2. Choose Date</Label>
                          <Input type="date" required className="h-14 rounded-xl border-slate-200 shadow-sm bg-white" value={booking.date} onChange={(e) => setBooking({...booking, date: e.target.value})} />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-slate-700 font-semibold">3. Select Time</Label>
                          <Input type="time" required className="h-14 rounded-xl border-slate-200 shadow-sm bg-white" value={booking.time} onChange={(e) => setBooking({...booking, time: e.target.value})} />
                        </div>
                      </div>
                      <Button type="submit" size="lg" className="w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/20">
                         Confirm Booking
                      </Button>
                    </form>
                  </CardContent>
              </Card>
            )}

            {/* APPOINTMENTS TAB */}
            {activeTab === 'appointments' && (
              <Card className="border-slate-100 shadow-sm rounded-3xl animate-in fade-in duration-500">
                  <CardHeader className="border-b border-slate-50 pb-4">
                    <CardTitle className="text-lg">All Appointments</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                     <div className="space-y-4">
                        {appointments.length === 0 ? (
                         <p className="text-slate-500 text-center py-8">No appointment history.</p>
                        ) : (
                          appointments.map(app => (
                            <div key={app.id} className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors bg-white shadow-sm">
                              <div className="flex items-center gap-5">
                                 <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center">
                                    <User className="h-5 w-5 text-slate-400" />
                                 </div>
                                 <div>
                                    <p className="font-bold text-slate-800">Dr. {app.doctor.user.name}</p>
                                    <p className="text-sm text-slate-500 font-medium">{format(new Date(app.date), 'MMMM dd, yyyy')} at {app.time}</p>
                                 </div>
                              </div>
                              <Badge variant="outline" className={`px-3 py-1 border-0 ${app.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                {app.status}
                              </Badge>
                            </div>
                          ))
                        )}
                     </div>
                  </CardContent>
              </Card>
            )}

            {/* RECORDS TAB */}
            {activeTab === 'records' && (
              <Card className="border-slate-100 shadow-sm rounded-3xl animate-in fade-in duration-500">
                  <CardHeader className="border-b border-slate-50 pb-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Medical History</CardTitle>
                  </CardHeader>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="bg-slate-50 border-y border-slate-100 text-slate-500 text-sm">
                              <th className="font-medium p-4 pl-6">Date</th>
                              <th className="font-medium p-4">Doctor</th>
                              <th className="font-medium p-4">Diagnosis</th>
                              <th className="font-medium p-4">Prescription</th>
                              <th className="font-medium p-4 text-right pr-6">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                           {records.length === 0 ? (
                               <tr>
                                   <td colSpan="5" className="text-center py-8 text-slate-500">No medical records on file.</td>
                               </tr>
                           ) : (
                               records.map(rec => (
                                <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                                   <td className="p-4 pl-6 font-medium text-slate-900">{format(new Date(rec.createdAt), 'MMM dd, yyyy')}</td>
                                   <td className="p-4">Dr. {rec.doctor.user.name}</td>
                                   <td className="p-4">{rec.diagnosis}</td>
                                   <td className="p-4 text-slate-500">{rec.prescription}</td>
                                   <td className="p-4 pr-6 text-right">
                                       {rec.fileUrl ? (
                                           <Button size="sm" variant="outline" className="bg-white shadow-sm" asChild>
                                               <a href={`http://localhost:5000${rec.fileUrl}`} target="_blank" rel="noopener noreferrer">View Report</a>
                                           </Button>
                                       ) : (
                                           <span className="text-sm text-slate-400">No attachments</span>
                                       )}
                                   </td>
                                </tr>
                               ))
                           )}
                        </tbody>
                     </table>
                  </div>
              </Card>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <Card className="border-slate-100 shadow-sm rounded-3xl animate-in fade-in duration-500 max-w-xl mx-auto">
                <CardHeader className="text-center pb-2 pt-8">
                   <div className="mx-auto h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-3xl shadow-sm mb-4">
                     {user.name.charAt(0)}
                   </div>
                   <CardTitle className="text-2xl">{user.name}</CardTitle>
                   <p className="text-slate-500">Patient Account</p>
                </CardHeader>
                <CardContent className="pt-6 space-y-4 pb-8">
                   <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50 flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Email Address</span>
                      <span className="font-bold text-slate-800">{user.email}</span>
                   </div>
                   <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50 flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Account ID</span>
                      <span className="font-mono text-sm text-slate-800">{user.id}</span>
                   </div>
                   <Button variant="outline" className="w-full h-12 rounded-xl mt-4 text-red-500 hover:text-red-600 border-red-100 hover:bg-red-50" onClick={handleLogout}>
                      Sign Out
                   </Button>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
