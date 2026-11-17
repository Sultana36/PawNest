import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../api";
import PhotoFrame from "../Shared/PhotoFrame";

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/donations-admin`)
      .then(res => setDonations(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-medium text-espresso">Donation History</h1>
        <p className="mt-1 text-sm text-espresso/70">Complete log of all successful donations.</p>
      </div>

      {donations.length === 0 ? (
        <div className="glass-light rounded-3xl p-12 text-center">
          <p className="font-display text-2xl text-espresso">No donations found.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {donations.map((donation) => (
            <div key={donation._id} className="glass-light glass-lift flex flex-col overflow-hidden rounded-[2rem]">
              <div className="relative h-48 overflow-hidden">
                <PhotoFrame src={donation.petImage} alt={donation.petName} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3 className="font-display text-2xl font-medium text-espresso">{donation.petName}</h3>
                  <p className="mt-2 text-sm font-semibold text-coffee">Donated: ৳{donation.amount} BDT</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationHistory;