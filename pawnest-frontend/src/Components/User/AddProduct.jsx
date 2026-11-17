import { useContext, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../Provider/AuthProvider";
import { API_URL } from "../../api";
import { FiPackage } from "react-icons/fi";

const Addproduct = () => {
  const [image, setImage] = useState(null);
  const {user} = useContext(AuthContext);
  const [product, setProduct] = useState({ name: "", price: "", size: "", stock: "", description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageData = new FormData(); imageData.append("image", image);
      const imgRes = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOSTING_KEY}`, imageData);
      const productData = { ...product, image: imgRes.data.data.display_url, adderName: user.displayName, adderEmail: user.email };
      const res = await axios.post(`${API_URL}/products`, productData);
      if (res.data.insertedId) {
        toast.success("Product listed for approval!");
        setProduct({ name: "", price: "", size: "", stock: "", description: "" });
        setImage(null);
      }
    } catch (error) { toast.error("Submission failed"); }
  };

  return (
    <div className="mx-auto flex flex-col items-center max-w-4xl space-y-6 w-full px-4">
      <ToastContainer theme="dark" />
      <h1 className="font-display text-4xl font-medium text-espresso text-center">Add Product</h1>
      <div className="glass-light border border-espresso/10 rounded-[2.5rem] p-8 shadow-2xl w-full">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-4">
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="file-input file-input-bordered bg-white/60 w-full rounded-xl" required />
          </div>
          <input type="text" placeholder="Product Name" value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})} className="w-full rounded-2xl border border-espresso/20 bg-white/80 px-5 py-4 text-espresso outline-none focus:border-coffee shadow-sm" required />
          <div className="grid grid-cols-3 gap-4">
            <input type="number" placeholder="Price" value={product.price} onChange={(e) => setProduct({...product, price: e.target.value})} className="rounded-2xl border border-espresso/20 bg-white/80 px-5 py-4 text-espresso outline-none focus:border-coffee shadow-sm" required />
            <input type="text" placeholder="Size" value={product.size} onChange={(e) => setProduct({...product, size: e.target.value})} className="rounded-2xl border border-espresso/20 bg-white/80 px-5 py-4 text-espresso outline-none focus:border-coffee shadow-sm" required />
            <input type="number" placeholder="Stock" value={product.stock} onChange={(e) => setProduct({...product, stock: e.target.value})} className="rounded-2xl border border-espresso/20 bg-white/80 px-5 py-4 text-espresso outline-none focus:border-coffee shadow-sm" required />
          </div>
          <textarea placeholder="Product Description..." value={product.description} onChange={(e) => setProduct({...product, description: e.target.value})} className="w-full rounded-2xl border border-espresso/20 bg-white/80 px-5 py-4 text-espresso outline-none focus:border-coffee shadow-sm" rows="4" required></textarea>
          <button type="submit" className="w-full rounded-2xl bg-coffee py-4 font-display text-lg font-semibold text-foam shadow-xl transition-all hover:bg-espresso hover:shadow-2xl active:scale-[0.98]">
            List Product
          </button>
        </form>
      </div>
    </div>
  );
};
export default Addproduct;