import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // No backend endpoint exists yet — client-side confirmation only.
    setSent(true);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FBF7F0]">
      <Navbar />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#E07A5F]">
          Contact
        </p>
        <h1
          className="mb-8 text-4xl font-semibold text-[#14213D]"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Talk to Bazario
        </h1>

        {sent ? (
          <div className="rounded-lg border border-green-300 bg-green-50 p-6 text-center">
            <h2 className="mb-2 text-xl font-semibold text-green-800">
              Message sent!
            </h2>
            <p className="text-green-700">
              Thanks, {form.name || "friend"} — we&apos;ll get back to you at{" "}
              {form.email} shortly.
            </p>
            <button
              onClick={() => {
                setForm({ name: "", email: "", message: "" });
                setSent(false);
              }}
              className="mt-4 rounded-md bg-[#14213D] px-4 py-2 text-sm text-white transition hover:bg-[#14213D]/80"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-lg border border-[#14213D]/15 bg-white p-6"
          >
            <label className="flex flex-col gap-1">
              <span className="font-mono text-xs uppercase tracking-widest text-slate-600">
                Name
              </span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="rounded-md border border-slate-300 px-3 py-2 focus:border-[#14213D] focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-mono text-xs uppercase tracking-widest text-slate-600">
                Email
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="rounded-md border border-slate-300 px-3 py-2 focus:border-[#14213D] focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-mono text-xs uppercase tracking-widest text-slate-600">
                Message
              </span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="What can we help you with?"
                className="rounded-md border border-slate-300 px-3 py-2 focus:border-[#14213D] focus:outline-none"
              />
            </label>

            <button
              type="submit"
              className="mt-2 rounded-md bg-[#14213D] px-6 py-3 text-white transition hover:bg-[#14213D]/80"
            >
              Send Message
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Contact;
