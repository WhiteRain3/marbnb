import { BarChart3, Calendar, Home, Info, PieChart, ShieldCheck, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [data, setData] = useState({ listings: [], bookings: [] });
  const [stats, setStats] = useState({ experiences: [], prices: [] });

  const fetchData = async () => {
    const [lRes, bRes, sRes] = await Promise.all([
      fetch('/api/listings'),
      fetch('/api/bookings?role=admin'),
      fetch('/api/admin/stats')
    ]);
    
    setData({ listings: await lRes.json(), bookings: await bRes.json() });
    setStats(await sRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteListing = async (id) => {
    if (window.confirm('DĖMESIO: Pašalinus skelbimą bus ištrinta visa jo informacija. Tęsti?')) {
      await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      fetchData(); // Atnaujiname viską, įskaitant statistiką
    }
  };

  const deleteBooking = async (id) => {
    if (window.confirm('Ar tikrai norite atšaukti šią rezervaciją?')) {
      await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      setData(prev => ({ ...prev, bookings: prev.bookings.filter(b => b.id !== id) }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      {/* Antraštė */}
      <div className="bg-slate-900 text-white p-8 rounded-[3rem] flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400">
            <ShieldCheck size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-black italic tracking-tight">Valdymo centras</h1>
            <p className="text-slate-400 uppercase text-xs font-bold tracking-widest mt-1">Sistemos turinio valdymas ir analizė</p>
          </div>
        </div>
        <div className="hidden md:block text-right text-[10px] font-black uppercase text-slate-500 tracking-widest">
          Sistemos būklė: <span className="text-emerald-500 ml-2 italic">Aktyvi</span>
        </div>
      </div>

      {/* MARKETINGO STATISTIKA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
            <PieChart size={16} className="text-rose-500" /> Paklausa pagal patirtį
          </h3>
          <div className="space-y-5">
            {stats.experiences?.map(s => (
              <div key={s.experience_type}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-black text-slate-700">{s.experience_type}</span>
                  <span className="text-rose-500 font-black">{s.count} būstai</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-rose-500 h-full transition-all duration-1000" 
                    style={{ width: `${(s.count / data.listings.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
            <BarChart3 size={16} className="text-emerald-500" /> Kainų segmentų analizė
          </h3>
          <div className="space-y-5">
            {stats.prices?.map(p => (
              <div key={p.price_segment}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-black text-slate-700">{p.price_segment}</span>
                  <span className="text-emerald-600 font-black">{p.count}</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-1000" 
                    style={{ width: `${(p.count / data.listings.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TURINIO VALDYMAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-black mb-6 text-slate-900">
            <Home className="text-rose-500" /> Skelbimai ({data.listings.length})
          </h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {data.listings.map(l => (
              <div key={l.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 group hover:border-rose-100 transition-colors">
                <div className="flex items-center gap-4">
                    <img src={l.image} alt="" className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                    <div>
                        <p className="font-black text-slate-900 leading-tight">{l.title}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          {l.location} • <span className="text-rose-500">{l.experience_type}</span>
                        </p>
                    </div>
                </div>
                <button 
                  onClick={() => deleteListing(l.id)} 
                  className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-black mb-6 text-slate-900">
            <Calendar className="text-rose-500" /> Rezervacijos ({data.bookings.length})
          </h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {data.bookings.map(b => (
              <div key={b.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                <div className="space-y-1">
                    <p className="font-black text-slate-900 leading-tight">{b.title}</p>
                    <p className="text-[10px] text-slate-500 font-bold italic">Pirkėjas: {b.user_email}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white w-fit px-2 py-0.5 rounded-full border border-slate-100">
                      Data: {b.date}
                    </p>
                </div>
                <button 
                  onClick={() => deleteBooking(b.id)} 
                  className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;