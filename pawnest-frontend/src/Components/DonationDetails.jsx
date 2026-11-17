import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "./Provider/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import { FiCalendar, FiUser, FiMail, FiPhone, FiMapPin, FiArrowLeft, FiHeart } from "react-icons/fi";
import { API_URL } from "../api";
import PhotoFrame from "./Shared/PhotoFrame";

const DonationDetails = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [users, setUsers] = useState([]);
  const [creator, setCreator] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/donation-campaign/${id}`)
      .then(res => setCampaign(res.data))
      .catch(err => console.error("Error fetching campaign details:", err));
  }, [id]);

  useEffect(() => {
    axios.get(`${API_URL}/users`)
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (campaign && users.length > 0) {
      const matchedUser = users.find(u => u.email === campaign.userEmail);
      setCreator(matchedUser || null);
    }
  }, [campaign, users]);

  const handleDonate = async (e) => {
    e.preventDefault();

    const max = Number(campaign.maxAmount);
    const current = Number(campaign.donatedAmount || 0);
    const newDonation = Number(donationAmount);

    if (current + newDonation > max) {
      Swal.fire("Limit Exceeded", `You cannot donate more than the remaining amount (৳${max - current})`, "warning");
      return;
    }

    const deadline = new Date(campaign.deadline);
    const today = new Date();

    if (today > deadline) {
      Swal.fire("Deadline Passed", "The donation deadline has passed. You can no longer donate.", "warning");
      return;
    }

    const donor = users.find(u => u.email === user?.email);

    const payload = {
      amount: newDonation,
      name: user?.displayName || "Anonymous Donor",
      email: user?.email || "donor@gmail.com",
      phone: donor?.phone || "01700000000",
      campaignId: campaign._id,
      petImage: campaign.petImage,
      petName: campaign.petName
    };

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/payment`, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 20000,
      });

      if (res.data && res.data.url) {
        window.location.href = res.data.url;
      } else {
        alert("Payment could not be started.");
      }
    } catch (err) {
      console.error("Error calling /api/payment:", err.response?.data || err.message);
      alert("Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  if (!campaign) return <div className="p-20 text-center font-display text-2xl text-espresso">Loading campaign details...</div>;

  const goal = Number(campaign.maxAmount) || 1;
  const raised = Number(campaign.donatedAmount) || 0;
  const progress = Math.min(Math.round((raised / goal) * 100), 100);

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <ToastContainer theme="dark" />

      <div className="glass-light overflow-hidden rounded-[2.5rem] p-6 sm:p-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative h-[400px] overflow-hidden rounded-3xl shadow-xl">
            <PhotoFrame src={campaign.petImage} alt="Pet" className="h-full w-full object-cover" />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h1 className="font-display text-4xl font-medium text-espresso sm:text-5xl">{campaign.petName}</h1>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-coffee">৳{raised.toLocaleString()} raised</span>
                  <span className="text-espresso/65">Goal: ৳{goal.toLocaleString()}</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-espresso/10">
                  <div className="h-full rounded-full bg-coffee transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <p className="mt-4 flex items-center gap-2 text-sm text-espresso/70">
                <FiCalendar className="text-coffee" /> Deadline: {new Date(campaign.deadline).toLocaleDateString()}
              </p>

              <p className="mt-6 leading-relaxed text-espresso/75">{campaign.description}</p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {user && user.emailVerified ? (
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={campaign.status == 'Paused' || campaign.paused == true}
                  className="btn-cream flex-1 justify-center !py-3 text-base shadow-lg disabled:opacity-50"
                >
                  <FiHeart /> {campaign.status == 'Paused' || campaign.paused == true ? "Campaign Paused" : "Donate Now"}
                </button>
              ) : (
                <Link to='/login' className="btn-cream flex-1 justify-center !py-3 text-base">
                  <FiHeart /> Log in to Donate
                </Link>
              )}

              <Link to='/donationcampaigns' className="btn-glass !border-espresso/20 !bg-espresso/5 !text-espresso hover:!bg-espresso/10">
                <FiArrowLeft /> Back
              </Link>
            </div>
          </div>
        </div>

        {creator && (
          <div className="mt-12 rounded-3xl border border-espresso/10 bg-white/40 p-6 sm:p-8">
            <h3 className="font-display text-2xl font-medium text-espresso">Creator Information</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-espresso/80">
              <p className="flex items-center gap-2"><FiUser className="text-coffee" /> <strong>Name:</strong> {creator.name || "N/A"}</p>
              <p className="flex items-center gap-2"><FiMail className="text-coffee" /> <strong>Email:</strong> {creator.email}</p>
              {creator.phone && <p className="flex items-center gap-2"><FiPhone className="text-coffee" /> <strong>Phone:</strong> {creator.phone}</p>}
              {creator.city && <p className="flex items-center gap-2"><FiMapPin className="text-coffee" /> <strong>City:</strong> {creator.city}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-espresso/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

          <div className="glass-dark relative z-10 w-full max-w-md rounded-[2rem] p-8">
            <h3 className="font-display text-2xl font-medium text-cream">Donate to {campaign.petName}</h3>
            <p className="mt-1 text-sm text-cream/70">Support this campaign securely with SSLCommerz.</p>

            <form onSubmit={handleDonate} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-cream/80">Donation Amount (৳)</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full rounded-2xl border border-cream/20 bg-white/10 px-4 py-3 text-cream outline-none focus:border-caramel"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-cream w-full justify-center !py-3 text-base">
                {loading ? "Processing..." : "Confirm & Pay"}
              </button>
            </form>

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 block w-full text-center text-sm font-semibold text-cream/70 hover:text-cream"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationDetails;