import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { animate, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FaCat, FaDog, FaFish, FaHandHoldingHeart, FaPaw, FaShoppingBag } from 'react-icons/fa';
import { GiRabbit } from 'react-icons/gi';
import { FiArrowDown, FiArrowUpRight } from 'react-icons/fi';
import { AuthContext } from './Provider/AuthProvider';
import { API_URL } from '../api';
import CatPortrait from './Shared/CatPortrait';
import PhotoFrame from './Shared/PhotoFrame';

const rise = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } },
};

const CountUp = ({ value }) => {
  const [n, setN] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [value]);

  return <>{n.toLocaleString()}</>;
};

const PhotoFallback = () => (
  <div className="grid h-full w-full place-items-center bg-[linear-gradient(160deg,#C8A27A,#6F4E37)] text-cream/35">
    <FaPaw size={96} />
  </div>
);

const categories = [
  { name: 'Cats', value: 'cat', icon: FaCat },
  { name: 'Dogs', value: 'dog', icon: FaDog },
  { name: 'Rabbits', value: 'rabbit', icon: GiRabbit },
  { name: 'Fish', value: 'fish', icon: FaFish },
  { name: 'Others', value: 'others', icon: FaPaw },
];

const ways = [
  {
    to: '/petlist',
    icon: FaPaw,
    title: 'Adopt a pet',
    desc: 'Browse approved pets and send an adoption request to their owner.',
  },
  {
    to: '/donationcampaigns',
    icon: FaHandHoldingHeart,
    title: 'Back a rescue campaign',
    desc: 'Donate toward a pet\u2019s treatment, food, or shelter and watch the total grow.',
  },
  {
    to: '/petaccesories',
    icon: FaShoppingBag,
    title: 'Shop pet essentials',
    desc: 'Food, toys, and care items listed by the PawNest community.',
  },
];

const steps = [
  { title: 'Browse pets', desc: 'Explore pets that are looking for loving homes.' },
  { title: 'Send a request', desc: 'Pick your companion and submit a simple adoption request.' },
  { title: 'Meet and adopt', desc: 'Arrange a meeting and welcome your new best friend.' },
];

// Sample quotes: replace with real feedback from your users when you have it.
const feedback = [
  {
    name: 'Emily Johnson',
    comment:
      'PawNest made the adoption process so smooth. We found our cat Luna, and she has been the perfect addition to our family.',
  },
  {
    name: 'David Thompson',
    comment: 'I was able to support rescue dogs through donation campaigns. I love the mission and the transparency.',
  },
  {
    name: 'Sophia Lee',
    comment: 'From browsing to adoption, every step was simple and heartwarming. Highly recommend PawNest.',
  },
];

// ---- Hero photo settings -------------------------------------------------
// FACE_X: how far from the left edge of the hero (in %) the middle of the cat's face sits.
// The glass edge cuts through this line, so half the face is ribbed glass and half is sharp.
// If your cat is centred in the photo, leave it at 50. If the cat is on the right, try 65 to 75.
const FACE_X = 50;
// Which part of the photo stays visible when the screen crops it (0 = left/top, 1 = right/bottom).
const PHOTO_FOCUS = { x: 0.5, y: 0.4 };
const RIB_WIDTH = 24;

const photoClass = 'absolute inset-0 h-full w-full object-cover';
const photoStyle = { objectPosition: `${PHOTO_FOCUS.x * 100}% ${PHOTO_FOCUS.y * 100}%` };

// Draws the photo as a row of thin glass ribs (fluted glass). Each rib shows a slightly
// wider slice of the photo squeezed into it, which is what real ribbed glass does.
const FlutedCanvas = ({ src, className = '', style }) => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;

    const img = new Image();
    let frame = 0;

    const draw = () => {
      if (!img.complete || !img.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (!cw || !ch) return;

      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      const W = canvas.width;
      const H = canvas.height;

      const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;

      const base = document.createElement('canvas');
      base.width = W;
      base.height = H;
      base
        .getContext('2d')
        .drawImage(img, (W - dw) * PHOTO_FOCUS.x, (H - dh) * PHOTO_FOCUS.y, dw, dh);

      const ctx = canvas.getContext('2d');
      const rib = RIB_WIDTH * dpr;
      const span = rib * 1.35;

      for (let x = 0; x < W; x += rib) {
        const sx = Math.min(Math.max(x + rib / 2 - span / 2, 0), W - span);
        ctx.drawImage(base, sx, 0, span, H, x, 0, rib + 1, H);
      }
    };

    img.onload = draw;
    img.src = src;

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    });
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [src]);

  return <canvas ref={ref} className={className} style={style} aria-hidden="true" />;
};

