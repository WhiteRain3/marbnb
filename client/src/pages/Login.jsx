import { AlertCircle, Lock, LogIn, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Kviečiame AuthService, kuris siunčia užklausą į /api/login
      const user = await AuthService.login(email, password);

      if (user) {
        // Sėkmės atveju nukreipiame į pradinį puslapį
        // Naudojame window.location.href, kad pilnai perkrautume programą ir Navbar pamatytų naują rolę
        window.location.href = '/';
      } else {
        setError('Neteisingas el. paštas arba slaptažodis.');
      }
    } catch (err) {
      setError('Sistemos klaida. Patikrinkite, ar veikia Backend serveris.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-rose-50 text-rose-500 rounded-2xl mb-4">
            <LogIn size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sveiki sugrįžę</h1>
          <p className="text-slate-500 mt-2">Prisijunkite prie savo paskyros</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-3 text-sm font-medium animate-shake">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">
              El. paštas
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="email"
                required
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-rose-500 transition-all outline-none text-slate-800"
                placeholder="vardas@pavyzdys.lt"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">
              Slaptažodis
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="password"
                required
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-rose-500 transition-all outline-none text-slate-800"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl shadow-xl transition-all hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? 'Jungiamasi...' : 'Prisijungti'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center text-sm">
          <span className="text-slate-500">Neturite paskyros? </span>
          <Link to="/register" className="text-rose-500 font-bold hover:underline">
            Užsiregistruokite
          </Link>
        </div>
      </div>

      {/* Testavimo duomenų priminimas (patogu gynimui) */}
      <div className="mt-6 p-4 bg-slate-100 rounded-2xl text-[10px] text-slate-500 leading-relaxed uppercase tracking-tighter text-center">
        Testiniai duomenys: guest@vu.lt / 123 (Vartotojas) | admin@vu.lt / 123 (Admin)
      </div>
    </div>
  );
};

export default Login;