import { motion } from "framer-motion";
import CatPortrait from "./CatPortrait";
import PhotoFrame from "./PhotoFrame";

// true  = show a cat photo next to the form
//         (uses public/images/auth-cat.jpg if it exists, otherwise public/images/hero-cat.jpg)
// false = always show the illustrated cartoon cat (CatPortrait.jsx) instead
const USE_PHOTO = false;

const illustration = (
  <>
    <span className="ripple-ring left-1/2 top-[55%] h-72 w-72 -translate-x-1/2 -translate-y-1/2" />
    <span
      className="ripple-ring left-1/2 top-[55%] h-72 w-72 -translate-x-1/2 -translate-y-1/2"
      style={{ animationDelay: "2.3s" }}
    />
    <CatPortrait className="float-slow absolute -bottom-6 left-1/2 w-[88%] -translate-x-1/2" />
  </>
);

const photoClass = "absolute inset-0 h-full w-full object-cover object-center";

const AuthShell = ({ title, subtitle, artTitle, artText, children, footer }) => {
  return (
    <section className="water-bg -mt-[76px] flex min-h-screen items-center justify-center px-4 pb-12 pt-[76px]">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glass-dark mt-8 grid w-full max-w-5xl overflow-hidden rounded-[2rem] lg:grid-cols-5"
      >
        <div className="relative hidden min-h-[560px] overflow-hidden bg-black/15 lg:col-span-2 lg:block">
          {USE_PHOTO ? (
            <PhotoFrame
              src="/images/auth-cat.jpg"
              alt=""
              className={photoClass}
              fallback={
                <PhotoFrame
                  src="/images/hero-cat.jpg"
                  alt=""
                  className={photoClass}
                  fallback={illustration}
                />
              }
            />
          ) : (
            illustration
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(30,19,14,0.85),rgba(30,19,14,0.2)_45%,rgba(30,19,14,0.45))]" />
          <div className="relative z-10 p-8">
            <h2 className="font-display text-3xl font-medium leading-tight text-cream">{artTitle}</h2>
            <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-cream/75">{artText}</p>
          </div>
        </div>

        <div className="p-8 sm:p-12 lg:col-span-3">
          <h1 className="font-display text-4xl font-medium text-cream">{title}</h1>
          <p className="mt-2 text-cream/70">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 text-center text-cream/70">{footer}</div>}
        </div>
      </motion.div>
    </section>
  );
};

export default AuthShell;