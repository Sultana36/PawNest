import { Link } from "react-router";
import { FiArrowLeft } from "react-icons/fi";

const ErrorPage = () => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="glass-light max-w-md rounded-[2.5rem] p-12 shadow-2xl">
        <h1 className="font-display text-7xl font-light text-coffee">404</h1>
        <h2 className="mt-4 font-display text-3xl font-medium text-espresso">Page Not Found</h2>
        <p className="mt-3 text-espresso/70">
          Sorry, the page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
        </p>
        <div className="mt-8">
          <Link to="/" className="btn-cream w-full justify-center !py-3 text-base">
            <FiArrowLeft /> Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;