import { Calendar, Home, ShieldCheck, Trash2, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [data, setData] = useState({ listings: [], bookings: [] });

  const fetchData = async () => {
    const [lRes, bRes] = await Promise.all([
      fetch('/api/listings'),
      fetch('/api/bookings?role=admin')
    ]);
    setData({ listings: await lRes.json(), bookings: await bRes.json() });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Funkcija skelbimų (hosted stuff) šalinimui
  const deleteListing = async (id) => {
    if (window.confirm('DĖMESIO: Pašalinus skelbimą bus ištrinta visa jo informacija. Tęsti?')) {
      await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      setData(prev => ({ ...prev, listings: prev.listings.filter(l => l.id !== id) }));
    }
  };

  // Funkcija rezervacijų šalinimui
  const deleteBooking = async (id) => {
    if (window.confirm('Ar tikrai norite atšaukti šią rezervaciją?')) {
      await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      setData(prev => ({ ...prev, bookings: prev.bookings.filter(b => b.id !== id) }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      <div className="bg-slate-900 text-white p-8 rounded-[2rem] flex items-center gap-6 shadow-xl">
        <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400">
          <ShieldCheck size={40} />
        </div>
        <div>
          <h1 className="text-3xl font-black italic tracking-tight">Valdymo centras
          </h1>
          <p className="text-slate-400 uppercase text-xs font-bold tracking-widest mt-1">Sistemos turinio valdymas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* VISI SKELBIMAI (Hosted Stuff) */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-6 text-slate-800">
            <Home className="text-rose-500" /> Visi Skelbimai ({data.listings.length})
          </h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 text-sm">
            {data.listings.map(l => (
              <div key={l.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                <div className="flex items-center gap-4">
                    <img src={l.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                        <p className="font-bold text-slate-900">{l.title}</p>
                        <p className="text-xs text-slate-500">{l.location} • <span className="text-rose-500">{l.price}€</span></p>
                    </div>
                </div>
                <button 
                  onClick={() => deleteListing(l.id)} 
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  title="Pašalinti skelbimą"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* VISOS REZERVACIJOS */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-6 text-slate-800">
            <Calendar className="text-rose-500" /> Rezervacijos ({data.bookings.length})
          </h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 text-sm">
            {data.bookings.map(b => (
              <div key={b.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                    <p className="font-bold text-slate-900">{b.title}</p>
                    <p className="text-xs text-slate-500 italic">Vartotojas: {b.user_email}</p>
                </div>
                <button 
                  onClick={() => deleteBooking(b.id)} 
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  title="Atšaukti rezervaciją"
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