import { Link, useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./Provider/AuthProvider";
import { toast, ToastContainer } from 'react-toastify';
import { FiCalendar, FiMapPin, FiTag, FiArrowLeft, FiHeart } from "react-icons/fi";
import { API_URL } from "../api";
import PhotoFrame from "./Shared/PhotoFrame";
import 'react-toastify/dist/ReactToastify.css';

const PetDetails = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/pet-list/${id}`)
      .then(res => setPet(res.data))
      .catch(err => console.error("Error fetching pet details:", err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const adoptionData = {
      petName: pet.name,
      petImage: pet.image,
      petAge: pet.age,
      petCategory: pet.category,
      petLocation: pet.location,
      PetDescription: pet.description,
      adopterName: user.displayName,
      adopterEmail: user.email,
      ownerEmail: pet.userEmail,
      phone,
      address,
    };

    axios.post(`${API_URL}/adopt`, adoptionData)
      .then(() => {
        toast.success("Adoption request submitted successfully!", {
          position: 'top-center',
          autoClose: 2000
        });
        setShowModal(false);
        setPhone("");
        setAddress("");
      })
      .catch((err) => console.error("Adoption submission failed:", err));
  };

  if (!pet) return <div className="p-20 text-center font-display text-2xl text-espresso">Loading companion details...</div>;

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <ToastContainer theme="dark" />

      <div className="glass-light overflow-hidden rounded-[2.5rem] p-6 sm:p-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative h-[400px] overflow-hidden rounded-3xl shadow-xl">
            <PhotoFrame src={pet.image} alt={pet.name} className="h-full w-full object-cover" />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-coffee px-4 py-1.5 text-xs font-semibold text-cream">
                <FiTag /> {pet.category}
              </span>
              <h1 className="mt-4 font-display text-4xl font-medium text-espresso sm:text-5xl">{pet.name}</h1>
              
              <div className="mt-4 flex flex-wrap gap-4 text-espresso/80">
                <span className="flex items-center gap-1.5 font-medium">
                  <FiCalendar className="text-coffee" /> Age: {pet.age}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <FiMapPin className="text-coffee" /> Location: {pet.location}
                </span>
              </div>

              <p className="mt-6 leading-relaxed text-espresso/75">{pet.description}</p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {user && user.emailVerified ? (
                <button
                  onClick={() => setShowModal(true)}
                  className="btn-cream flex-1 justify-center !py-3 text-base shadow-lg"
                >
                  <FiHeart /> Adopt {pet.name}
                </button>
              ) : (
                <Link to='/login' className="btn-cream flex-1 justify-center !py-3 text-base">
                  <FiHeart /> Log in to Adopt
                </Link>
              )}

              <Link to='/petlist' className="btn-glass !border-espresso/20 !bg-espresso/5 !text-espresso hover:!bg-espresso/10">
                <FiArrowLeft /> Back
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-espresso/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />

          <div className="glass-dark relative z-10 w-full max-w-md rounded-[2rem] p-8">
            <h3 className="font-display text-2xl font-medium text-cream">Adopt {pet.name}</h3>
            <p className="mt-1 text-sm text-cream/70">Please fill out your contact details for the owner.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-cream/80">Name</label>
                <input
                  type="text"
                  value={user.displayName || ""}
                  readOnly
                  className="w-full rounded-2xl border border-cream/20 bg-white/10 px-4 py-3 text-cream outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-cream/80">Email</label>
                <input
                  type="email"
                  value={user.email || ""}
                  readOnly
                  className="w-full rounded-2xl border border-cream/20 bg-white/10 px-4 py-3 text-cream outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-cream/80">Phone Number</label>
                <input
                  type="number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl border border-cream/20 bg-white/10 px-4 py-3 text-cream outline-none focus:border-caramel"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-cream/80">Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-2xl border border-cream/20 bg-white/10 px-4 py-3 text-cream outline-none focus:border-caramel"
                  rows="3"
                  required
                />
              </div>

              <p className="text-xs text-[#F4A58E]">Only applicable for citizens of {pet.location}</p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-cream/70 hover:text-cream"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-cream !py-2.5 text-sm">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetDetails;