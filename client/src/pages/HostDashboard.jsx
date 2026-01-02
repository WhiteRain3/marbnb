import { Euro, Image as ImageIcon, LayoutGrid, MapPin, Tag, Type } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HostDashboard = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    price: '',
    location: '',
    category: 'Miestas', // Pradinė reikšmė sutampa su pirmu pasirinkimu
    image: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!form.title || !form.price || !form.location) {
      setError("Užpildykite visus privalomus laukus!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          image: form.image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
        })
      });

      if (res.ok) {
        navigate('/');
      } else {
        setError("Klaida išsaugant skelbimą.");
      }
    } catch (err) {
      setError("Serverio ryšio klaida.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl">
          <LayoutGrid size={24} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Pridėti naują būstą</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-bold border border-rose-100">{error}</div>}
        
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
            <Type size={14} /> Pavadinimas
          </label>
          <input 
            placeholder="pvz. Jaukus butas Vilniaus centre" 
            className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-rose-500 transition-all" 
            onChange={e => setForm({...form, title: e.target.value})} 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
              <MapPin size={14} /> Vieta
            </label>
            <input 
              placeholder="Miestas, šalis" 
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-rose-500 transition-all" 
              onChange={e => setForm({...form, location: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
              <Euro size={14} /> Kaina
            </label>
            <input 
              type="number" 
              placeholder="€ už naktį" 
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-rose-500 transition-all" 
              onChange={e => setForm({...form, price: e.target.value})} 
            />
          </div>
        </div>

        {/* --- Čia yra tavo ieškomas KATEGORIJOS PASIRINKIMAS --- */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
            <Tag size={14} /> Kategorija (filtravimui)
          </label>
          <select 
            className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-rose-500 appearance-none cursor-pointer font-medium text-slate-700"
            value={form.category}
            onChange={e => setForm({...form, category: e.target.value})}
          >
            <option value="Miestas">Miestas</option>
            <option value="Gamta">Gamta</option>
            <option value="Pajūris">Pajūris</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
            <ImageIcon size={14} /> Nuotraukos URL
          </label>
          <input 
            placeholder="https://..." 
            className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-rose-500 transition-all" 
            onChange={e => setForm({...form, image: e.target.value})} 
          />
        </div>
        
        <button 
          disabled={loading}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-rose-100 transition-all hover:-translate-y-1 disabled:opacity-50"
        >
          {loading ? "Skelbiama..." : "Paskelbti skelbimą"}
        </button>
      </form>
    </div>
  );
};

export default HostDashboard;