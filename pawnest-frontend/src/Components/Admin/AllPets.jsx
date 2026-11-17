import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { API_URL } from "../../api";
import PhotoFrame from "../Shared/PhotoFrame";

const AllPets = () => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [updateData, setUpdateData] = useState({ name: "", category: "", age: "", location: "" });

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const res = await axios.get(`${API_URL}/petlist`);
      setPets(res.data);
    } catch (error) {
      console.error("Failed to fetch pets", error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      background: "#f5ebdd",
      color: "#2b1b14",
      confirmButtonColor: "#b5523b",
      cancelButtonColor: "#6f4e37",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!"
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/petlist/${id}`);
      toast.success("Pet deleted successfully");
      fetchPets();
    } catch (error) {
      toast.error("Failed to delete pet");
    }
  };

  const openUpdateModal = (pet) => {
    setSelectedPet(pet);
    setUpdateData({ name: pet.name, category: pet.category, age: pet.age, location: pet.location });
  };

  const handleUpdateChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async () => {
    try {
      await axios.patch(`${API_URL}/petlist/${selectedPet._id}`, updateData);
      toast.success("Pet updated successfully");
      setSelectedPet(null);
      fetchPets();
    } catch (error) {
      toast.error("Failed to update pet");
    }
  };

  return (
    <div className="space-y-8">
      <ToastContainer theme="dark" />
      <div>
        <h1 className="font-display text-3xl font-medium text-espresso">All Added Pets</h1>
        <p className="mt-1 text-sm text-espresso/70">Manage platform-wide pet listings.</p>
      </div>

      <div className="glass-light overflow-x-auto rounded-[2rem] p-6 shadow-xl">
        <table className="w-full text-left text-sm text-espresso">
          <thead className="border-b border-espresso/10 text-xs uppercase tracking-wider text-coffee">
            <tr>
              <th className="py-3.5 pl-4">#</th>
              <th className="py-3.5">Image</th>
              <th className="py-3.5">Pet Name</th>
              <th className="py-3.5">Category</th>
              <th className="py-3.5">Added By</th>
              <th className="py-3.5 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-espresso/5">
            {pets.map((pet, index) => (
              <tr key={pet._id} className="transition-colors hover:bg-white/40">
                <td className="py-4 pl-4 font-semibold">{index + 1}</td>
                <td className="py-4">
                  <div className="h-12 w-12 overflow-hidden rounded-xl shadow-md">
                    <PhotoFrame src={pet.image} alt={pet.name} className="h-full w-full object-cover" />
                  </div>
                </td>
                <td className="py-4 font-medium text-espresso">{pet.name}</td>
                <td className="py-4">
                  <span className="rounded-full bg-coffee/10 px-3 py-1 text-xs font-semibold text-coffee">
                    {pet.category}
                  </span>
                </td>
                <td className="py-4 text-xs text-espresso/70">{pet.userEmail}</td>
                <td className="py-4 pr-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openUpdateModal(pet)}
                      className="rounded-full bg-caramel/20 px-3.5 py-1.5 text-xs font-semibold text-espresso hover:bg-caramel transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(pet._id)}
                      className="rounded-full bg-error/15 px-3.5 py-1.5 text-xs font-semibold text-error hover:bg-error hover:text-white transition"
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

      {/* Modal */}
      {selectedPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-espresso/60 backdrop-blur-sm" onClick={() => setSelectedPet(null)} />

          <div className="glass-dark relative z-10 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="font-display text-2xl font-medium text-cream">Update Pet</h3>
            <p className="mt-1 text-sm text-cream/70">Modify pet details below.</p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-cream/80">Pet Name</label>
                <input
                  type="text"
                  name="name"
                  value={updateData.name}
                  onChange={handleUpdateChange}
                  className="w-full rounded-2xl border border-cream/20 bg-white/10 px-4 py-3 text-cream outline-none focus:border-caramel"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-cream/80">Category</label>
                <input
                  type="text"
                  name="category"
                  value={updateData.category}
                  onChange={handleUpdateChange}
                  className="w-full rounded-2xl border border-cream/20 bg-white/10 px-4 py-3 text-cream outline-none focus:border-caramel"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-cream/80">Age</label>
                <input
                  type="text"
                  name="age"
                  value={updateData.age}
                  onChange={handleUpdateChange}
                  className="w-full rounded-2xl border border-cream/20 bg-white/10 px-4 py-3 text-cream outline-none focus:border-caramel"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-cream/80">Location</label>
                <input
                  type="text"
                  name="location"
                  value={updateData.location}
                  onChange={handleUpdateChange}
                  className="w-full rounded-2xl border border-cream/20 bg-white/10 px-4 py-3 text-cream outline-none focus:border-caramel"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setSelectedPet(null)}
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-cream/70 hover:text-cream"
              >
                Cancel
              </button>
              <button onClick={handleUpdateSubmit} className="btn-cream !py-2.5 text-sm">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPets;