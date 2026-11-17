import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../Provider/AuthProvider";
import { FiTrash2, FiUser, FiMapPin, FiPhone, FiPackage } from "react-icons/fi";
import { API_URL } from "../../api";
import PhotoFrame from "../Shared/PhotoFrame";

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user?.email) fetchSellerOrders();
  }, [user?.email]);

  const fetchSellerOrders = async () => {
    const res = await axios.get(`${API_URL}/seller-orders/${user.email}`);
    setOrders(res.data);
  };

  const handleDeleteOrder = async (id) => {
    await axios.delete(`${API_URL}/order/${id}`);
    setOrders((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <div className="max-w-5xl space-y-8">
      <h1 className="font-display text-4xl font-medium text-espresso">Seller Orders</h1>

      {orders.length === 0 ? (
        <div className="glass-light rounded-[2rem] p-20 text-center shadow-xl">
            <p className="text-2xl text-espresso/40">No orders received yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => {
            const sellerItems = order.items.filter((item) => item.adderEmail === user.email);
            const sellerTotal = sellerItems.reduce((total, item) => total + parseFloat(item.price), 0);

            return (
              <div key={order._id} className="glass-light rounded-[3rem] overflow-hidden shadow-2xl border border-espresso/5">
                <div className="bg-espresso/5 p-8 border-b border-espresso/5">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-coffee font-bold uppercase text-[10px] tracking-widest">
                        <FiUser /> Buyer Information
                      </div>
                      <h3 className="font-display text-2xl text-espresso font-bold leading-none">{order.buyerName}</h3>
                      <div className="flex flex-col gap-1 text-sm text-espresso/70">
                        <span className="flex items-center gap-2"><FiPhone size={14}/> {order.buyerPhone}</span>
                        <span className="italic">{order.buyerEmail}</span>
                      </div>
                    </div>
                    <div className="md:text-right space-y-3">
                       <div className="flex md:justify-end items-center gap-3 text-coffee font-bold uppercase text-[10px] tracking-widest">
                        <FiMapPin /> Delivery Address
                      </div>
                      <p className="text-sm font-medium text-espresso/80 leading-relaxed">{order.address}</p>
                      <p className="text-[10px] font-bold text-coffee/40 uppercase tracking-tighter">Ordered: {new Date(order.orderDate).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-4">
                  {sellerItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-5 rounded-2xl bg-white/40 p-4 border border-white/50 shadow-sm">
                      <div className="h-20 w-20 overflow-hidden rounded-xl shadow-inner border border-espresso/5">
                        <PhotoFrame src={item.image} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-display text-xl font-bold text-espresso">{item.name}</h4>
                        <p className="text-[10px] font-bold text-coffee/60 uppercase tracking-widest">Size: {item.size}</p>
                      </div>
                      <div className="text-2xl font-display font-bold text-espresso">৳{item.price}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-coffee/5 p-6 px-10 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-coffee uppercase tracking-widest">Total for your shop</span>
                    <span className="text-3xl font-display font-black text-espresso">৳{sellerTotal}</span>
                  </div>
                  <button onClick={() => handleDeleteOrder(order._id)} className="flex items-center gap-2 bg-error text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:bg-red-700 transition-all">
                    <FiTrash2 size={18} /> Cancel Order
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;