import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ email: '', password: '', role: 'guest' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) navigate('/login');
    else alert("Registracija nepavyko");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-3xl border">
      <h1 className="text-2xl font-black mb-6">Registracija</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <input type="email" placeholder="El. paštas" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" 
               onChange={e => setForm({...form, email: e.target.value})} />
        <input type="password" placeholder="Slaptažodis" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" 
               onChange={e => setForm({...form, password: e.target.value})} />
        <select className="w-full p-4 bg-gray-50 rounded-2xl outline-none" 
                onChange={e => setForm({...form, role: e.target.value})}>
          <option value="guest">Noriu nuomotis (Guest)</option>
          <option value="host">Noriu nuomoti (Host)</option>
        </select>
        <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl">Sukurti paskyrą</button>
      </form>
    </div>
  );
};

export default Register;