import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../Provider/AuthProvider";
import { MdDelete } from "react-icons/md";
import { API_URL } from "../../api";
import PhotoFrame from "../Shared/PhotoFrame";
import { FiShoppingBag, FiTruck } from "react-icons/fi";

const Mycart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.email) {
      fetchCartItems();
      setFormData((prev) => ({ ...prev, email: user.email, name: user.displayName || "" }));
    }
  }, [user?.email]);

  const fetchCartItems = async () => {
    const res = await axios.get(`${API_URL}/cart/${user.email}`);
    setCartItems(res.data);
  };

  const totalPrice = cartItems.reduce((total, item) => total + parseFloat(item.price), 0);

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/orders`, { ...formData, items: cartItems, totalPrice, paymentMethod: "Cash On Delivery", orderDate: new Date(), buyerName: formData.name, buyerEmail: formData.email, buyerPhone: formData.phone });
      setCartItems([]); setShowModal(false);
      Swal.fire({ title: "Success!", text: "Order placed successfully.", icon: "success", background: "#f5ebdd", confirmButtonColor: "#6f4e37" });
    } catch (error) { Swal.fire("Error", "Stock issue or server error.", "error"); }
  };

  const handleDeleteItem = async (id) => {
    await axios.delete(`${API_URL}/cart/${id}`);
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <div className="max-w-5xl space-y-8">
      <h1 className="font-display text-4xl font-medium text-espresso">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="glass-light rounded-[2rem] p-24 text-center shadow-2xl">
            <FiShoppingBag size={48} className="mx-auto text-espresso/20 mb-4" />
            <p className="text-2xl text-espresso/40 font-display">Your cart is currently empty</p>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="glass-light flex items-center gap-6 rounded-[2.5rem] p-5 shadow-xl border border-espresso/10 hover:translate-x-1 transition-transform">
                <div className="h-32 w-32 shrink-0 overflow-hidden rounded-3xl shadow-md border-2 border-white">
                  <PhotoFrame src={item.image} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-display text-2xl font-bold text-espresso">{item.name}</h4>
                  <p className="text-xs font-bold text-coffee uppercase tracking-widest opacity-60 mt-1">Size: {item.size}</p>
                  <p className="font-display text-2xl font-black text-espresso mt-2">৳{item.price}</p>
                </div>
                <button onClick={() => handleDeleteItem(item._id)} className="p-4 text-error/30 hover:text-error transition transform hover:scale-110"><MdDelete size={34} /></button>
              </div>
            ))}
          </div>
          <div className="glass-light h-fit rounded-[3rem] p-10 shadow-2xl border border-coffee/20 flex flex-col items-center text-center">
            <h3 className="font-display text-2xl font-bold text-espresso mb-2">Checkout Total</h3>
            <div className="w-16 h-1 bg-coffee/10 rounded-full mb-6"></div>
            <div className="space-y-1">
                <span className="text-6xl font-display font-black text-espresso">৳{totalPrice}</span>
                <p className="text-[10px] font-bold text-coffee uppercase tracking-widest">Inclusive of taxes</p>
            </div>
            <button onClick={() => setShowModal(true)} className="w-full mt-10 rounded-2xl bg-coffee py-5 font-display font-black text-foam shadow-xl hover:bg-espresso hover:-translate-y-1 transition-all active:translate-y-0">
              Proceed to Delivery
            </button>
            <p className="mt-4 text-[10px] font-medium text-espresso/40 italic">Payment: Cash on Delivery Only</p>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl">
          <div className="absolute inset-0 bg-espresso/60" onClick={() => setShowModal(false)} />
          <div className="glass-dark relative z-10 w-full max-w-md rounded-[3.5rem] p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10">
            <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 bg-caramel/20 rounded-full flex items-center justify-center text-caramel mb-4"><FiTruck size={32}/></div>
                <h3 className="font-display text-4xl text-foam font-medium">Shipment</h3>
                <p className="text-foam/40 text-sm mt-1 font-medium">Where should we send your items?</p>
            </div>
            <form onSubmit={handleConfirmOrder} className="space-y-4">
              <input type="text" placeholder="Full Recipient Name" className="w-full rounded-2xl border border-cream/20 bg-white/10 px-5 py-4 text-cream outline-none focus:border-caramel transition-all" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <input type="number" placeholder="11-Digit Contact Number" className="w-full rounded-2xl border border-cream/20 bg-white/10 px-5 py-4 text-cream outline-none focus:border-caramel transition-all" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              <textarea placeholder="Exact Delivery Address" className="w-full rounded-2xl border border-cream/20 bg-white/10 px-5 py-4 text-cream outline-none focus:border-caramel transition-all" rows="3" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              <button type="submit" className="w-full rounded-2xl bg-coffee py-5 font-display font-black text-foam shadow-xl hover:bg-black transition-all mt-6 uppercase tracking-widest text-sm">
                Confirm & Place Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Mycart;