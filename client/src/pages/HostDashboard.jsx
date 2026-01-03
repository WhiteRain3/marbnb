import { AlignLeft, Euro, Home, Image as ImageIcon, MapPin, PlusCircle, Sparkles } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AuthService } from '../services/auth';

const HostDashboard = () => {
  const user = AuthService.getUser();
  const [myListings, setMyListings] = useState([]);
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    category: 'Miestas',
    experience_type: 'Poilsiui',
    image: ''
  });

  const fetchMyListings = async () => {
    const res = await fetch('/api/listings');
    const data = await res.json();
    setMyListings(data.filter(l => l.host_email === user.email));
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newListing, host_email: user.email, price: Number(newListing.price) })
    });

    if (res.ok) {
      alert('Skelbimas sėkmingai pridėtas!');
      setNewListing({ title: '', description: '', price: '', location: '', category: 'Miestas', experience_type: 'Poilsiui', image: '' });
      fetchMyListings();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <div className="flex items-center gap-4 p-8 bg-slate-900 text-white rounded-[3rem]">
        <PlusCircle size={32} className="text-rose-500" />
        <h1 className="text-3xl font-black italic tracking-tight">Šeimininko Skydas</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-4">
            <h2 className="text-xl font-black mb-4 flex items-center gap-2"><Sparkles size={20} className="text-rose-500"/> Naujas skelbimas</h2>
            
            <input required className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none" placeholder="Pavadinimas" value={newListing.title} onChange={e => setNewListing({...newListing, title: e.target.value})} />
            <textarea required className="w-full p-4 bg-slate-50 rounded-2xl text-sm h-32 outline-none" placeholder="Aprašymas" value={newListing.description} onChange={e => setNewListing({...newListing, description: e.target.value})} />
            
            <div className="grid grid-cols-2 gap-4">
              <input type="number" required className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none" placeholder="Kaina (€)" value={newListing.price} onChange={e => setNewListing({...newListing, price: e.target.value})} />
              <select className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none" value={newListing.experience_type} onChange={e => setNewListing({...newListing, experience_type: e.target.value})}>
                <option>Poilsiui</option>
                <option>Romantika</option>
                <option>Darbui</option>
                <option>Aktyviam laisvalaikiui</option>
              </select>
            </div>

            <select className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none" value={newListing.category} onChange={e => setNewListing({...newListing, category: e.target.value})}>
              <option>Miestas</option>
              <option>Gamta</option>
              <option>Pajūris</option>
            </select>
            
            <input required className="w-full p-4 bg-slate-50 rounded-2xl text-sm outline-none" placeholder="Nuotraukos URL" value={newListing.image} onChange={e => setNewListing({...newListing, image: e.target.value})} />
            
            <button type="submit" className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black hover:bg-rose-600 transition shadow-lg shadow-rose-200">
              Sukurti skelbimą
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black">Mano būstai ({myListings.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myListings.map(l => (
              <div key={l.id} className="bg-white p-4 rounded-[2rem] border flex gap-4 shadow-sm items-center">
                <img src={l.image} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                <div>
                  <p className="font-black text-slate-900">{l.title}</p>
                  <p className="text-xs text-rose-500 font-black">{l.experience_type}</p>
                  <p className="text-lg font-black">{l.price}€</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;