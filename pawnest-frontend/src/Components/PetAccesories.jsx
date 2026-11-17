import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { AuthContext } from "./Provider/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import { FiShoppingBag, FiTag } from "react-icons/fi";
import { API_URL } from "../api";
import PhotoFrame from "./Shared/PhotoFrame";

const PetAccesories = () => {
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchApprovedProducts();
  }, []);

  const fetchApprovedProducts = async () => {
    const res = await axios.get(`${API_URL}/products/approved`);
    setProducts(res.data);
  };

  const fetchUserCart = async () => {
    if (user?.email) {
      const res = await axios.get(`${API_URL}/cart-user?email=${user.email}`);
      setCartItems(res.data);
    }
  };

  useEffect(() => {
    fetchApprovedProducts();
    if (user?.email) {
      fetchUserCart();
    }
  }, [user]);

  const handleAddToCart = async (product) => {
    const userEmail = user.email;

    const cartItem = {
      productId: product._id,
      name: product.name,
      size: product.size,
      price: product.price,
      image: product.image,
      adderEmail: product.adderEmail,
      userEmail: userEmail,
    };

    const itemsInCart = cartItems.filter(item => item.productId === product._id).length;
    const dbStock = Number(product.stock);

    if (itemsInCart + 1 > dbStock) {
      toast.error(`You can't add more! Only ${dbStock} available in stock.`, { position: 'top-center' });
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/cart`, cartItem);

      if (res.data.insertedId) {
        toast.success("Added to cart", { position: 'top-center', autoClose: 2000 });
        fetchUserCart();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <ToastContainer theme="dark" />
      <div className="text-center">
        <span className="font-display text-sm font-semibold uppercase tracking-widest text-coffee">Shop</span>
        <h1 className="mt-2 font-display text-4xl font-medium text-espresso sm:text-5xl">Pet Accessories</h1>
        <p className="mt-3 text-espresso/70">Everything your furry friend needs for a happy, healthy life.</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
          <div key={product._id} className="glass-light glass-lift flex flex-col overflow-hidden rounded-[2rem]">
            <div className="relative h-56 overflow-hidden">
              <PhotoFrame src={product.image} alt={product.name} className="h-full w-full object-cover" />
              <span className="absolute right-4 top-4 rounded-full bg-espresso/75 px-3.5 py-1 text-xs font-semibold text-cream backdrop-blur-md">
                ৳{product.price}
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <h2 className="font-display text-2xl font-medium text-espresso">{product.name}</h2>
                <div className="mt-3 flex items-center justify-between text-sm text-espresso/70">
                  <span>Size: <strong className="text-espresso">{product.size}</strong></span>
                  <span>In Stock: <strong className="text-espresso">{product.stock}</strong></span>
                </div>
                <p className="mt-3 text-sm text-espresso/70 line-clamp-2">{product.description}</p>
              </div>

              <div className="mt-6">
                {user ? (
                  <button
                    disabled={product.stock == 0}
                    onClick={() => handleAddToCart(product)}
                    className="btn-cream w-full justify-center !py-2.5 text-sm disabled:opacity-50"
                  >
                    <FiShoppingBag /> {product.stock == 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                ) : (
                  <Link to='/login' className="btn-cream w-full justify-center !py-2.5 text-sm">
                    <FiShoppingBag /> Add to Cart
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="glass-light mt-12 rounded-3xl p-12 text-center">
          <p className="font-display text-2xl text-espresso">No accessories currently available.</p>
        </div>
      )}
    </div>
  );
};

export default PetAccesories;