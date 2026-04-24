import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Activity, Mail, Lock, User as UserIcon, ShieldCheck } from 'lucide-react';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const defaultRole = location.state?.role || 'PATIENT';
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: defaultRole });
  const [error, setError] = useState('');
  const { login, register, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate(`/dashboard/${user.role.toLowerCase()}`, { 
         state: { 
            hospitalName: location.state?.hospitalName,
            doctorId: location.state?.doctorId 
         } 
      });
    }
  }, [user, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const roleColors = {
      PATIENT: 'text-indigo-500 bg-indigo-50',
      DOCTOR: 'text-sky-500 bg-sky-50',
      ADMIN: 'text-red-500 bg-red-50'
  };

  return (
    <div className="w-full relative">
       {/* Background accent decorations */}
       <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
       <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

       <Card className="shadow-2xl border-0 overflow-hidden sm:rounded-3xl bg-white/90 backdrop-blur-sm relative z-10">
         <CardHeader className="space-y-1 text-center pb-8 pt-10">
           <div className="flex justify-center mb-6">
             <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-inner ${roleColors[formData.role]}`}>
               {formData.role === 'PATIENT' ? <Activity className="h-8 w-8" /> : formData.role === 'DOCTOR' ? <Activity className="h-8 w-8" /> : <ShieldCheck className="h-8 w-8" />}
             </div>
           </div>
           <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-800">
             {isLogin ? 'Welcome back' : 'Create an account'}
           </CardTitle>
           <CardDescription className="text-base text-slate-500 mt-2">
             {isLogin ? `Sign in to your ${formData.role.toLowerCase()} portal` : `Register for a new ${formData.role.toLowerCase()} account`}
           </CardDescription>
         </CardHeader>
         
         <CardContent className="px-10">
           <form onSubmit={handleSubmit} className="space-y-5">
             {error && (
                 <div className="text-sm font-medium text-red-600 bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 opacity-50" />
                    {error}
                 </div>
             )}
             
             {!isLogin && (
               <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                 <div className="space-y-2 relative">
                   <Label htmlFor="name" className="text-slate-600 font-semibold px-1">Full Name</Label>
                   <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input id="name" required placeholder="John Doe" className="pl-12 h-14 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary/20 shadow-sm transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="role" className="text-slate-600 font-semibold px-1">Account Type</Label>
                   <select 
                     id="role" 
                     className="flex h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-base text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
                     value={formData.role} 
                     onChange={(e) => setFormData({...formData, role: e.target.value})}
                   >
                     <option value="PATIENT">Patient Account</option>
                     <option value="DOCTOR">Medical Practitioner</option>
                   </select>
                 </div>
               </div>
             )}
             
             <div className="space-y-2 relative">
               <Label htmlFor="email" className="text-slate-600 font-semibold px-1">Email Address</Label>
               <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input id="email" type="email" required placeholder="smarthealth@example.com" className="pl-12 h-14 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary/20 shadow-sm transition-all" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
               </div>
             </div>
             
             <div className="space-y-2 relative">
               <Label htmlFor="password" className="text-slate-600 font-semibold px-1">Password</Label>
               <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input id="password" type="password" required placeholder="••••••••" className="pl-12 h-14 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary/20 shadow-sm transition-all" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
               </div>
             </div>
             
             <Button type="submit" className="w-full mt-6 h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20">
               {isLogin ? 'Sign In to Dashboard' : 'Create Account'}
             </Button>
           </form>
         </CardContent>
         
         <CardFooter className="flex justify-center border-t border-slate-100 bg-slate-50/50 p-6 mt-6">
           <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
             {isLogin ? "Don't have an account? Sign up today" : "Already have an account? Sign in here"}
           </button>
         </CardFooter>
       </Card>
    </div>
  );
}
