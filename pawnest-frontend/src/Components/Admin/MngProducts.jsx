import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { API_URL } from "../../api";
import PhotoFrame from "../Shared/PhotoFrame";

const MngProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(`${API_URL}/products`);
    setProducts(res.data);
  };

  const handleApprove = async (id) => {
    await axios.patch(`${API_URL}/products/approve/${id}`);
    fetchProducts();
    toast.success("Product Accepted", { position: 'top-center', autoClose: 2000 });
  };

  const handleReject = async (id) => {
    await axios.patch(`${API_URL}/products/reject/${id}`);
    fetchProducts();
    toast.error("Product Rejected", { position: 'top-center', autoClose: 2000 });
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/products/${id}`);
    fetchProducts();
    toast.error("Product Deleted", { position: 'top-center', autoClose: 2000 });
  };

  return (
    <div className="space-y-8">
      <ToastContainer theme="dark" />

      <div>
        <h1 className="font-display text-3xl font-medium text-espresso">Manage Products</h1>
        <p className="mt-1 text-sm text-espresso/70">Review pet shop items submitted by community sellers.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product._id} className="glass-light glass-lift flex flex-col overflow-hidden rounded-[2rem]">
            <div className="relative h-52 overflow-hidden bg-white/40 p-4">
              <PhotoFrame src={product.image} alt={product.name} className="h-full w-full object-contain" />
              <span className="absolute right-4 top-4 rounded-full bg-espresso/75 px-3.5 py-1 text-xs font-semibold text-cream backdrop-blur-md">
                ৳{product.price}
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <h2 className="font-display text-xl font-medium text-espresso">{product.name}</h2>
                <div className="mt-2 flex items-center justify-between text-sm text-espresso/70">
                  <span>Size: <strong className="text-espresso">{product.size}</strong></span>
                  <span>Stock: <strong className="text-espresso">{product.stock}</strong></span>
                </div>
                <p className="mt-2 text-xs text-espresso/60 line-clamp-2">{product.description}</p>
                <div className="mt-4 border-t border-espresso/10 pt-3 text-xs text-espresso/70 space-y-1">
                  <p><strong>Seller:</strong> {product.adderName}</p>
                  <p><strong>Email:</strong> {product.adderEmail}</p>
                  <p><strong>Status:</strong> <span className="font-semibold text-coffee">{product.approve}</span></p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleApprove(product._id)}
                  disabled={product.approve === "Accepted"}
                  className="rounded-full bg-success/15 px-4 py-2 text-xs font-semibold text-success hover:bg-success hover:text-white transition disabled:opacity-40"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(product._id)}
                  disabled={product.approve === "Rejected"}
                  className="rounded-full bg-caramel/20 px-4 py-2 text-xs font-semibold text-espresso hover:bg-caramel transition disabled:opacity-40"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="rounded-full bg-error/15 px-4 py-2 text-xs font-semibold text-error hover:bg-error hover:text-white transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MngProducts;