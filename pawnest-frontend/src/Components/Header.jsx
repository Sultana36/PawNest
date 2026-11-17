import { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { AuthContext } from './Provider/AuthProvider';
import PawNestLogo from './Shared/PawNestLogo';

const barStyle = {
  background: 'linear-gradient(135deg, rgba(43,27,20,0.84), rgba(43,27,20,0.64))',
};

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-white/15 text-caramel'
      : 'text-cream/80 hover:bg-white/10 hover:text-cream'
  }`;

const Header = () => {
  const { user, SignOut } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const loggedIn = user && user.emailVerified;

  const links = [
    { to: '/', label: 'Home' },
    { to: '/aboutus', label: 'About Us' },
    { to: '/petlist', label: 'Pet List' },
    { to: '/donationcampaigns', label: 'Donation Campaigns' },
    { to: '/petaccesories', label: 'Pet Accessories' },
  ];
  if (loggedIn) links.push({ to: '/dashboard', label: 'Dashboard' });

  return (
    <header className="relative px-3 pt-3">
      <div
        style={barStyle}
        className="glass-dark mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full pl-4 pr-3"
      >
        <Link to="/" aria-label="PawNest home" onClick={() => setOpen(false)}>
          <PawNestLogo size={38} textClassName="text-cream hidden sm:inline" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {loggedIn ? (
            <button
              onClick={SignOut}
              className="rounded-full border border-cream/30 px-5 py-2 text-sm font-semibold text-cream transition hover:bg-white/10"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn-cream !px-5 !py-2 text-sm">
              Login
            </Link>
          )}

          <button
            className="grid h-10 w-10 place-items-center rounded-full text-cream transition hover:bg-white/10 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={barStyle}
            className="glass-dark absolute left-3 right-3 top-full z-50 mt-2 flex flex-col gap-1 rounded-3xl p-3 lg:hidden"
            aria-label="Mobile"
          >
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={navClass}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;