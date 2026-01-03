import { Calendar, Euro, Home, Trash2, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AuthService } from '../services/auth';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const user = AuthService.getUser();
  const isHost = user?.role === 'host';

  useEffect(() => {
    if (user) {
      fetch(`/api/bookings?email=${user.email}&role=${user.role}`)
        .then(res => res.json())
        .then(data => setBookings(data))
        .catch(err => console.error("Klaida kraunant rezervacijas:", err));
    }
  }, []);

  const cancelBooking = async (id) => {
    if (window.confirm("Ar tikrai norite atšaukti šią rezervaciją?")) {
      await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      setBookings(bookings.filter(b => b.id !== id));
    }
  };

  // Statistika hostui
  const totalEarnings = bookings.reduce((sum, b) => sum + (Number(b.price) || 0), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black">Valdymo skydas</h1>
        <p className="text-slate-500">Prisijungta kaip: {user?.email} ({user?.role})</p>
      </div>

      {isHost && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <div className="text-rose-500 mb-2"><Users size={24}/></div>
            <div className="text-2xl font-black">{bookings.length}</div>
            <div className="text-slate-500 text-sm font-bold uppercase">Viso užsakymų</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <div className="text-green-500 mb-2"><Euro size={24}/></div>
            <div className="text-2xl font-black">€{totalEarnings}</div>
            <div className="text-slate-500 text-sm font-bold uppercase">Potencialios pajamos</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <div className="text-blue-500 mb-2"><Home size={24}/></div>
            <div className="text-2xl font-black">Aktyvus</div>
            <div className="text-slate-500 text-sm font-bold uppercase">Hosto statusas</div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-bold">{isHost ? "Visi gauti užsakymai" : "Mano kelionės"}</h2>
        {bookings.map(b => (
          <div key={b.id} className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4 items-center">
              <div className="p-4 bg-slate-100 rounded-2xl text-slate-600"><Calendar /></div>
              <div>
                <h3 className="font-bold text-lg">{b.title}</h3>
                <p className="text-slate-500 text-sm">{b.location} • Užsakė: <span className="text-rose-500">{b.user_email}</span></p>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase">Data: {b.date}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <p className="font-black text-xl">€{b.price}</p>
                <p className="text-xs text-slate-400 font-bold uppercase">Statusas: Patvirtinta</p>
              </div>
              <button 
                onClick={() => cancelBooking(b.id)}
                className="p-3 text-rose-500 hover:bg-rose-50 rounded-2xl transition"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
        
        {bookings.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed">
            <p className="text-slate-400 font-medium text-lg">Šiuo metu rezervacijų nėra.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;