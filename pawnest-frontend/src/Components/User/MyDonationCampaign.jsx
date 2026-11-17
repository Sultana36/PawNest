import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import axios from "axios";
import { Link } from "react-router";
import { API_URL } from "../../api";
import { FiEdit, FiUsers, FiX } from "react-icons/fi";

const MyDonationCampaign = () => {
  const { user } = useContext(AuthContext);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedDonors, setSelectedDonors] = useState([]);
  const [showDonorModal, setShowDonorModal] = useState(false);
 
  useEffect(() => {
    if (user?.email) {
        axios.get(`${API_URL}/donation-campaigns?email=${user.email}`)
          .then(res => setCampaigns(res.data))
          .catch(err => console.error(err));
    }
  }, [user?.email]);

  const handleViewDonors = async (campaignId) => {
    try {
      const res = await axios.get(`${API_URL}/donations/${campaignId}`);
      setSelectedDonors(res.data);
      setShowDonorModal(true);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl font-medium text-espresso">My Campaigns</h1>
      
      <div className="glass-light border border-espresso/10 overflow-x-auto rounded-[2rem] p-6 shadow-2xl">
        <table className="w-full text-left text-sm text-espresso border-separate border-spacing-y-2">
          <thead className="text-xs uppercase tracking-widest text-coffee font-bold">
            <tr>
              <th className="pb-4 pl-4">Pet Name</th>
              <th className="pb-4">Goal Amount</th>
              <th className="pb-4">Progress</th>
              <th className="pb-4 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-espresso/5">
            {campaigns.map(c => {
                const pct = Math.min(Math.round(((c.donatedAmount || 0) / c.maxAmount) * 100), 100);
                return (
                    <tr key={c._id} className="transition-colors hover:bg-white/40">
                        <td className="py-4 pl-4 font-display text-lg font-bold text-espresso">{c.petName}</td>
                        <td className="py-4 font-bold text-coffee">৳{c.maxAmount}</td>
                        <td className="py-4 w-1/3">
                            <div className="flex justify-between text-[10px] font-bold uppercase mb-1 text-espresso/60">
                                <span>৳{c.donatedAmount || 0} raised</span>
                                <span>{pct}%</span>
                            </div>
                            <div className="h-2 w-full bg-espresso/10 rounded-full overflow-hidden">
                                <div className="h-full bg-coffee rounded-full transition-all duration-1000" style={{ width: `${pct}%` }}></div>
                            </div>
                        </td>
                        <td className="py-4 pr-4 text-right">
                            <div className="flex gap-2 justify-end">
                                <Link to={`/dashboard/edit-donation/${c._id}`} className="p-2.5 rounded-full bg-coffee/10 text-coffee hover:bg-coffee hover:text-white transition shadow-sm"><FiEdit size={18}/></Link>
                                <button onClick={() => handleViewDonors(c._id)} className="p-2.5 rounded-full bg-coffee/10 text-coffee hover:bg-coffee hover:text-white transition shadow-sm"><FiUsers size={18}/></button>
                            </div>
                        </td>
                    </tr>
                )
            })}
          </tbody>
        </table>
      </div>

      {showDonorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="absolute inset-0 bg-espresso/40" onClick={() => setShowDonorModal(false)} />
          <div className="glass-dark relative z-10 w-full max-w-md rounded-[3rem] p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-display text-2xl text-cream">Campaign Donors</h3>
                <button onClick={() => setShowDonorModal(false)} className="text-cream/50 hover:text-cream transition"><FiX size={24}/></button>
            </div>
            <div className="max-h-72 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {selectedDonors.map((donor, idx) => (
                  <div key={idx} className="bg-white/10 p-4 rounded-2xl flex justify-between items-center border border-white/5">
                    <div className="text-xs text-cream/70 font-medium truncate max-w-[180px]">{donor.email}</div>
                    <div className="font-bold text-caramel">৳{donor.amount}</div>
                  </div>
                ))}
                {selectedDonors.length === 0 && <p className="text-center text-cream/40 py-10 italic">No donations yet.</p>}
            </div>
            <button onClick={() => setShowDonorModal(false)} className="w-full mt-8 py-3 rounded-xl bg-coffee text-foam font-bold shadow-lg hover:bg-espresso transition-all">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDonationCampaign;