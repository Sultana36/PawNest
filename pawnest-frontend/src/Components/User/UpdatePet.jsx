import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_URL } from "../../api";
import { FiSave, FiArrowLeft } from "react-icons/fi";

const UpdatePet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [petData, setPetData] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/pet-list/${id}`)
      .then(res => setPetData(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedPet = { ...petData };
    if (imageFile) {
        // Upload to ImgBB first instead of Base64 for cleaner DB
        const formData = new FormData(); formData.append('image', imageFile);
        const imgRes = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOSTING_KEY}`, formData);
        updatedPet.image = imgRes.data.data.url;
    }

    try {
      await axios.patch(`${API_URL}/pet-list/${id}`, updatedPet);
      Swal.fire({ title: 'Success!', text: 'Pet updated successfully!', icon: 'success', background: "#f5ebdd", confirmButtonColor: "#6f4e37" });
      navigate('/dashboard/myaddedpets');
    } catch (err) { console.error(err); }
  };

  if (!petData) return <div className="p-20 text-center font-display text-espresso">Loading...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
          <h1 className="font-display text-4xl font-medium text-espresso">Update Pet</h1>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-coffee font-bold hover:underline"><FiArrowLeft/> Back</button>
      </div>
      
      <div className="glass-light border border-espresso/10 rounded-[3rem] p-10 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-coffee ml-2">Pet Name</label>
                    <input name="name" value={petData.name} onChange={(e) => setPetData({...petData, name: e.target.value})} className="w-full rounded-2xl border border-espresso/20 bg-white/80 px-5 py-4 text-espresso outline-none focus:border-coffee shadow-sm" required />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-coffee ml-2">Age</label>
                    <input name="age" value={petData.age} onChange={(e) => setPetData({...petData, age: e.target.value})} className="w-full rounded-2xl border border-espresso/20 bg-white/80 px-5 py-4 text-espresso outline-none focus:border-coffee shadow-sm" required />
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-coffee ml-2">Category</label>
                    <select name="category" value={petData.category} onChange={(e) => setPetData({...petData, category: e.target.value})} className="w-full rounded-2xl border border-espresso/20 bg-white/80 px-5 py-4 text-espresso outline-none focus:border-coffee shadow-sm" required>
                        <option value="Dog">Dog</option><option value="Cat">Cat</option><option value="Bird">Bird</option><option value="Rabbit">Rabbit</option><option value="Fish">Fish</option><option value="Other">Other</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-coffee ml-2">Location</label>
                    <input name="location" value={petData.location} onChange={(e) => setPetData({...petData, location: e.target.value})} className="w-full rounded-2xl border border-espresso/20 bg-white/80 px-5 py-4 text-espresso outline-none focus:border-coffee shadow-sm" required />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-coffee ml-2">Detailed Description</label>
                <textarea name="description" value={petData.description} onChange={(e) => setPetData({...petData, description: e.target.value})} className="w-full rounded-2xl border border-espresso/20 bg-white/80 px-5 py-4 text-espresso outline-none focus:border-coffee shadow-sm" rows="4" required />
            </div>

            <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-coffee ml-2">Update Image (Optional)</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="file-input file-input-bordered bg-white/60 w-full rounded-2xl" />
            </div>

            <button type="submit" className="w-full rounded-2xl bg-coffee py-5 font-display text-xl font-bold text-foam shadow-xl hover:bg-espresso transition-all flex items-center justify-center gap-3">
                <FiSave /> Update Pet Details
            </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePet;