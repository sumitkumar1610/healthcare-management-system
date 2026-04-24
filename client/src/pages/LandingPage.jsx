import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Activity, ShieldCheck, Heart, Cloud, CalendarCheck, Search, MapPin, Users, CheckCircle, Building } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const hospitals = [
    { id: 1, name: "City General Hospital", location: "Downtown Metro", type: "General Hospital", doctors: 45, image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=800" },
    { id: 2, name: "Oakridge Cardiology Center", location: "Westside Heights", type: "Specialty Clinic", doctors: 12, image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800" },
    { id: 3, name: "Sunset Pediatrics", location: "North Valley", type: "Children's Hospital", doctors: 8, image: "https://images.unsplash.com/photo-1542884748-2b87b00f3304?auto=format&fit=crop&q=80&w=800" },
    { id: 4, name: "Metro Care Neurological", location: "Financial District", type: "Specialty Clinic", doctors: 24, image: "https://images.unsplash.com/photo-1551076805-e1869043e660?auto=format&fit=crop&q=80&w=800" },
    { id: 5, name: "Valley Orthopedics", location: "South Park", type: "Rehab Center", doctors: 16, image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=800" },
    { id: 6, name: "Lakeside Medical Center", location: "East Shores", type: "General Hospital", doctors: 120, image: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?auto=format&fit=crop&q=80&w=800" }
  ];

  const filteredHospitals = hospitals.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">SmartHealth</span>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#" className="text-slate-600 hover:text-primary transition-colors font-medium">Home</a>
              <a href="#services" className="text-slate-600 hover:text-primary transition-colors font-medium">Services</a>
              <a href="#hospitals" className="text-slate-600 hover:text-primary transition-colors font-medium">Hospitals</a>
              <a href="#contact" className="text-slate-600 hover:text-primary transition-colors font-medium">Contact</a>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="font-semibold text-slate-700 hidden md:inline-flex" onClick={() => navigate('/auth/login', { state: { role: 'PATIENT' } })}>
                Log in
              </Button>
              <Button className="font-semibold px-6 shadow-md shadow-primary/20" onClick={() => navigate('/auth/login', { state: { role: 'PATIENT' } })}>
                Register
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pb-32 pt-20 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-primary font-medium text-sm mb-6">
                <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                Next-Gen Healthcare
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
                Healthcare that <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">truly cares.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                A seamless, cloud-based platform connecting patients to world-class doctors. Secure medical records, instant bookings, and smart monitoring.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="h-14 px-8 text-lg shadow-lg shadow-primary/30" onClick={() => {
                  document.getElementById('hospitals').scrollIntoView({ behavior: 'smooth' });
                }}>
                  Find a Hospital
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-white" onClick={() => navigate('/auth/login', { state: { role: 'DOCTOR' } })}>
                  I am a Doctor
                </Button>
              </div>
            </div>
            
            <div className="relative mx-auto w-full max-w-lg lg:max-w-xl">
              <div className="relative rounded-3xl bg-white shadow-2xl p-8 border border-slate-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                 <div className="flex items-center justify-between mb-8">
                   <div>
                     <p className="text-sm font-bold text-slate-400 uppercase">Upcoming Appointment</p>
                     <p className="text-xl font-bold text-slate-800">Dr. Sarah Jenkins</p>
                     <p className="text-sm text-slate-500">Cardiologist • Today, 2:30 PM</p>
                   </div>
                   <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Heart className="h-8 w-8 text-primary" />
                   </div>
                 </div>
                 <div className="space-y-4">
                   <div className="h-4 bg-slate-100 rounded flex w-3/4"></div>
                   <div className="h-4 bg-slate-100 rounded flex w-1/2"></div>
                   <div className="h-4 bg-slate-100 rounded flex w-5/6"></div>
                 </div>
                 <div className="mt-8 pt-6 border-t border-slate-100 flex gap-4">
                    <Button className="flex-1 bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20 text-white">Confirmed</Button>
                    <Button variant="outline" className="flex-1">Reschedule</Button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Platform Features</h2>
            <p className="mt-4 text-lg text-slate-600">Everything you need to manage healthcare efficiently.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Cloud className="h-8 w-8 text-blue-500" />,
                title: "Cloud Access",
                desc: "Access your medical records and prescriptions securely from any device, anywhere in the world."
              },
              {
                icon: <ShieldCheck className="h-8 w-8 text-green-500" />,
                title: "Secure Records",
                desc: "Bank-grade encryption ensures that all patient data and hospital records stay strictly confidential."
              },
              {
                icon: <CalendarCheck className="h-8 w-8 text-purple-500" />,
                title: "Smart Scheduling",
                desc: "Say goodbye to long queues. Book, modify, and track appointments in real-time."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-shadow duration-300">
                <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hospital Directory */}
      <section id="hospitals" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row justify-between items-end mb-12">
             <div>
               <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Partner Hospitals</h2>
               <p className="mt-4 text-lg text-slate-600 max-w-2xl">Find a state-of-the-art facility near you. Browse our network of premium healthcare institutions and book directly.</p>
             </div>
             <div className="mt-6 md:mt-0 relative w-full md:w-96 shadow-sm rounded-xl">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
               <input 
                  type="text" 
                  placeholder="Search hospitals or locations..." 
                  className="w-full pl-12 pr-4 h-14 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-700 shadow-sm" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
           </div>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHospitals.map(hospital => (
                 <div key={hospital.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full group">
                    <div className="h-48 w-full overflow-hidden relative">
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                       <img src={hospital.image} alt={hospital.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                       <div className="absolute bottom-4 left-4 z-20">
                          <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">{hospital.type}</span>
                       </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                       <h3 className="text-xl font-bold text-slate-900 mb-2">{hospital.name}</h3>
                       <div className="flex items-center gap-2 mb-4 text-slate-500 text-sm font-medium">
                          <MapPin className="h-4 w-4 text-slate-400" /> {hospital.location}
                       </div>
                       <div className="flex items-center justify-between mb-8 text-sm pt-4 border-t border-slate-100">
                          <span className="flex items-center gap-2 text-slate-600 font-medium"><Users className="h-4 w-4 text-primary"/> {hospital.doctors} Specialists</span>
                          <span className="flex items-center gap-1 text-green-600 font-bold"><CheckCircle className="h-4 w-4"/> Slots Open</span>
                       </div>
                       <div className="mt-auto">
                           <Button className="w-full h-12 rounded-xl shadow-lg shadow-primary/20 font-bold text-base" onClick={() => navigate(`/hospital/${hospital.id}`)}>
                              View Facility & Doctors
                           </Button>
                       </div>
                    </div>
                 </div>
              ))}
              {filteredHospitals.length === 0 && (
                 <div className="col-span-full py-16 text-center text-slate-500">
                    <Building className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                    <p className="text-xl font-medium text-slate-700">No hospitals found matching your search.</p>
                 </div>
              )}
           </div>
        </div>
      </section>

      {/* Access Portals */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-12">Portal Access</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Button size="lg" className="h-16 px-10 text-lg bg-white text-slate-900 hover:bg-slate-100" onClick={() => navigate('/auth/login', { state: { role: 'PATIENT' } })}>
                   Patient Portal
                </Button>
                <Button size="lg" variant="outline" className="h-16 px-10 text-lg border-slate-700 hover:bg-slate-800" onClick={() => navigate('/auth/login', { state: { role: 'DOCTOR' } })}>
                   Doctor Portal
                </Button>
                <Button size="lg" variant="ghost" className="h-16 px-10 text-lg hover:bg-slate-800" onClick={() => navigate('/auth/login', { state: { role: 'ADMIN' } })}>
                   Admin Portal
                </Button>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl text-slate-900">SmartHealth</span>
            </div>
            <p className="text-slate-500 max-w-sm">Modernizing healthcare through smart, cloud-based technology. Connecting the world, one patient at a time.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-3 text-slate-500">
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Contact</h4>
            <ul className="space-y-3 text-slate-500">
              <li>support@smarthealth.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
