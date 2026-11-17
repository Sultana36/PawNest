import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { API_URL } from "../../api";
import PhotoFrame from "../Shared/PhotoFrame";

const AllDonations = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [editingCampaign, setEditingCampaign] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(`${API_URL}/donationcampaigns`);
      setCampaigns(res.data);
    } catch (error) {
      toast.error("Failed to fetch campaigns");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This campaign will be deleted.",
      icon: "warning",
      background: "#f5ebdd",
      color: "#2b1b14",
      confirmButtonColor: "#b5523b",
      cancelButtonColor: "#6f4e37",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/donationcampaigns/${id}`);
      toast.success("Campaign deleted");
      fetchCampaigns();
    } catch (error) {
      toast.error("Failed to delete campaign");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Paused" : "Active";
    try {
      await axios.patch(`${API_URL}/donationcampaigns/${id}`, { status: newStatus });
      toast.success(`Campaign ${newStatus.toLowerCase()} successfully`);
      fetchCampaigns();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleEdit = async () => {
    try {
      await axios.patch(`${API_URL}/donationcampaigns/${editingCampaign._id}`, {
        title: editingCampaign.title,
        description: editingCampaign.description,
        petImage: editingCampaign.petImage,
        maxAmount: editingCampaign.maxAmount,
        petName: editingCampaign.petName,
        deadline: editingCampaign.deadline,
        userEmail: editingCampaign.userEmail,
      });
      toast.success("Campaign updated");
      setEditingCampaign(null);
      fetchCampaigns();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="space-y-8">
      <ToastContainer theme="dark" />
      <div>
        <h1 className="font-display text-3xl font-medium text-espresso">All Donation Campaigns</h1>
        <p className="mt-1 text-sm text-espresso/70">Manage, pause, or update rescue funding campaigns.</p>
      </div>

      <div className="glass-light overflow-x-auto rounded-[2rem] p-6 shadow-xl">
        <table className="w-full text-left text-sm text-espresso">
          <thead className="border-b border-espresso/10 text-xs uppercase tracking-wider text-coffee">
            <tr>
              <th className="py-3.5 pl-4">#</th>
              <th className="py-3.5">Pet</th>
              <th className="py-3.5">Name</th>
              <th className="py-3.5">Max Amount</th>
              <th className="py-3.5">Deadline</th>
              <th className="py-3.5">Creator</th>
              <th className="py-3.5">Raised</th>
              <th className="py-3.5">Status</th>
              <th className="py-3.5 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-espresso/5">
            {campaigns.map((c, index) => (
              <tr key={c._id} className="transition-colors hover:bg-white/40">
                <td className="py-4 pl-4 font-semibold">{index + 1}</td>
                <td className="py-4">
                  <div className="h-12 w-12 overflow-hidden rounded-xl shadow-md">
                    <PhotoFrame src={c.petImage} alt={c.petName} className="h-full w-full object-cover" />
                  </div>
                </td>
                <td className="py-4 font-medium text-espresso">{c.petName}</td>
                <td className="py-4">৳{c.maxAmount}</td>
                <td className="py-4">{new Date(c.deadline).toLocaleDateString()}</td>
                <td className="py-4 text-xs text-espresso/70">{c.userEmail}</td>
                <td className="py-4 font-semibold text-coffee">৳{c.donatedAmount || 0}</td>
                <td className="py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${c.status === 'Paused' ? 'bg-error/15 text-error' : 'bg-success/15 text-success'}`}>
                    {c.status || "Active"}
                  </span>
                </td>
                <td className="py-4 pr-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleToggleStatus(c._id, c.status)}
                      className="rounded-full bg-coffee/15 px-3 py-1.5 text-xs font-semibold text-coffee hover:bg-coffee hover:text-cream transition"
                    >
                      {c.status === "Paused" ? "Resume" : "Pause"}
                    </button>
                    <button
                      onClick={() => setEditingCampaign(c)}
                      className="rounded-full bg-caramel/20 px-3 py-1.5 text-xs font-semibold text-espresso hover:bg-caramel transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="rounded-full bg-error/15 px-3 py-1.5 text-xs font-semibold text-error hover:bg-error hover:text-white transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-espresso/60 backdrop-blur-sm" onClick={() => setEditingCampaign(null)} />

          <div className="glass-dark relative z-10 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="font-display text-2xl font-medium text-cream">Edit Campaign</h3>
            <p className="mt-1 text-sm text-cream/70">Update rescue campaign details.</p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-cream/80">Pet Name</label>
                <input
                  type="text"
                  value={editingCampaign.petName}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, petName: e.target.value })}
                  className="w-full rounded-2xl border border-cream/20 bg-white/10 px-4 py-3 text-cream outline-none focus:border-caramel"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-cream/80">Maximum Amount (৳)</label>
                <input
                  type="number"
                  value={editingCampaign.maxAmount}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, maxAmount: e.target.value })}
                  className="w-full rounded-2xl border border-cream/20 bg-white/10 px-4 py-3 text-cream outline-none focus:border-caramel"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-cream/80">Deadline</label>
                <input
                  type="date"
                  value={editingCampaign.deadline ? editingCampaign.deadline.split('T')[0] : ''}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, deadline: e.target.value })}
                  className="w-full rounded-2xl border border-cream/20 bg-white/10 px-4 py-3 text-cream outline-none focus:border-caramel"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-cream/80">Owner Email</label>
                <input
                  type="email"
                  value={editingCampaign.userEmail}
                  disabled
                  className="w-full rounded-2xl border border-cream/10 bg-white/5 px-4 py-3 text-cream/50 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setEditingCampaign(null)}
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-cream/70 hover:text-cream"
              >
                Cancel
              </button>
              <button onClick={handleEdit} className="btn-cream !py-2.5 text-sm">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllDonations;