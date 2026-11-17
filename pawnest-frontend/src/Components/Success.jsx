import { Link } from "react-router";
import { FiCheckCircle, FiArrowUpRight } from "react-icons/fi";

const Success = () => {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="glass-light max-w-md rounded-[2.5rem] p-10 text-center shadow-2xl">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success/15 text-success">
          <FiCheckCircle size={44} />
        </div>
        <h1 className="mt-6 font-display text-3xl font-medium text-espresso">
          Payment Successful!
        </h1>
        <p className="mt-3 text-espresso/75">
          Thank you for your generous donation. Your support makes a real difference in a pet&rsquo;s life!
        </p>

        <div className="mt-8">
          <Link to="/donationcampaigns" className="btn-cream w-full justify-center !py-3 text-base">
            Back to Campaigns <FiArrowUpRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;