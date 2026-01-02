import { Heart, MapPin, Share, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ListingDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/listings/${id}`);
        if (!res.ok) throw new Error("Nepavyko gauti duomenų");
        const data = await res.json();
        setListing(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="p-20 text-center font-bold">Kraunama informacija...</div>;
  if (!listing) return <div className="p-20 text-center">Būstas nerastas.</div>;

  const handleBooking = async () => {
  const user = JSON.parse(sessionStorage.getItem('session_user'));
  
  if (!user) {
    alert("Norėdami rezervuoti, turite prisijungti!");
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listing_id: id,
        user_email: user.email,
        date: new Date().toLocaleDateString()
      })
    });

    if (res.ok) {
      alert("Rezervacija sėkminga!");
    } else {
      alert("Klaida vykdant rezervaciją.");
    }
  } catch (err) {
    console.error("Serverio klaida:", err);
  }
};

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{listing.title}</h1>
      <div className="flex justify-between items-center text-sm font-semibold">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Star size={16} className="fill-current"/> {listing.rating || '5.0'}</span>
          <span className="underline">{listing.location}</span>
        </div>
      </div>
      <div className="rounded-3xl overflow-hidden h-[400px]">
        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 text-lg text-slate-700">
          Aprašymas bus čia. Šiuo metu tai yra testinis įrašas iš duomenų bazės.
        </div>
        <div className="border rounded-3xl p-6 shadow-xl space-y-4 h-fit bg-white">
          <div className="text-2xl font-bold">€{listing.price} <span className="text-base font-normal">/ naktis</span></div>
          <button 
  onClick={handleBooking}
  className="w-full bg-rose-500 text-white py-3 rounded-xl font-bold hover:bg-rose-600 transition"
>
  Rezervuoti
</button>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;