import { FaPaw, FaHandHoldingHeart, FaStore, FaEnvelope } from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';

const pillars = [
  {
    title: 'Adopt',
    desc: 'Browse pets in real time and send an adoption request through a secure account.',
    icon: FaPaw,
  },
  {
    title: 'Donate',
    desc: 'Support medical treatments, rescue efforts and shelter improvements with secure online payments.',
    icon: FaHandHoldingHeart,
  },
  {
    title: 'Shop',
    desc: 'Buy and sell pet accessories in a marketplace that supports small sellers.',
    icon: FaStore,
  },
];

const AboutUs = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
      <div className="text-center">
        <span className="font-display text-sm font-semibold uppercase tracking-widest text-coffee">Our story</span>
        <h1 className="mt-2 font-display text-4xl font-medium text-espresso sm:text-5xl">
          About <span className="text-coffee">PawNest</span>
        </h1>
      </div>

      <div className="glass-light mt-10 space-y-6 rounded-[2.5rem] p-8 leading-relaxed text-espresso/80 sm:p-12">
        <p>
          <strong className="text-espresso">PawNest</strong> is a web-based pet adoption and donation platform dedicated
          to connecting loving homes with pets in need. Our goal is to create a secure and transparent environment where
          adoption, responsible pet care, and community support come together.
        </p>
        <p>
          Users can add pets for adoption, browse available pets in real time, and submit adoption requests through a
          secure authentication system. We ensure a smooth and trustworthy experience for both adopters and pet owners.
        </p>
        <p>
          PawNest also supports animal welfare through donation campaigns. With secure online payments, users can
          contribute directly to meaningful causes such as medical treatments, rescue efforts, and shelter improvements.
        </p>
        <p>
          In addition, our platform allows users to sell pet accessories, creating a marketplace that supports pet
          owners and small sellers within the community.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {pillars.map((item) => (
          <div key={item.title} className="glass-light glass-lift rounded-3xl p-7">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-coffee text-cream shadow-md">
              <item.icon size={22} />
            </span>
            <h3 className="mt-5 font-display text-2xl font-medium text-espresso">{item.title}</h3>
            <p className="mt-2 text-espresso/70">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass-light mt-10 flex flex-col items-center gap-6 rounded-3xl p-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h3 className="font-display text-2xl font-medium text-espresso">Questions? We&rsquo;d love to hear from you</h3>
          <p className="mt-1 text-espresso/70">For any inquiries, please feel free to reach out.</p>
        </div>
        <a
          href="mailto:sultanaakter1667@gmail.com"
          className="btn-cream !py-3 text-sm shadow-md"
        >
          <FaEnvelope /> sultanaakter1667@gmail.com
        </a>
      </div>
    </div>
  );
};

export default AboutUs;