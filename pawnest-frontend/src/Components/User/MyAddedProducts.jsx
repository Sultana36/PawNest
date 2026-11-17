import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiTrash2, FiBox, FiClock } from "react-icons/fi";
import { AuthContext } from "../Provider/AuthProvider";
import { API_URL } from "../../api";
import PhotoFrame from "../Shared/PhotoFrame";

const MyAddedProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (user?.email) fetchProducts();
  }, [user?.email]);

  const fetchProducts = async () => {
    const res = await axios.get(`${API_URL}/my-products/${user.email}`);
    setProducts(res.data);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Delete Product?",
      text: "This action is permanent!",
      icon: "warning",
      showCancelButton: true,
      background: "#f5ebdd",
      confirmButtonColor: "#ff7a00",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${API_URL}/products/${id}`);
        setProducts(products.filter((item) => item._id !== id));
        Swal.fire("Deleted!", "Item removed.", "success");
      }
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl font-medium text-espresso">My Products</h1>

      {products.length === 0 ? (
        <div className="glass-light rounded-[2rem] p-20 text-center"><p className="text-2xl text-espresso/40">No products added yet.</p></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id} className="glass-light border border-espresso/10 flex flex-col rounded-[2.5rem] overflow-hidden shadow-xl group hover:shadow-2xl transition-all">
                <div className="relative h-56 overflow-hidden">
                    <PhotoFrame src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-coffee text-foam px-4 py-1.5 rounded-full font-bold text-sm shadow-lg">
                        ৳{product.price}
                    </div>
                </div>

                <div className="p-6 flex flex-1 flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-espresso">{product.name}</h3>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-espresso/60 bg-coffee/5 p-2 rounded-xl"><FiBox/> Stock: {product.stock}</div>
                        <div className={`flex items-center gap-2 text-xs font-bold p-2 rounded-xl ${product.approve === 'Accepted' ? 'bg-success/10 text-success' : 'bg-warning/10 text-coffee'}`}><FiClock/> {product.approve || 'Pending'}</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-espresso/5 flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-espresso/30">Added: {new Date(product.createdAt).toLocaleDateString()}</span>
                    <button onClick={() => handleDelete(product._id)} className="p-3 bg-error/10 text-error rounded-full hover:bg-error hover:text-white transition shadow-sm">
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAddedProducts;