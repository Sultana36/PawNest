import { useContext, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { API_URL } from "../../api";
import { FiHeart } from "react-icons/fi";

const CreateDonationCampaign = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ petImage: null, petName: '', maxAmount: '', deadline: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imgForm = new FormData(); imgForm.append('image', formData.petImage);
      const imgRes = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOSTING_KEY}`, imgForm);
      const campaignData = { petImage: imgRes.data.data.url, maxAmount: parseFloat(formData.maxAmount), petName: formData.petName, deadline: new Date(formData.deadline), description: formData.description, userEmail: user?.email, createdAt: new Date() };
      const res = await axios.post(`${API_URL}/donation-campaign`, campaignData);
      if (res.data.insertedId) {
        toast.success('Campaign Created! Awaiting Approval.');
        setFormData({ petImage: null, maxAmount: '', deadline: '', description: '', petName: '' });
      }
    } catch (err) { toast.error('Creation failed.'); }
  };

  return (
    <div className="mx-auto flex flex-col items-center max-w-4xl space-y-6 w-full px-4">
      <ToastContainer theme="dark" />
      <h1 className="font-display text-4xl font-medium text-espresso text-center">Start a Rescue Campaign</h1>
      <div className="glass-light border border-espresso/10 rounded-[3rem] p-10 shadow-2xl w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-coffee uppercase ml-2">Pet Image</label>
            <input type="file" accept="image/*" onChange={(e) => setFormData({...formData, petImage: e.target.files[0]})} required className="file-input file-input-bordered bg-white/60 rounded-xl" />
          </div>
          <input type="text" placeholder="Pet Name" value={formData.petName} onChange={(e) => setFormData({...formData, petName: e.target.value})} className="w-full rounded-2xl border border-espresso/20 bg-white/80 px-5 py-4 text-espresso outline-none focus:border-coffee shadow-sm" required />
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-coffee uppercase ml-2">Goal Amount (BDT)</label>
              <input type="number" value={formData.maxAmount} onChange={(e) => setFormData({...formData, maxAmount: e.target.value})} className="rounded-2xl border border-espresso/20 bg-white/80 px-5 py-4 text-espresso outline-none focus:border-coffee shadow-sm" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-coffee uppercase ml-2">Deadline</label>
              <input type="date" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} className="rounded-2xl border border-espresso/20 bg-white/80 px-5 py-4 text-espresso outline-none focus:border-coffee shadow-sm" required />
            </div>
          </div>
          <textarea placeholder="Why does this pet need funding? Describe the medical/shelter needs..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full rounded-2xl border border-espresso/20 bg-white/80 px-5 py-4 text-espresso outline-none focus:border-coffee shadow-sm" rows="5" required></textarea>
          <button type="submit" className="w-full rounded-2xl bg-coffee py-4 font-display text-xl font-bold text-foam shadow-xl transition-all hover:bg-espresso hover:shadow-2xl flex items-center justify-center gap-3">
            <FiHeart /> Launch Campaign
          </button>
        </form>
      </div>
    </div>
  );
};
export default CreateDonationCampaign;