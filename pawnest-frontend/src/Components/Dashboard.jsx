import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router";
import { AuthContext } from "./Provider/AuthProvider";
import { IoMdAdd } from "react-icons/io";
import { MdPets } from "react-icons/md";
import { CiSquareQuestion } from "react-icons/ci";
import { MdCreateNewFolder } from "react-icons/md";
import { FaDonate, FaHome, FaUsers, FaShoppingCart, FaRegFileAlt } from "react-icons/fa";
import { BiDonateHeart } from "react-icons/bi";
import { MdManageAccounts, MdHistory } from "react-icons/md";
import { SiNginxproxymanager } from "react-icons/si";
import { RiProductHuntFill } from "react-icons/ri";
import { API_URL } from "../api";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [currentUserRole, setCurrentUserRole] = useState('');

  useEffect(() => {
    if (user?.email) {
      axios.get(`${API_URL}/users`)
        .then((res) => {
          const loggedInUser = res.data.find((u) => u.email === user.email);
          if (loggedInUser) {
            setCurrentUserRole(loggedInUser.role);
          }
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
        });
    }
  }, [user?.email]);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "bg-coffee text-cream font-semibold rounded-2xl px-4 py-3 flex items-center gap-x-3 shadow-md"
      : "text-espresso/80 hover:bg-coffee/10 hover:text-espresso rounded-2xl px-4 py-3 flex items-center gap-x-3 transition-colors";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-cream">
      {/* Sidebar */}
      {user && currentUserRole === 'user' && (
        <aside className="w-full lg:w-72 glass-light border-r border-espresso/10 p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-medium text-espresso mb-1">User Dashboard</h2>
              <p className="text-sm text-espresso/60">Manage your pets, products, and requests.</p>
            </div>

            <nav className="flex flex-col space-y-2">
              <NavLink to="/dashboard/addpet" className={navLinkClass}><IoMdAdd size={20} />Add a Pet</NavLink>
              <NavLink to="/dashboard/myaddedpets" className={navLinkClass}><MdPets size={20} />My Added Pets</NavLink>
              <NavLink to="/dashboard/addproduct" className={navLinkClass}><IoMdAdd size={20} />Add Products</NavLink>
              <NavLink to="/dashboard/myaddedproducts" className={navLinkClass}><RiProductHuntFill size={20} />My Added Products</NavLink>
              <NavLink to="/dashboard/mycart" className={navLinkClass}><FaShoppingCart size={20} />My Cart</NavLink>
              <NavLink to="/dashboard/orders" className={navLinkClass}><FaRegFileAlt size={20} />Orders</NavLink>
              <NavLink to="/dashboard/adoptionrequest" className={navLinkClass}><CiSquareQuestion size={20} />Adoption Request</NavLink>
              <NavLink to="/dashboard/createdonationcampaign" className={navLinkClass}><MdCreateNewFolder size={20} />Create Campaign</NavLink>
              <NavLink to="/dashboard/mydonationcampaigns" className={navLinkClass}><FaDonate size={20} />My Campaigns</NavLink>
              <NavLink to="/dashboard/mydonations" className={navLinkClass}><BiDonateHeart size={20} />My Donations</NavLink>
            </nav>
          </div>

          <div className="pt-6 border-t border-espresso/10 mt-6">
            <NavLink to="/" className="text-espresso/80 hover:text-coffee font-medium flex items-center gap-x-2 text-sm">
              <FaHome size={18} /> Back to Home
            </NavLink>
          </div>
        </aside>
      )}

      {user && currentUserRole === 'admin' && (
        <aside className="w-full lg:w-72 glass-light border-r border-espresso/10 p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-medium text-espresso mb-1">Admin Dashboard</h2>
              <p className="text-sm text-espresso/60">Manage platform users, pets, and campaigns.</p>
            </div>

            <nav className="flex flex-col space-y-2">
              <NavLink to="/dashboard/users" className={navLinkClass}><FaUsers size={20} />Users</NavLink>
              <NavLink to="/dashboard/allpets" className={navLinkClass}><MdPets size={20} />All Pets</NavLink>
              <NavLink to="/dashboard/alldonations" className={navLinkClass}><BiDonateHeart size={20} />All Donations</NavLink>
              <NavLink to="/dashboard/mngproducts" className={navLinkClass}><SiNginxproxymanager size={20} />Manage Products</NavLink>
              <NavLink to="/dashboard/mngpets" className={navLinkClass}><MdManageAccounts size={20} />Manage Pets</NavLink>
              <NavLink to="/dashboard/mngdonations" className={navLinkClass}><BiDonateHeart size={20} />Manage Campaigns</NavLink>
              <NavLink to="/dashboard/orderhistory" className={navLinkClass}><MdHistory size={20} />Order History</NavLink>
              <NavLink to="/dashboard/donationhistory" className={navLinkClass}><FaDonate size={20} />Donation History</NavLink>
            </nav>
          </div>

          <div className="pt-6 border-t border-espresso/10 mt-6">
            <NavLink to="/" className="text-espresso/80 hover:text-coffee font-medium flex items-center gap-x-2 text-sm">
              <FaHome size={18} /> Back to Home
            </NavLink>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;