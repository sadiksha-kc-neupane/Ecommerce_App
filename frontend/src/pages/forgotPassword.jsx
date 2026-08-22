import { Link } from "react-router-dom";
import Navbar from "../components/navbar";

function Forgot() {
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center p-12">
        {/* Author: FormBold Team */}
        <div className="mx-auto w-full max-w-[550px] bg-white">
          <form>
            <div className="mb-5">
              <label className="mb-5 block text-base font-semibold text-[#07074D] sm:text-xl">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>

            <Link to="/otp">
              <button className="hover:shadow-form w-full rounded-md bg-[#31bd4a] py-3 px-8 text-center text-base font-semibold text-white outline-none">
                Send OTP
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Forgot;
