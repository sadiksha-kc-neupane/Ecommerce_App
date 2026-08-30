import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer";

function About() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-rust">
          About us
        </p>
        <h1
          className="mb-8 text-4xl font-semibold text-navy font-display"
        >
          Dipti&Suppliers — IT hardware, done right
        </h1>

        <div className="flex flex-col gap-6 text-slate-700 leading-relaxed">
          <p>
            Dipti&Suppliers supplies the hardware businesses and homes
            actually run on — laptops and desktops for daily work, servers
            and networking gear to keep it all connected, smartboards for
            classrooms and meeting rooms, and CCTV systems to keep it all
            secure.
          </p>
          <p>
            We built our catalog the way an IT department shops: real specs,
            real stock counts, and no guesswork. Every listing shows exactly
            what's in the box and what's left on the shelf — whether that's
            a single graphics card or a batch of routers for a full office
            rollout.
          </p>
          <p>
            From single laptops to full CCTV and networking installs, our
            team sources, stocks, and ships the equipment you need — with
            support you can actually reach when something needs a second
            opinion.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { title: "Laptops", note: "Business, gaming & ultrabooks" },
            { title: "Desktops & Server", note: "All-in-ones, towers & servers" },
            { title: "Components", note: "RAM, storage, GPUs & more" },
            { title: "CCTV & Accessories", note: "Cameras, DVR/NVR & cabling" },
            { title: "Printer & Scanner", note: "Inkjet, laser & scanners" },
            { title: "Networking", note: "Routers, switches & access points" },
          ].map((cat) => (
            <div
              key={cat.title}
              className="rounded-lg border border-dashed border-navy/30 bg-white p-4"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-navy">
                {cat.title}
              </p>
              <p className="mt-1 text-sm text-slate-600">{cat.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-navy/15 bg-white p-5 font-mono text-xs uppercase tracking-widest text-slate-500">
          Real stock counts · Fair prices · Restocked weekly · +977-9804045706
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default About;