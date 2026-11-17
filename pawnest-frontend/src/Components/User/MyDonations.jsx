import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Provider/AuthProvider'; 
import { API_URL } from "../../api";
import PhotoFrame from "../Shared/PhotoFrame";
import { FiHeart, FiCheck } from "react-icons/fi";

const MyDonations = () => {
  const { user } = useContext(AuthContext); 
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    if (user?.email) {
      axios.get(`${API_URL}/donations?email=${user.email}`)
        .then(res => setDonations(res.data))
        .catch(err => console.error(err));
    }
  }, [user?.email]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl font-medium text-espresso">My Donations</h1>
      {donations.length === 0 ? (
        <div className="glass-light rounded-[2rem] p-20 text-center shadow-xl">
            <p className="text-2xl text-espresso/40">No donations recorded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {donations.map((d, index) => (
            <div key={index} className="glass-light border border-espresso/10 rounded-[2.5rem] overflow-hidden shadow-xl flex flex-col group hover:border-coffee/30 transition-all">
              <div className="relative h-56">
                <PhotoFrame src={d.petImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/20 to-transparent"></div>
                <div className="absolute bottom-5 left-6 flex items-center gap-2.5 text-white font-display text-2xl font-bold">
                    <FiHeart className="text-caramel fill-caramel" /> {d.petName}
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[11px] uppercase font-black text-coffee tracking-[0.2em] mb-1">Contribution</p>
                        <div className="text-4xl font-display font-black text-espresso">৳{d.amount}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                         <div className="flex items-center gap-1 bg-success/20 text-success px-2 py-0.5 rounded text-[10px] font-black uppercase">
                            <FiCheck /> Verified
                         </div>
                         <span className="text-[9px] font-bold text-espresso/30 font-mono uppercase tracking-tighter">#{d.tran_id?.slice(0,10)}</span>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDonations;