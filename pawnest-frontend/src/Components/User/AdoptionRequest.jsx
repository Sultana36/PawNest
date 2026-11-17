import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { API_URL } from "../../api";
import PhotoFrame from "../Shared/PhotoFrame";
import { FiTrash2, FiMapPin, FiMail, FiPhone } from "react-icons/fi";

const AdoptionRequest = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (user?.email) {
      axios.get(`${API_URL}/adopt?ownerEmail=${user.email}`)
        .then((res) => setRequests(res.data))
        .catch((err) => console.error(err));
    }
  }, [user?.email]);

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/adopt-request/${id}`)
      .then(() => {
        toast.success("Request removed");
        setRequests((prev) => prev.filter((req) => req._id !== id));
      });
  };

  return (
    <div className="space-y-6">
      <ToastContainer theme="dark" />
      <h1 className="font-display text-4xl font-medium text-espresso">Adoption Requests</h1>
      
      <div className="glass-light border border-espresso/10 overflow-x-auto rounded-[2rem] p-6 shadow-2xl">
        <table className="w-full text-left text-sm text-espresso border-separate border-spacing-y-2">
          <thead className="text-xs uppercase tracking-widest text-coffee font-bold">
            <tr>
              <th className="pb-4 pl-4">Pet</th>
              <th className="pb-4">Adopter</th>
              <th className="pb-4">Contact Info</th>
              <th className="pb-4">Location</th>
              <th className="pb-4 pr-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-espresso/5">
            {requests.map((req) => (
              <tr key={req._id} className="group transition-colors hover:bg-white/50">
                <td className="py-4 pl-4">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded-xl shadow-md border border-white">
                      <PhotoFrame src={req.petImage} className="h-full w-full object-cover" />
                    </div>
                    <span className="font-display text-lg font-medium text-espresso">{req.petName}</span>
                  </div>
                </td>
                <td className="py-4 font-semibold text-espresso">{req.adopterName}</td>
                <td className="py-4">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1.5 text-espresso/70"><FiMail size={14}/> {req.adopterEmail}</span>
                    <span className="flex items-center gap-1.5 font-bold text-coffee"><FiPhone size={14}/> {req.phone}</span>
                  </div>
                </td>
                <td className="py-4">
                   <span className="flex items-center gap-1.5 text-espresso/70"><FiMapPin size={14}/> {req.address}</span>
                </td>
                <td className="py-4 pr-4 text-right">
                  <button onClick={() => handleDelete(req._id)} className="p-3 rounded-full bg-error/10 text-error hover:bg-error hover:text-white transition shadow-sm">
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {requests.length === 0 && <p className="py-20 text-center text-espresso/40 font-display text-xl">No adoption requests found yet.</p>}
      </div>
    </div>
  );
};

export default AdoptionRequest;