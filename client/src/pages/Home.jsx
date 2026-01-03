import { Briefcase, Building2, Footprints, Heart, LayoutGrid, Sun, TreePine, Waves } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ListingCard from '../components/ListingCard';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [cat, setCat] = useState('Visi');
  const [priceLimit, setPriceLimit] = useState(null);
  const [experience, setExperience] = useState('Visi');

  useEffect(() => {
    const fetchFilteredData = async () => {
      let query = `/api/listings?experience=${experience}`;
      if (priceLimit) query += `&maxPrice=${priceLimit}`;
      
      const res = await fetch(query);
      const data = await res.json();
      
      // Kliento pusės filtravimas Miestas/Gamta kategorijoms
      setListings(cat === 'Visi' ? data : data.filter(l => l.category === cat));
    };
    
    fetchFilteredData();
  }, [cat, priceLimit, experience]);

  return (
    <div className="space-y-10">
      {/* Patirties (Emocinis) filtras */}
      <div className="flex flex-wrap justify-center gap-4 py-2">
        {[
          {n:'Visi', i:<LayoutGrid size={18}/>},
          {n:'Poilsiui', i:<Sun size={18}/>},
          {n:'Romantika', i:<Heart size={18}/>},
          {n:'Darbui', i:<Briefcase size={18}/>},
          {n:'Aktyviam laisvalaikiui', i:<Footprints size={18}/>}
        ].map(e => (
          <button 
            key={e.n} 
            onClick={() => setExperience(e.n)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black transition-all ${experience === e.n ? 'bg-rose-500 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100'}`}
          >
            {e.i} {e.n}
          </button>
        ))}
      </div>

      {/* Standartinės kategorijos ir Kainos rėžiai */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b pb-6">
        <div className="flex gap-8">
          {[{n:'Visi', i:<LayoutGrid/>}, {n:'Miestas', i:<Building2/>}, {n:'Gamta', i:<TreePine/>}, {n:'Pajūris', i:<Waves/>}].map(c => (
            <button key={c.n} onClick={() => setCat(c.n)} className={`flex flex-col items-center gap-1 transition-colors ${cat === c.n ? 'text-rose-500' : 'text-slate-400 hover:text-slate-600'}`}>
              {c.i} <span className="text-[10px] font-black uppercase tracking-tighter">{c.n}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl">
          {[
            {l: 'Visi', v: null},
            {l: 'Iki 80€', v: 80},
            {l: '80€ - 150€', v: 150},
            {l: 'Premium', v: 9999}
          ].map(p => (
            <button 
              key={p.l} 
              onClick={() => setPriceLimit(p.v)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${priceLimit === p.v ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              {p.l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {listings.map(l => <ListingCard key={l.id} listing={l} />)}
        {listings.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold italic">
            Pagal pasirinktus filtrus būstų nerasta.
          </div>
        )}
      </div>
    </div>
  );
};
export default Home;