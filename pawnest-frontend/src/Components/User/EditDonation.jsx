import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import { API_URL } from "../../api";
import { FiEdit3, FiSave } from "react-icons/fi";

const EditDonation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null);

    useEffect(() => {
        axios.get(`${API_URL}/donation-campaigns/${id}`)
            .then(res => setCampaign(res.data))
            .catch(err => Swal.fire("Error", "Failed to load campaign", "error"));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`${API_URL}/donation-campaigns/${id}`, {
                maxAmount: Number(campaign.maxAmount),
                paused: campaign.paused
            });
            Swal.fire({ title: "Updated!", text: "Campaign changes saved.", icon: "success", background: "#f5ebdd", confirmButtonColor: "#6f4e37" });
            navigate("/dashboard/mydonationcampaigns"); 
        } catch (err) { Swal.fire("Error", "Update failed", "error"); }
    };

    if (!campaign) return <div className="p-20 text-center font-display text-espresso">Loading...</div>;

    return (
        <div className="max-w-2xl space-y-6">
            <h1 className="font-display text-4xl font-medium text-espresso">Edit Campaign</h1>
            <div className="glass-light border border-espresso/10 rounded-[2.5rem] p-10 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-coffee ml-2">Pet Name</label>
                            <input type="text" value={campaign.petName} disabled className="w-full rounded-2xl border border-espresso/10 bg-white/40 px-5 py-4 text-espresso/50 cursor-not-allowed shadow-inner" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-coffee ml-2">Creator</label>
                            <input type="text" value={campaign.userEmail} disabled className="w-full rounded-2xl border border-espresso/10 bg-white/40 px-5 py-4 text-espresso/50 cursor-not-allowed shadow-inner" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase font-bold text-coffee ml-2">Goal Amount (BDT)</label>
                        <input type="number" name="maxAmount" value={campaign.maxAmount} onChange={(e) => setCampaign({...campaign, maxAmount: e.target.value})} className="w-full rounded-2xl border border-espresso/20 bg-white/90 px-5 py-4 text-espresso outline-none focus:border-coffee shadow-sm font-bold text-lg" required />
                    </div>

                    <div className="flex items-center justify-between p-6 rounded-2xl bg-white/60 border border-espresso/5">
                        <span className="font-medium text-espresso">Current Campaign Status:</span>
                        <button type="button" onClick={() => setCampaign(prev => ({ ...prev, paused: !prev.paused }))}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md ${campaign.paused ? "bg-error text-white" : "bg-success text-white"}`}>
                            {campaign.paused ? "Paused" : "Active & Running"}
                        </button>
                    </div>

                    <button type="submit" className="w-full rounded-2xl bg-coffee py-5 font-display text-xl font-bold text-foam shadow-xl hover:bg-espresso transition-all flex items-center justify-center gap-3">
                        <FiSave /> Save Campaign Updates
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditDonation;