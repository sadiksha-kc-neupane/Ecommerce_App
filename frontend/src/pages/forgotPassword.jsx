import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer";

function Forgot() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Navbar />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <h1
          className="mb-3 text-3xl font-semibold text-navy font-display"
        >
          Password reset — coming soon
        </h1>
        <p className="text-slate-600">
          Password reset isn&apos;t available yet. This page will be enabled
          once the feature ships.
        </p>
      </main>
      <Footer />
    </div>
  );
}

export default Forgot;
