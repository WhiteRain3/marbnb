import { AlertCircle, BarChart3, Home, Trash2, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState({ bookingsCount: 0, usersCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vietoj DatabaseService.query naudojame fetch į mūsų API
    const fetchAdminData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/listings');
        const data = await response.json();
        setListings(data);
        
        // Čia galite pridėti papildomus API kvietimus vartotojų skaičiui ir t.t.
        setStats(prev => ({ ...prev, usersCount: 3 })); // Pavyzdys, kol neturime stats API
      } catch (error) {
        console.error("Klaida gaunant duomenis:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Ar tikrai norite pašalinti šį skelbimą?")) {
      try {
        // Galite sukurti DELETE endpointą serveryje
        await fetch(`http://localhost:5000/api/listings/${id}`, { method: 'DELETE' });
        setListings(listings.filter(l => l.id !== id));
      } catch (error) {
        alert("Nepavyko ištrinti");
      }
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Kraunami duomenys...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-slate-900">Sistemos valdymas</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Users /></div>
          <div><p className="text-sm text-slate-500">Vartotojai</p><p className="text-2xl font-bold">{stats.usersCount}</p></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl"><Home /></div>
          <div><p className="text-sm text-slate-500">Skelbimai</p><p className="text-2xl font-bold">{listings.length}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Pavadinimas</th>
              <th className="px-6 py-4 text-right">Veiksmai</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {listings.map(l => (
              <tr key={l.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-bold">{l.title}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(l.id)} className="text-rose-500 p-2"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;