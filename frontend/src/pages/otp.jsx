import Navbar from "../components/navbar";
import Footer from "../components/Footer";

function Otp() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBF7F0]">
      <Navbar />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <h1
          className="mb-3 text-3xl font-semibold text-[#14213D]"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          OTP verification — coming soon
        </h1>
        <p className="text-slate-600">
          OTP codes can&apos;t be sent or verified yet. This page will be
          enabled once the feature ships.
        </p>
      </main>
      <Footer />
    </div>
  );
}

export default Otp;
