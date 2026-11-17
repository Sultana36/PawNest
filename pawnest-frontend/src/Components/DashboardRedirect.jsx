import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "./Provider/AuthProvider";
import axios from "axios";
import { API_URL } from "../api";

const DashboardRedirect = () => {
  const { user } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      axios.get(`${API_URL}/users`)
        .then(res => {
          const currentUser = res.data.find(u => u.email === user.email);
          if (currentUser) {
            setRole(currentUser.role);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user?.email]);

  if (loading) return <div className="p-20 text-center font-display text-2xl text-espresso">Loading dashboard...</div>;

  if (role === 'admin') {
    return <Navigate to="/dashboard/users" replace />;
  }

  return <Navigate to="/dashboard/addpet" replace />;
};

export default DashboardRedirect;