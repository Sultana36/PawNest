import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { RxAvatar } from "react-icons/rx";
import { API_URL } from "../../api";

const User = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/users`)
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleMakeAdmin = async (userId) => {
    try {
      const res = await axios.put(`${API_URL}/users/admin/${userId}`);
      if (res.data.modifiedCount > 0) {
        toast.success("User promoted to Admin!");
        setUsers(prev => prev.map(user => user._id === userId ? { ...user, role: 'admin' } : user));
      }
    } catch (err) {
      toast.error("Failed to promote user.");
      console.error(err);
    }
  };

  const handleRemoveAdmin = async (userId) => {
    try {
      const res = await axios.put(`${API_URL}/users/remove-admin/${userId}`);
      if (res.data.modifiedCount > 0) {
        toast.info("User removed from Admin!");
        setUsers(prev => prev.map(user => user._id === userId ? { ...user, role: 'user' } : user));
      }
    } catch (err) {
      toast.error("Failed to remove admin role.");
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <ToastContainer theme="dark" />

      <div>
        <h1 className="font-display text-3xl font-medium text-espresso">All Registered Users</h1>
        <p className="mt-1 text-sm text-espresso/70">Manage platform users and administrator privileges.</p>
      </div>

      <div className="glass-light overflow-x-auto rounded-[2rem] p-6 shadow-xl">
        <table className="w-full text-left text-sm text-espresso">
          <thead className="border-b border-espresso/10 text-xs uppercase tracking-wider text-coffee">
            <tr>
              <th className="py-3.5 pl-4">#</th>
              <th className="py-3.5">Profile</th>
              <th className="py-3.5">Name</th>
              <th className="py-3.5">Email</th>
              <th className="py-3.5">Phone</th>
              <th className="py-3.5">City</th>
              <th className="py-3.5">Role</th>
              <th className="py-3.5 pr-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-espresso/5">
            {users.map((user, index) => (
              <tr key={user._id} className="transition-colors hover:bg-white/40">
                <td className="py-4 pl-4 font-semibold">{index + 1}</td>
                <td className="py-4">
                  {user.image ? (
                    <img src={user.image} alt="User" className="h-10 w-10 rounded-full object-cover shadow-md" />
                  ) : (
                    <RxAvatar className="h-10 w-10 text-espresso/50" />
                  )}
                </td>
                <td className="py-4 font-medium text-espresso">{user.name}</td>
                <td className="py-4 text-xs text-espresso/70">{user.email}</td>
                <td className="py-4">{user.phone}</td>
                <td className="py-4">{user.city}</td>
                <td className="py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${user.role === 'admin' ? 'bg-coffee text-cream' : 'bg-espresso/10 text-espresso'}`}>
                    {user.role || 'user'}
                  </span>
                </td>
                <td className="py-4 pr-4 text-right">
                  {user.role === 'admin' ? (
                    <button
                      onClick={() => handleRemoveAdmin(user._id)}
                      className="rounded-full bg-error/15 px-3.5 py-1.5 text-xs font-semibold text-error hover:bg-error hover:text-white transition"
                    >
                      Remove Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMakeAdmin(user._id)}
                      className="rounded-full bg-caramel/20 px-3.5 py-1.5 text-xs font-semibold text-espresso hover:bg-caramel transition"
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;