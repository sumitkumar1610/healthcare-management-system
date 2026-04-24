import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Search, Activity, Users, Calendar, FilePlus, User, LogOut, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [recordData, setRecordData] = useState({ patientId: '', diagnosis: '', prescription: '', file: null });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      fetchAppointments();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('patientId', recordData.patientId);
      formData.append('diagnosis', recordData.diagnosis);
      formData.append('prescription', recordData.prescription);
      if (recordData.file) {
        formData.append('file', recordData.file);
      }

      await api.post('/records', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setRecordData({ patientId: '', diagnosis: '', prescription: '', file: null });
      alert('Record added successfully');
      setActiveTab('appointments');
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  // Derive unique patients from appointments
  const uniquePatients = Array.from(new Set(appointments.map(a => a.patient.id)))
    .map(id => appointments.find(a => a.patient.id === id).patient);
    
  const filteredPatients = uniquePatients.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-screen w-full bg-slate-50/50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shadow-sm">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-sky-500/10 p-2 rounded-xl">
             <Activity className="h-6 w-6 text-sky-500" />
          </div>
          <span className="font-extrabold text-lg text-slate-800 tracking-tight">SmartHealth</span>
        </div>
        
        <div className="p-6 pb-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Doctor Portal</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {[
            { id: 'appointments', icon: Calendar, label: 'Appointments' },
            { id: 'patients', icon: Users, label: 'Patient Roster' },
            { id: 'prescriptions', icon: FilePlus, label: 'Issue Record' },
            { id: 'profile', icon: User, label: 'My Profile' }
          ].map(item => (
            <Button 
                key={item.id} 
                variant={activeTab === item.id ? 'secondary' : 'ghost'} 
                className={`w-full justify-start h-12 rounded-xl ${activeTab === item.id ? 'bg-sky-50 text-sky-600 font-semibold' : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'}`}
                onClick={() => setActiveTab(item.id)}
            >
              <item.icon className={`h-5 w-5 mr-3 ${activeTab === item.id ? 'text-sky-600' : 'text-slate-400'}`} />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-10 w-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold shadow-sm">
              {user.name.charAt(0)}
            </div>
            <div className="text-sm overflow-hidden text-ellipsis">
              <p className="font-semibold text-slate-800 truncate">Dr. {user.name}</p>
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
             {activeTab === 'prescriptions' ? 'Issue Medical Record' : activeTab}
          </h1>
          <div className="flex items-center gap-4">
             <div className="h-10 px-4 py-2 bg-sky-50 text-sky-600 font-medium rounded-full text-sm flex items-center">
                 {appointments.filter(a => a.status === 'PENDING').length} Pending Requests
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">

            {/* APPOINTMENTS TAB */}
            {activeTab === 'appointments' && (
              <Card className="border-slate-100 shadow-sm rounded-3xl animate-in fade-in duration-500 bg-white">
                <CardHeader className="border-b border-slate-50 pb-4">
                  <CardTitle className="text-xl">Appointment Queue</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                          <th className="px-6 py-4 rounded-tl-xl">Patient Name</th>
                          <th className="px-6 py-4">Date & Time</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right rounded-tr-xl">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {appointments.map(app => (
                          <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4 font-semibold text-slate-800 flex items-center gap-3">
                               <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs">
                                  {app.patient.name.charAt(0)}
                               </div>
                               {app.patient.name}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                                {format(new Date(app.date), 'MMM dd, yyyy')} <span className="text-slate-400 mx-1">•</span> {app.time}
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="outline" className={`px-2 py-1 border-0 font-medium shadow-sm ${app.status === 'CONFIRMED' ? 'bg-sky-100 text-sky-700' : app.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : app.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {app.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {app.status === 'PENDING' && (
                                    <>
                                      <Button size="sm" className="bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-500/20" onClick={() => updateStatus(app.id, 'CONFIRMED')}>
                                         Confirm
                                      </Button>
                                      <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => updateStatus(app.id, 'CANCELLED')}>Cancel</Button>
                                    </>
                                  )}
                                  {app.status === 'CONFIRMED' && (
                                    <Button size="sm" variant="outline" className="border-sky-200 text-sky-600 hover:bg-sky-50" onClick={() => {
                                      updateStatus(app.id, 'COMPLETED');
                                      setRecordData({ ...recordData, patientId: app.patientId });
                                      setActiveTab('prescriptions');
                                    }}>
                                        Mark Completed
                                    </Button>
                                  )}
                              </div>
                            </td>
                          </tr>
                        ))}
                        {appointments.length === 0 && (
                          <tr>
                            <td colSpan="4" className="text-center py-12 text-slate-400">No appointments scheduled today.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PATIENTS TAB */}
            {activeTab === 'patients' && (
              <Card className="border-slate-100 shadow-sm rounded-3xl animate-in fade-in duration-500 bg-white">
                <CardHeader className="border-b border-slate-50 pb-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">Patient Directory</CardTitle>
                  <div className="relative">
                     <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                     <Input 
                        placeholder="Search patients..." 
                        className="pl-10 h-10 w-64 rounded-full border-slate-200 bg-slate-50 focus:bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                     />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPatients.length > 0 ? filteredPatients.map(patient => (
                            <div key={patient.id} className="p-6 border border-slate-100 rounded-2xl flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                               <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                                  <User className="h-8 w-8" />
                               </div>
                               <h3 className="font-bold text-lg text-slate-800">{patient.name}</h3>
                               <Button variant="link" className="text-sky-500 mt-2" onClick={() => {
                                   setRecordData({...recordData, patientId: patient.id});
                                   setActiveTab('prescriptions');
                               }}>Issue New Record</Button>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-12 text-slate-400">No patients found.</div>
                        )}
                    </div>
                </CardContent>
              </Card>
            )}

            {/* PRESCRIPTIONS TAB */}
            {activeTab === 'prescriptions' && (
              <Card className="border-slate-100 shadow-sm rounded-3xl animate-in fade-in duration-500 max-w-2xl mx-auto bg-white">
                <CardHeader className="bg-sky-50 border-b border-slate-100 rounded-t-3xl pb-6 pt-8">
                  <CardTitle className="text-xl flex items-center gap-2"><FilePlus className="h-5 w-5 text-sky-500"/> Issue Medical Record</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">Upload diagnosis, prescription, and attaching medical scans.</p>
                </CardHeader>
                <CardContent className="pt-8">
                  <form onSubmit={handleAddRecord} className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-slate-700 font-semibold">1. Select Patient</Label>
                      <select 
                         className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-800 focus:ring-2 focus:ring-sky-500/20 shadow-sm transition-all"
                         required 
                         value={recordData.patientId} 
                         onChange={e => setRecordData({...recordData, patientId: e.target.value})}
                      >
                          <option value="" disabled>Select patient from roster...</option>
                          {uniquePatients.map(p => (
                             <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-slate-700 font-semibold">2. Diagnosis Details</Label>
                      <Input className="h-12 rounded-xl shadow-sm border-slate-200 focus:ring-2 focus:ring-sky-500/20" required value={recordData.diagnosis} onChange={e => setRecordData({...recordData, diagnosis: e.target.value})} placeholder="e.g. Acute Bronchitis" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-slate-700 font-semibold">3. Prescription Notes</Label>
                      <Input className="h-12 rounded-xl shadow-sm border-slate-200 focus:ring-2 focus:ring-sky-500/20" required value={recordData.prescription} onChange={e => setRecordData({...recordData, prescription: e.target.value})} placeholder="e.g. Amoxicillin 500mg, 3x daily"  />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-slate-700 font-semibold">4. Attach Medical Report (Optional)</Label>
                      <Input className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100" type="file" onChange={e => setRecordData({...recordData, file: e.target.files[0]})} />
                    </div>
                    <Button type="submit" size="lg" className="w-full h-14 rounded-xl text-lg font-bold bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-500/20">
                        Submit Record to Patient
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <Card className="border-slate-100 shadow-sm rounded-3xl animate-in fade-in duration-500 max-w-xl mx-auto bg-white">
                <CardHeader className="text-center pb-2 pt-8">
                   <div className="mx-auto h-24 w-24 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-3xl shadow-sm mb-4">
                     {user.name.charAt(0)}
                   </div>
                   <CardTitle className="text-2xl">Dr. {user.name}</CardTitle>
                   <p className="text-slate-500">Medical Practitioner Account</p>
                </CardHeader>
                <CardContent className="pt-6 space-y-4 pb-8">
                   <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50 flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Email Address</span>
                      <span className="font-bold text-slate-800">{user.email}</span>
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
