import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { FiArrowUpRight, FiHeart } from "react-icons/fi";
import { API_URL } from "../api";
import PhotoFrame from "./Shared/PhotoFrame";

const DonationCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/donation-campaign`)
      .then((res) => {
        const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCampaigns(sorted);
      })
      .catch((err) => console.error("Error fetching campaigns:", err));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="text-center">
        <span className="font-display text-sm font-semibold uppercase tracking-widest text-coffee">Support a cause</span>
        <h1 className="mt-2 font-display text-4xl font-medium text-espresso sm:text-5xl">Donation Campaigns</h1>
        <p className="mt-3 text-espresso/70">Back a rescue campaign and help pets receive medical care and shelter.</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {campaigns.map((campaign) => {
          const goal = Number(campaign.maxAmount) || 1;
          const raised = Number(campaign.donatedAmount) || 0;
          const progress = Math.min(Math.round((raised / goal) * 100), 100);

          return (
            <div key={campaign._id} className="glass-light glass-lift flex flex-col overflow-hidden rounded-[2rem]">
              <div className="relative h-60 overflow-hidden">
                <PhotoFrame src={campaign.petImage} alt="Pet" className="h-full w-full object-cover" />
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3 className="font-display text-2xl font-medium text-espresso">
                    {campaign.petName || "Untitled Pet"}
                  </h3>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-coffee">৳{raised.toLocaleString()} raised</span>
                      <span className="text-espresso/60">Goal: ৳{goal.toLocaleString()}</span>
                    </div>

                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-espresso/10">
                      <div className="h-full rounded-full bg-coffee transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>

                <Link
                  to={`/donation-details/${campaign._id}`}
                  className="btn-cream mt-6 w-full justify-center !py-2.5 text-sm"
                >
                  View Details <FiArrowUpRight />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {campaigns.length === 0 && (
        <div className="glass-light mt-12 rounded-3xl p-12 text-center">
          <p className="font-display text-2xl text-espresso">No active donation campaigns at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default DonationCampaigns;