const Hero = ({ statItems }) => {
  const [photoOk, setPhotoOk] = useState(true);

  // The edge of the ribbed glass follows the pointer a little, like a lens you can feel
  const edge = useMotionValue(FACE_X);
  const smooth = useSpring(edge, { stiffness: 70, damping: 18 });
  const maskGlass = useTransform(smooth, (v) => `linear-gradient(to right, #000 ${v}%, transparent ${v + 0.2}%)`);
  const maskBlur = useTransform(
    smooth,
    (v) => `linear-gradient(to right, transparent ${v - 32}%, #000 ${v - 0.5}%, transparent ${v}%)`
  );
  const lineLeft = useTransform(smooth, (v) => `${v}%`);

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    edge.set(FACE_X - 4 + Math.min(Math.max(x, 0), 1) * 8);
  };

  const ribs = {
    background: `repeating-linear-gradient(90deg, rgba(255,255,255,0.20) 0px, rgba(255,255,255,0.03) 3px, rgba(0,0,0,0) 8px, rgba(0,0,0,0) ${RIB_WIDTH - 4}px, rgba(0,0,0,0.20) ${RIB_WIDTH}px), repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, rgba(255,255,255,0) 1px, rgba(255,255,255,0) 9px)`,
  };

  return (
    <section className="bg-[linear-gradient(135deg,#efd9c4,#f5ebdd_45%,#e3cbae)] px-3 pb-16 pt-1">
      <div className="relative mx-auto max-w-[1500px]">
        <div
          onPointerMove={handleMove}
          onPointerLeave={() => edge.set(FACE_X)}
          className="water-bg relative min-h-[680px] rounded-[2.5rem] shadow-[0_40px_90px_-40px_rgba(43,27,20,0.7)] lg:h-[min(780px,calc(100svh-120px))]"
        >
          {photoOk ? (
            <>
              {/* sharp photo */}
              <motion.div
                initial={{ scale: 1.12 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <img
                  src="/images/hero-cat.jpg"
                  alt="A cute kitten looking at the camera"
                  className={photoClass}
                  style={photoStyle}
                  onError={() => setPhotoOk(false)}
                />
              </motion.div>

              {/* ribbed liquid glass over the left side of the photo (desktop) */}
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 hidden lg:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.6, delay: 0.5 }}
              >
                <motion.div className="absolute inset-0" style={{ maskImage: maskGlass, WebkitMaskImage: maskGlass }}>
                  <FlutedCanvas
                    src="/images/hero-cat.jpg"
                    className="absolute -inset-5 h-[calc(100%+40px)] w-[calc(100%+40px)] max-w-none"
                    style={{ filter: 'blur(5px) brightness(0.9) saturate(1.05)' }}
                  />
                </motion.div>

                <motion.div className="absolute inset-0" style={{ maskImage: maskBlur, WebkitMaskImage: maskBlur }}>
                  <FlutedCanvas
                    src="/images/hero-cat.jpg"
                    className="absolute -inset-5 h-[calc(100%+40px)] w-[calc(100%+40px)] max-w-none"
                    style={{ filter: 'blur(20px) brightness(0.88) saturate(1.1)' }}
                  />
                </motion.div>

                <motion.div
                  className="absolute inset-0"
                  style={{ ...ribs, maskImage: maskGlass, WebkitMaskImage: maskGlass }}
                />

                <motion.div
                  className="absolute bottom-0 top-0 w-px bg-white/55 shadow-[0_0_24px_6px_rgba(255,255,255,0.28)]"
                  style={{ left: lineLeft }}
                />
              </motion.div>

              {/* keeps the text readable */}
              <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(30,19,14,0.55),rgba(30,19,14,0.25)_38%,transparent_55%)] lg:block" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(30,19,14,0.92),rgba(30,19,14,0.35)_60%,rgba(30,19,14,0.2))] lg:hidden" />
            </>
          ) : (
            <>
              <span className="ripple-ring right-[16%] top-[22%] hidden h-[60%] w-[34%] lg:block" />
              <span
                className="ripple-ring right-[16%] top-[22%] hidden h-[60%] w-[34%] lg:block"
                style={{ animationDelay: '3s' }}
              />
              <CatPortrait className="float-slow absolute bottom-0 right-[8%] hidden h-[90%] lg:block" />
            </>
          )}

          <div className="relative z-10 flex min-h-[680px] flex-col justify-between gap-10 p-6 sm:p-10 lg:h-full lg:min-h-0 lg:p-12">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-dark inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
            >
              <FaPaw className="text-caramel" />
              Adopt. Rescue. Love.
            </motion.div>

            <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-[40rem]">
              <motion.h1
                variants={rise}
                className="font-display text-5xl font-medium leading-[1.04] text-cream [text-shadow:0_2px_30px_rgba(20,10,5,0.45)] sm:text-6xl xl:text-7xl"
              >
                Every pet
                <br />
                deserves a{' '}
                <span className="relative inline-block">
                  <em className="font-normal">gentle</em>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                    className="absolute -bottom-1 left-0 h-3 w-full"
                  >
                    <motion.path
                      d="M3 9 C60 2 140 2 197 8"
                      stroke="#D9A066"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.9, delay: 1.2, ease: 'easeOut' }}
                    />
                  </svg>
                </span>{' '}
                home.
              </motion.h1>

              <motion.p variants={rise} className="mt-6 max-w-md text-lg leading-relaxed text-cream/80">
                Adopt a pet, back a rescue campaign, or shop for care. Everything a new friend needs, in one place.
              </motion.p>

              <motion.div variants={rise} className="mt-9 flex flex-wrap gap-3">
                <Link to="/petlist" className="btn-cream">
                  Meet the pets <FiArrowUpRight />
                </Link>
                <Link to="/donationcampaigns" className="btn-glass">
                  Support a campaign
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="glass-dark glass-water grid grid-cols-2 gap-x-6 gap-y-5 rounded-[1.75rem] p-5 md:grid-cols-4 md:p-6"
            >
              {statItems.map((item, i) => (
                <div key={item.label}>
                  <p className="font-display text-3xl font-medium text-cream md:text-4xl">
                    {item.value === undefined ? '\u2013' : <CountUp value={item.value} />}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-cream/70">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: i % 2 === 0 ? '#D9A066' : '#9DBB86' }}
                    />
                    {item.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.button
          onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll to explore"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-6 left-1/2 z-20 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full bg-espresso text-cream shadow-xl ring-4 ring-cream"
        >
          <FiArrowDown />
        </motion.button>
      </div>
    </section>
  );
};

const Home = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let active = true;

    Promise.allSettled([
      axios.get(`${API_URL}/pet-list`),
      axios.get(`${API_URL}/donation-campaign`),
      axios.get(`${API_URL}/products/approved`),
    ]).then(([pets, campaigns, products]) => {
      if (!active) return;
      const list = (r) => (r.status === 'fulfilled' && Array.isArray(r.value.data) ? r.value.data : []);
      const campaignList = list(campaigns);

      setStats({
        pets: list(pets).length,
        campaigns: campaignList.length,
        raised: campaignList.reduce((sum, c) => sum + (Number(c.donatedAmount) || 0), 0),
        products: list(products).length,
      });
    });

    return () => {
      active = false;
    };
  }, []);

  const statItems = [
    { label: 'Pets waiting for a home', value: stats?.pets },
    { label: 'Active rescue campaigns', value: stats?.campaigns },
    { label: 'Raised for pet care (BDT)', value: stats?.raised },
    { label: 'Items in the pet shop', value: stats?.products },
  ];

  return (
    <div>
      <Hero statItems={statItems} />

      {/* categories */}
      <section id="explore" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-latte/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-caramel/25 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-md font-display text-4xl font-medium text-espresso sm:text-5xl">
              Who are you hoping to meet?
            </h2>
            <Link to="/petlist" className="inline-flex items-center gap-1 font-semibold text-coffee hover:underline">
              See all pets <FiArrowUpRight />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/petlist?category=${cat.value}`}
                className="glass-light glass-lift flex flex-col items-center rounded-3xl p-7"
              >
                <span className="grid h-16 w-16 place-items-center rounded-full bg-coffee text-cream">
                  <cat.icon size={28} />
                </span>
                <span className="mt-4 font-display text-xl text-espresso">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* mission */}
      <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-28 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-[0_30px_70px_-30px_rgba(43,27,20,0.6)]">
            <PhotoFrame
              src="/images/adopt-moment.jpg"
              alt="A person hugging a rescued puppy"
              className="h-full w-full object-cover"
              fallback={<PhotoFallback />}
            />
          </div>
          <div className="glass-light absolute -bottom-6 right-0 w-64 rounded-3xl p-5 sm:-right-4">
            <p className="font-display text-lg leading-snug text-espresso">
              Adoption requests go straight to the pet&rsquo;s owner.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-display text-4xl font-medium leading-tight text-espresso sm:text-5xl">
            Adoption, rescue funding, and pet care in one nest.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-espresso/75">
            PawNest is a community built on love, compassion, and second chances. We connect rescued pets with caring
            families who are ready to offer a forever home.
          </p>

          <div className="mt-8 divide-y divide-espresso/10 border-y border-espresso/10">
            {ways.map((way) => (
              <Link key={way.to} to={way.to} className="group flex items-center gap-5 py-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-coffee text-cream transition-transform group-hover:scale-110">
                  <way.icon size={20} />
                </span>
                <span className="flex-1">
                  <span className="block font-display text-xl text-espresso">{way.title}</span>
                  <span className="mt-0.5 block text-sm text-espresso/70">{way.desc}</span>
                </span>
                <FiArrowUpRight
                  className="shrink-0 text-coffee transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                  size={22}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="bg-[#ebddc7] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="max-w-lg font-display text-4xl font-medium text-espresso sm:text-5xl">
            Three steps to a new best friend
          </h2>

          <motion.div
            className="mt-12 grid gap-6 md:grid-cols-3"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {steps.map((step, index) => (
              <motion.div key={step.title} variants={rise} className="glass-light rounded-3xl p-8">
                <span className="font-display text-6xl font-light text-latte">{index + 1}</span>
                <h3 className="mt-4 text-2xl font-medium text-espresso">{step.title}</h3>
                <p className="mt-2 text-espresso/70">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* what people say */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="font-display text-4xl font-medium text-espresso sm:text-5xl">What adopters could say</h2>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {feedback.map((person, index) => (
            <figure
              key={person.name}
              className={`glass-light flex flex-col justify-between rounded-3xl p-8 ${
                index === 0 ? 'lg:col-span-2 lg:p-10' : ''
              }`}
            >
              <blockquote
                className={`font-display text-espresso ${
                  index === 0 ? 'text-2xl leading-snug sm:text-3xl' : 'text-xl leading-snug'
                }`}
              >
                &ldquo;{person.comment}&rdquo;
              </blockquote>
              <figcaption className="mt-6 font-semibold text-coffee">{person.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* closing call to action */}
      <section className="px-3">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-coffee px-6 py-20 text-center text-cream sm:py-24">
          <PhotoFrame
            src="/images/cta-pets.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-caramel/30 blur-3xl"
          />
          <h2 className="relative mx-auto max-w-2xl font-display text-4xl font-medium sm:text-5xl">
            Someone is waiting to meet you.
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-cream/85">
            Start your adoption journey today. It takes a few minutes to send your first request.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/petlist" className="btn-cream">
              Browse pets <FiArrowUpRight />
            </Link>
            {!user && (
              <Link to="/register" className="btn-glass">
                Create an account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;