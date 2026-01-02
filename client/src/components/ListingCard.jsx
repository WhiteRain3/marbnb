import { Heart, MapPin, Star } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  // Apsauga: jei reitingo nėra, nustatome numatytąją reikšmę arba 0
  const displayRating = listing.rating ? Number(listing.rating).toFixed(1) : "Naujas";

  return (
    <Link to={`/listing/${listing.id}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
        <img 
          src={listing.image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'} 
          alt={listing.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/70 backdrop-blur-md hover:bg-white text-slate-900 transition-colors">
          <Heart size={18} />
        </button>
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-slate-800 truncate">{listing.title}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star size={14} className="fill-amber-500 text-amber-500" />
            <span className="text-sm font-semibold">{displayRating}</span>
          </div>
        </div>
        
        <p className="text-slate-500 text-sm flex items-center gap-1">
          <MapPin size={14} /> {listing.location}
        </p>
        
        <p className="text-sm">
          <span className="font-bold text-slate-900">€{listing.price}</span>
          <span className="text-slate-500"> / naktis</span>
        </p>
      </div>
    </Link>
  );
};

export default ListingCard;