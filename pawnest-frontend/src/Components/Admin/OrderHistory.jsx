import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../api";
import PhotoFrame from "../Shared/PhotoFrame";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/order-history`);
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-medium text-espresso">Admin Order History</h1>
        <p className="mt-1 text-sm text-espresso/70">Complete record of shop accessory orders.</p>
      </div>

      {orders.length === 0 ? (
        <div className="glass-light rounded-3xl p-12 text-center">
          <p className="font-display text-2xl text-espresso">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="glass-light rounded-[2.5rem] p-6 sm:p-8 shadow-xl">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-1.5 text-sm text-espresso/80">
                  <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                  <p><strong>Total:</strong> <span className="text-coffee font-semibold">৳{order.totalPrice} BDT</span></p>
                  <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                </div>

                <div className="space-y-1.5 text-sm text-espresso/80">
                  <p><strong>Buyer:</strong> {order.buyerName}</p>
                  <p><strong>Email:</strong> {order.buyerEmail}</p>
                  <p><strong>Phone:</strong> {order.buyerPhone}</p>
                  <p><strong>Address:</strong> {order.address}</p>
                </div>
              </div>

              <div className="my-6 border-t border-espresso/10" />

              <div className="space-y-4">
                <h4 className="font-display text-lg text-espresso">Ordered Items</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 rounded-2xl bg-white/40 p-4">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl shadow-md">
                        <PhotoFrame src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h5 className="font-display text-base font-medium text-espresso">{item.name}</h5>
                        <p className="text-xs text-espresso/70">Size: {item.size} | Price: ৳{item.price} BDT</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;