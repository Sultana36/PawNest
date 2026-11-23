import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Provider/AuthProvider';
import { toast, ToastContainer } from 'react-toastify';
import { API_URL } from "../../api";
import { FiUploadCloud } from "react-icons/fi";
import 'react-toastify/dist/ReactToastify.css';

const Addpet = () => {
  const { user } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [petData, setPetData] = useState({
    name: '', age: '', category: '', location: '', description: '', image: '',
    userName: user?.displayName, userEmail: user?.email,
  });

  const isOther = petData.category === 'Other';

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    const imgbbApiKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;
    try {
      setUploading(true);
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, formData);
      setPetData({ ...petData, image: res.data.data.url });
      toast.success("Image Ready!");
    } catch (err) { toast.error("Upload failed"); } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory = isOther ? customCategory.trim() : petData.category;
    if (!finalCategory) {
      toast.error("Please type the pet category.");
      return;
    }

    try {
      await axios.post(`${API_URL}/pet-list`, { ...petData, category: finalCategory, addedAt: new Date().toISOString(), adopted: false });
      toast.success('Pet listing submitted!', { position: 'top-center' });
      setPetData({ name: '', age: '', category: '', location: '', description: '', image: '', userEmail: user?.email || '' });
      setCustomCategory('');
    } catch (err) { toast.error('Failed to add pet.'); }
  };

  return (
    <div className="mx-auto flex flex-col items-center max-w-4xl space-y-6 w-full px-4">
      <ToastContainer theme="dark" />
      <h1 className="font-display text-4xl font-medium text-espresso text-center">Add a Pet</h1>
      <div className="glass-light border border-espresso/10 rounded-[2.5rem] p-8 shadow-2xl w-full">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-coffee/30 bg-white/50 p-8 text-center hover:border-coffee/60 transition cursor-pointer">
            <FiUploadCloud size={40} className="text-coffee mb-2" />
            <p className="font-medium text-espresso">{uploading ? "Uploading..." : petData.image ? "Photo Linked ✓" : "Upload Pet Photo"}</p>
            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" required={!petData.image} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <input type="text" placeholder="Pet Name" value={petData.name} onChange={(e) => setPetData({...petData, name: e.target.value})} className="w-full rounded-2xl border border-espresso/20 bg-white/80 px-5 py-4 text-espresso outline-none focus:border-coffee shadow-sm" required />
            <input type="text" placeholder="Age (e.g. 2 years)" value={petData.age} onChange={(e) => setPetData({...petData, age: e.target.value})} className="w-full rounded-2xl border border-espresso/20 bg-white/80 px-5 py-4 text-espresso outline-none focus:border-coffee shadow-sm" required />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-3">
              <select value={petData.category} onChange={(e) => setPetData({...petData, category: e.target.value})} className="w-full rounded-2xl border border-espresso/20 bg-white/80 px-5 py-4 text-espresso outline-none focus:border-coffee shadow-sm" required>
                <option value="" disabled>Select Category</option>
                <option value="Cat">Cat</option><option value="Dog">Dog</option><option value="Rabbit">Rabbit</option>
                <option value="Other">Other (type your own)</option>
              </select>
              {isOther && (
                <input type="text" placeholder="Type the category (e.g. Bird, Hamster)" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} className="w-full rounded-2xl border border-espresso/20 bg-white/80 px-5 py-4 text-espresso outline-none focus:border-coffee shadow-sm" required />
              )}
            </div>
            <input type="text" placeholder="Location" value={petData.location} onChange={(e) => setPetData({...petData, location: e.target.value})} className="w-full rounded-2xl border border-espresso/20 bg-white/80 px-5 py-4 text-espresso outline-none focus:border-coffee shadow-sm h-fit" required />
          </div>
          <textarea placeholder="Describe the pet's personality..." value={petData.description} onChange={(e) => setPetData({...petData, description: e.target.value})} className="w-full rounded-2xl border border-espresso/20 bg-white/80 px-5 py-4 text-espresso outline-none focus:border-coffee shadow-sm" rows="4" required></textarea>
          <button type="submit" disabled={uploading} className="w-full rounded-2xl bg-coffee py-4 font-display text-lg font-semibold text-foam shadow-xl transition-all hover:bg-espresso hover:shadow-2xl active:scale-[0.98] disabled:opacity-50">
            Add Pet to Nest
          </button>
        </form>
      </div>
    </div>
  );
};
export default Addpet;