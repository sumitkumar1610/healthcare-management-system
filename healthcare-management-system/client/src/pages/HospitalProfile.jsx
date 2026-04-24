import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Activity, MapPin, Users, Calendar, ArrowLeft, User, ChevronRight, ShieldCheck } from 'lucide-react';
import api from '../lib/api';

export default function HospitalProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded mock hospitals matching the Landing Page
  const hospitals = [
    { id: 1, name: "City General Hospital", location: "Downtown Metro", type: "General Hospital", desc: "A world-class general medical facility equipped with advanced diagnostic tools and round-the-clock emergency response units. Dedicated to providing compassionate care to the downtown community.", image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=1200" },
    { id: 2, name: "Oakridge Cardiology Center", location: "Westside Heights", type: "Specialty Clinic", desc: "Leading the region in cardiovascular health, Oakridge features top-tier heart specialists and state-of-the-art surgical suites for complex restorative procedures.", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200" },
    { id: 3, name: "Sunset Pediatrics", location: "North Valley", type: "Children's Hospital", desc: "A welcoming, colorful medical center entirely focused on neonatal and pediatric care. Ensuring your little ones get the most attentive care possible.", image: "https://images.unsplash.com/photo-1542884748-2b87b00f3304?auto=format&fit=crop&q=80&w=1200" },
    { id: 4, name: "Metro Care Neurological", location: "Financial District", type: "Specialty Clinic", desc: "Our neurological department is renowned for its cutting-edge research and treatment of brain and nervous system disorders.", image: "https://images.unsplash.com/photo-1551076805-e1869043e660?auto=format&fit=crop&q=80&w=1200" },
    { id: 5, name: "Valley Orthopedics", location: "South Park", type: "Rehab Center", desc: "Providing premium physical therapy, rehabilitation, and orthopedic surgery services to help you regain your mobility faster.", image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=1200" },
    { id: 6, name: "Lakeside Medical Center", location: "East Shores", type: "General Hospital", desc: "A massive, comprehensive healthcare campus offering multi-disciplinary treatments, holistic health services, and breathtaking lakeside recovery viewings.", image: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?auto=format&fit=crop&q=80&w=1200" }
  ];

  const hospital = hospitals.find(h => h.id === parseInt(id));

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/users/doctors');
        // Simulate mapping logic: If hospital ID is even, give them half the doctors, else give the other half.
        const allDoc = res.data;
        const mappedDocs = allDoc.filter((_, index) => (index + parseInt(id)) % 2 === 0);
        
        // If there are very few doctors, just show all of them so the UI doesn't look empty.
        setDoctors(allDoc.length < 4 ? allDoc : mappedDocs);
      } catch (error) {
        console.error('Failed to load doctors', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [id]);

  if (!hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800">Hospital Not Found</h2>
            <Button className="mt-4" onClick={() => navigate('/')}>Return to Directory</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      {/* Dynamic Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 hidden sm:block">SmartHealth</span>
            </div>
            <div className="flex items-center text-sm font-medium text-slate-500 gap-2">
                <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">Directory</button>
                <ChevronRight className="h-4 w-4" />
                <span className="text-slate-900">{hospital.name}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <div className="relative bg-slate-900 h-96 w-full overflow-hidden">
        <div className="absolute inset-0">
           <img src={hospital.image} alt={hospital.name} className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
           <button onClick={() => navigate('/')} className="flex items-center text-slate-300 hover:text-white mb-6 w-max transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Search
           </button>
           <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full">{hospital.type}</span>
              <span className="flex items-center text-slate-300 text-sm font-medium"><MapPin className="h-4 w-4 mr-1 text-primary" /> {hospital.location}</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4">{hospital.name}</h1>
           <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">{hospital.desc}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
         <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-8">
               <div className="flex flex-col">
                  <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Available Specialists</span>
                  <span className="text-3xl font-extrabold text-slate-900">{doctors.length} Active</span>
               </div>
               <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
               <div className="flex flex-col">
                  <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Network Status</span>
                  <span className="flex items-center text-xl font-bold text-green-600"><ShieldCheck className="h-6 w-6 mr-2" /> Verified Partner</span>
               </div>
            </div>
            <Button size="lg" className="h-14 px-8 text-lg rounded-xl shadow-lg shadow-primary/20 w-full md:w-auto" onClick={() => navigate('/auth/login', { state: { role: 'PATIENT', hospitalId: hospital.id, hospitalName: hospital.name } })}>
               General Enquiry
            </Button>
         </div>

         <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Our Specialists</h2>
            </div>
            
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {doctors.map(doctor => (
                     <div key={doctor.id} className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="h-16 w-16 bg-blue-50 text-primary rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                                {doctor.user.name.charAt(0)}
                            </div>
                            <div>
                               <h3 className="text-xl font-bold text-slate-900 leading-tight">Dr. {doctor.user.name}</h3>
                               <p className="text-primary font-medium">{doctor.specialization}</p>
                               <div className="flex items-center text-sm text-slate-500 mt-2 gap-3">
                                  <span className="flex items-center"><User className="h-4 w-4 mr-1"/> {doctor.experience} yrs exp</span>
                               </div>
                            </div>
                        </div>
                        {doctor.bio && (
                            <p className="text-slate-600 text-sm mb-6 flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">{doctor.bio}</p>
                        )}
                        <div className="mt-auto pt-4 border-t border-slate-100">
                           <Button className="w-full h-12 rounded-xl text-base font-semibold group" onClick={() => navigate('/auth/login', { state: { role: 'PATIENT', hospitalId: hospital.id, hospitalName: hospital.name, doctorId: doctor.id } })}>
                              <Calendar className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                              Book Consultation
                           </Button>
                        </div>
                     </div>
                  ))}
                  {doctors.length === 0 && (
                      <div className="col-span-full py-12 text-center text-slate-500">
                         No specialists are currently accepting direct bookings at this facility.
                      </div>
                  )}
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
