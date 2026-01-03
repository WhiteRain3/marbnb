import { Building2, LayoutGrid, TreePine, Waves } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ListingCard from '../components/ListingCard';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [cat, setCat] = useState('Visi');

  useEffect(() => {
    fetch('/api/listings').then(r => r.json()).then(data => {
      setListings(data);
      setFiltered(data);
    });
  }, []);

  useEffect(() => {
    setFiltered(cat === 'Visi' ? listings : listings.filter(l => l.category === cat));
  }, [cat, listings]);

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-6 border-b pb-4">
        {[{n:'Visi', i:<LayoutGrid/>}, {n:'Miestas', i:<Building2/>}, {n:'Gamta', i:<TreePine/>}, {n:'Pajūris', i:<Waves/>}].map(c => (
          <button key={c.n} onClick={() => setCat(c.n)} className={`flex flex-col items-center gap-1 ${cat === c.n ? 'text-rose-500 border-b-2 border-rose-500' : 'text-gray-500'}`}>
            {c.i} <span className="text-xs font-bold">{c.n}</span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(l => <ListingCard key={l.id} listing={l} />)}
      </div>
    </div>
  );
};
export default Home;