import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { API_URL } from "../../api";
import PhotoFrame from "../Shared/PhotoFrame";
import "react-toastify/dist/ReactToastify.css";

const MngPets = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const res = await axios.get(`${API_URL}/petlist-admin`);
      setPets(res.data);
    } catch (error) {
      toast.error("Failed to load pets");
    }
  };

  const handleStatusChange = async (id, approve) => {
    try {
      await axios.patch(`${API_URL}/petlist-admin/${id}`, { approve });
      toast.success(`Pet ${approve}`);
      fetchPets();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="space-y-8">
      <ToastContainer theme="dark" />

      <div>
        <h1 className="font-display text-3xl font-medium text-espresso">Manage Pets</h1>
        <p className="mt-1 text-sm text-espresso/70">Review and approve new pet adoption listings.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet) => (
          <div key={pet._id} className="glass-light glass-lift flex flex-col overflow-hidden rounded-[2rem]">
            <div className="relative h-52 overflow-hidden">
              <PhotoFrame src={pet.image} alt={pet.name} className="h-full w-full object-cover" />
              <span className={`absolute right-4 top-4 rounded-full px-3.5 py-1 text-xs font-semibold backdrop-blur-md ${pet.approve === 'Accepted' ? 'bg-success text-white' : pet.approve === 'Rejected' ? 'bg-error text-white' : 'bg-espresso/75 text-cream'}`}>
                {pet.approve}
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <h2 className="font-display text-2xl font-medium text-espresso">{pet.name}</h2>
                <div className="mt-3 space-y-1 text-sm text-espresso/75">
                  <p>Breed: <strong className="text-espresso">{pet.breed || pet.category}</strong></p>
                  <p>Age: <strong className="text-espresso">{pet.age}</strong></p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  disabled={pet.approve === "Accepted"}
                  onClick={() => handleStatusChange(pet._id, "Accepted")}
                  className="btn-cream flex-1 justify-center !py-2 text-sm disabled:opacity-40"
                >
                  Accept
                </button>
                <button
                  disabled={pet.approve === "Rejected"}
                  onClick={() => handleStatusChange(pet._id, "Rejected")}
                  className="rounded-full bg-error/15 px-5 py-2 text-sm font-semibold text-error hover:bg-error hover:text-white transition disabled:opacity-40"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MngPets;