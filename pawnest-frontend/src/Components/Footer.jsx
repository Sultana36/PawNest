import { Link } from 'react-router';
import PawNestLogo from './Shared/PawNestLogo';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/aboutus', label: 'About Us' },
  { to: '/petlist', label: 'Browse Pets' },
  { to: '/donationcampaigns', label: 'Donation Campaigns' },
  { to: '/petaccesories', label: 'Pet Accessories' },
  { to: '/dashboard', label: 'Dashboard' },
];

const Footer = () => {
  return (
    <footer className="mt-24 px-3 pb-3">
      <div className="water-bg mx-auto max-w-7xl rounded-[2rem]">
        <div className="relative mx-auto grid gap-10 px-6 py-14 sm:px-12 md:grid-cols-3">
          <div>
            <Link to="/" aria-label="PawNest home">
              <PawNestLogo size={44} textClassName="text-cream" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
              A safe and loving place for pet adoption and support. Find your new best friend, or help someone else find theirs.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-display text-xl text-cream">Quick links</h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {quickLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-cream/70 transition-colors hover:text-caramel"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-display text-xl text-cream">Contact us</h2>
            <p className="text-sm text-cream/70">
              Email:{' '}
              <a
                href="mailto:sultanaakter1667@gmail.com"
                className="transition-colors hover:text-caramel"
              >
                sultanaakter1667@gmail.com
              </a>
            </p>
            <p className="mt-2 text-sm text-cream/70">Location: Sylhet, Bangladesh</p>
          </div>
        </div>

        <div className="relative border-t border-cream/10 px-6 py-5 text-center text-sm text-cream/55">
          &copy; {new Date().getFullYear()} PawNest. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;